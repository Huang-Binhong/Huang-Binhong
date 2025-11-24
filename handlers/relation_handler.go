package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"huangbinhong/database"
	"huangbinhong/models"

	"github.com/gorilla/mux"
)

// GetRelations 获取关系列表（支持分页和筛选）
// GET /api/v1/relations?page=1&pageSize=10&type=朋友&personId=1
func GetRelations(w http.ResponseWriter, r *http.Request) {
	// 获取查询参数
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("pageSize")
	relationType := r.URL.Query().Get("type")
	personIDStr := r.URL.Query().Get("personId")

	// 设置默认值
	page := 1
	pageSize := 10

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if pageSizeStr != "" {
		if s, err := strconv.Atoi(pageSizeStr); err == nil && s > 0 {
			pageSize = s
		}
	}

	offset := (page - 1) * pageSize

	db := database.GetDB()

	// 构建WHERE条件
	conditions := []string{}
	args := []interface{}{}

	if relationType != "" {
		conditions = append(conditions, "relation_type = ?")
		args = append(args, relationType)
	}

	if personIDStr != "" {
		if personID, err := strconv.Atoi(personIDStr); err == nil {
			// 查询涉及该人物的所有关系（作为起点或终点）
			conditions = append(conditions, "(from_person_id = ? OR to_person_id = ?)")
			args = append(args, personID, personID)
		}
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = " WHERE " + strings.Join(conditions, " AND ")
	}

	// 获取总数
	countQuery := "SELECT COUNT(*) FROM relations" + whereClause
	var total int
	err := db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to count relations")
		return
	}

	// 查询数据
	query := "SELECT relation_id, from_person_id, to_person_id, relation_type, description, created_at, updated_at FROM relations" + whereClause + " ORDER BY relation_id LIMIT ? OFFSET ?"
	queryArgs := append(args, pageSize, offset)

	rows, err := db.Query(query, queryArgs...)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query relations")
		return
	}
	defer rows.Close()

	relations := []models.Relation{}
	for rows.Next() {
		var rel models.Relation
		err := rows.Scan(&rel.RelationID, &rel.FromPersonID, &rel.ToPersonID, &rel.RelationType, &rel.Description, &rel.CreatedAt, &rel.UpdatedAt)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to scan relation")
			return
		}
		relations = append(relations, rel)
	}

	// 返回分页数据
	PaginationResponse(w, relations, total, page, pageSize)
}

// GetRelation 获取单个关系详情
// GET /api/v1/relations/{id}
func GetRelation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid relation ID")
		return
	}

	db := database.GetDB()
	query := "SELECT relation_id, from_person_id, to_person_id, relation_type, description, created_at, updated_at FROM relations WHERE relation_id = ?"

	var rel models.Relation
	err = db.QueryRow(query, id).Scan(&rel.RelationID, &rel.FromPersonID, &rel.ToPersonID, &rel.RelationType, &rel.Description, &rel.CreatedAt, &rel.UpdatedAt)
	if err == sql.ErrNoRows {
		ErrorResponse(w, http.StatusNotFound, "Relation not found")
		return
	} else if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query relation")
		return
	}

	SuccessResponse(w, rel)
}

// CreateRelation 创建关系
// POST /api/v1/relations
func CreateRelation(w http.ResponseWriter, r *http.Request) {
	var req models.RelationCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// 验证必填字段
	if strings.TrimSpace(req.RelationType) == "" {
		ErrorResponse(w, http.StatusBadRequest, "Relation type is required")
		return
	}
	if req.FromPersonID == 0 {
		ErrorResponse(w, http.StatusBadRequest, "From person ID is required")
		return
	}
	if req.ToPersonID == 0 {
		ErrorResponse(w, http.StatusBadRequest, "To person ID is required")
		return
	}
	if req.FromPersonID == req.ToPersonID {
		ErrorResponse(w, http.StatusBadRequest, "From person and to person cannot be the same")
		return
	}

	db := database.GetDB()

	// 验证from_person_id和to_person_id是否存在
	var fromExists, toExists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM persons WHERE person_id = ?)", req.FromPersonID).Scan(&fromExists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check from person")
		return
	}
	if !fromExists {
		ErrorResponse(w, http.StatusBadRequest, "From person not found")
		return
	}

	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM persons WHERE person_id = ?)", req.ToPersonID).Scan(&toExists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check to person")
		return
	}
	if !toExists {
		ErrorResponse(w, http.StatusBadRequest, "To person not found")
		return
	}

	query := "INSERT INTO relations (from_person_id, to_person_id, relation_type, description) VALUES (?, ?, ?, ?)"

	result, err := db.Exec(query, req.FromPersonID, req.ToPersonID, req.RelationType, req.Description)
	if err != nil {
		// 检查是否违反唯一约束
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			ErrorResponse(w, http.StatusConflict, "Relation already exists")
			return
		}
		ErrorResponse(w, http.StatusInternalServerError, "Failed to create relation")
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to get relation ID")
		return
	}

	// 返回创建的关系
	var rel models.Relation
	query = "SELECT relation_id, from_person_id, to_person_id, relation_type, description, created_at, updated_at FROM relations WHERE relation_id = ?"
	err = db.QueryRow(query, id).Scan(&rel.RelationID, &rel.FromPersonID, &rel.ToPersonID, &rel.RelationType, &rel.Description, &rel.CreatedAt, &rel.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query created relation")
		return
	}

	SuccessResponse(w, rel)
}

// UpdateRelation 更新关系
// PUT /api/v1/relations/{id}
func UpdateRelation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid relation ID")
		return
	}

	var req models.RelationUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	db := database.GetDB()

	// 检查关系是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM relations WHERE relation_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check relation")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Relation not found")
		return
	}

	// 构建更新语句
	updates := []string{}
	args := []interface{}{}

	if req.RelationType != nil {
		updates = append(updates, "relation_type = ?")
		args = append(args, *req.RelationType)
	}
	if req.Description != nil {
		updates = append(updates, "description = ?")
		args = append(args, *req.Description)
	}

	if len(updates) == 0 {
		ErrorResponse(w, http.StatusBadRequest, "No fields to update")
		return
	}

	updates = append(updates, "updated_at = CURRENT_TIMESTAMP")
	args = append(args, id)

	query := fmt.Sprintf("UPDATE relations SET %s WHERE relation_id = ?", strings.Join(updates, ", "))
	_, err = db.Exec(query, args...)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to update relation")
		return
	}

	// 返回更新后的关系
	var rel models.Relation
	query = "SELECT relation_id, from_person_id, to_person_id, relation_type, description, created_at, updated_at FROM relations WHERE relation_id = ?"
	err = db.QueryRow(query, id).Scan(&rel.RelationID, &rel.FromPersonID, &rel.ToPersonID, &rel.RelationType, &rel.Description, &rel.CreatedAt, &rel.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query updated relation")
		return
	}

	SuccessResponse(w, rel)
}

// DeleteRelation 删除关系
// DELETE /api/v1/relations/{id}
func DeleteRelation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid relation ID")
		return
	}

	db := database.GetDB()

	// 检查关系是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM relations WHERE relation_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check relation")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Relation not found")
		return
	}

	// 删除关系
	_, err = db.Exec("DELETE FROM relations WHERE relation_id = ?", id)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to delete relation")
		return
	}

	DeleteSuccessResponse(w, "Relation deleted successfully")
}

// GetPersonRelations 获取某人物的所有关系
// GET /api/v1/persons/{personId}/relations
func GetPersonRelations(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	personIDStr := vars["personId"]

	personID, err := strconv.Atoi(personIDStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid person ID")
		return
	}

	db := database.GetDB()

	// 检查人物是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM persons WHERE person_id = ?)", personID).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check person")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Person not found")
		return
	}

	// 查询涉及该人物的所有关系（作为起点或终点）
	query := "SELECT relation_id, from_person_id, to_person_id, relation_type, description, created_at, updated_at FROM relations WHERE from_person_id = ? OR to_person_id = ? ORDER BY relation_id"

	rows, err := db.Query(query, personID, personID)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query relations")
		return
	}
	defer rows.Close()

	relations := []models.Relation{}
	for rows.Next() {
		var rel models.Relation
		err := rows.Scan(&rel.RelationID, &rel.FromPersonID, &rel.ToPersonID, &rel.RelationType, &rel.Description, &rel.CreatedAt, &rel.UpdatedAt)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to scan relation")
			return
		}
		relations = append(relations, rel)
	}

	SuccessResponse(w, relations)
}
