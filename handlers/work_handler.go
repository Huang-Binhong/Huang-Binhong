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

// GetWorks 获取作品列表（支持分页、模糊搜索和筛选）
// GET /api/v1/works?page=1&pageSize=10&search=黄山&category=画作&stylePeriod=晚期&material=纸本设色&personId=1
func GetWorks(w http.ResponseWriter, r *http.Request) {
	// 获取查询参数
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("pageSize")
	search := r.URL.Query().Get("search")
	category := r.URL.Query().Get("category")
	stylePeriod := r.URL.Query().Get("stylePeriod")
	material := r.URL.Query().Get("material")
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

	if search != "" {
		conditions = append(conditions, "(title LIKE ? OR description LIKE ?)")
		searchPattern := "%" + search + "%"
		args = append(args, searchPattern, searchPattern)
	}

	if category != "" {
		conditions = append(conditions, "category = ?")
		args = append(args, category)
	}

	if stylePeriod != "" {
		conditions = append(conditions, "style_period = ?")
		args = append(args, stylePeriod)
	}

	if material != "" {
		conditions = append(conditions, "material = ?")
		args = append(args, material)
	}

	if personIDStr != "" {
		if personID, err := strconv.Atoi(personIDStr); err == nil {
			conditions = append(conditions, "person_id = ?")
			args = append(args, personID)
		}
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = " WHERE " + strings.Join(conditions, " AND ")
	}

	// 获取总数
	countQuery := "SELECT COUNT(*) FROM works" + whereClause
	var total int
	err := db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to count works")
		return
	}

	// 查询数据
	query := "SELECT work_id, person_id, title, category, style_period, creation_year, dimensions, seal, inscription, material, creation_date, description, work_image_url, created_at, updated_at FROM works" + whereClause + " ORDER BY work_id LIMIT ? OFFSET ?"
	queryArgs := append(args, pageSize, offset)

	rows, err := db.Query(query, queryArgs...)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query works")
		return
	}
	defer rows.Close()

	works := []models.Work{}
	for rows.Next() {
		var work models.Work
		err := rows.Scan(&work.WorkID, &work.PersonID, &work.Title, &work.Category, &work.StylePeriod, &work.CreationYear, &work.Dimensions, &work.Seal, &work.Inscription, &work.Material, &work.CreationDate, &work.Description, &work.WorkImageURL, &work.CreatedAt, &work.UpdatedAt)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to scan work")
			return
		}
		works = append(works, work)
	}

	// 返回分页数据
	PaginationResponse(w, works, total, page, pageSize)
}

// GetWork 获取单个作品详情
// GET /api/v1/works/{id}
func GetWork(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid work ID")
		return
	}

	db := database.GetDB()
	query := "SELECT work_id, person_id, title, category, style_period, creation_year, dimensions, seal, inscription, material, creation_date, description, work_image_url, created_at, updated_at FROM works WHERE work_id = ?"

	var work models.Work
	err = db.QueryRow(query, id).Scan(&work.WorkID, &work.PersonID, &work.Title, &work.Category, &work.StylePeriod, &work.CreationYear, &work.Dimensions, &work.Seal, &work.Inscription, &work.Material, &work.CreationDate, &work.Description, &work.WorkImageURL, &work.CreatedAt, &work.UpdatedAt)
	if err == sql.ErrNoRows {
		ErrorResponse(w, http.StatusNotFound, "Work not found")
		return
	} else if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query work")
		return
	}

	SuccessResponse(w, work)
}

// CreateWork 创建作品
// POST /api/v1/works
func CreateWork(w http.ResponseWriter, r *http.Request) {
	var req models.WorkCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// 验证必填字段
	if strings.TrimSpace(req.Title) == "" {
		ErrorResponse(w, http.StatusBadRequest, "Title is required")
		return
	}
	if strings.TrimSpace(req.Category) == "" {
		ErrorResponse(w, http.StatusBadRequest, "Category is required")
		return
	}
	if req.PersonID == 0 {
		ErrorResponse(w, http.StatusBadRequest, "Person ID is required")
		return
	}

	db := database.GetDB()

	// 验证person_id是否存在
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM persons WHERE person_id = ?)", req.PersonID).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check person")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusBadRequest, "Person not found")
		return
	}

	query := "INSERT INTO works (person_id, title, category, style_period, creation_year, dimensions, seal, inscription, material, creation_date, description, work_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

	result, err := db.Exec(query, req.PersonID, req.Title, req.Category, req.StylePeriod, req.CreationYear, req.Dimensions, req.Seal, req.Inscription, req.Material, req.CreationDate, req.Description, req.WorkImageURL)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to create work")
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to get work ID")
		return
	}

	// 返回创建的作品
	var work models.Work
	query = "SELECT work_id, person_id, title, category, style_period, creation_year, dimensions, seal, inscription, material, creation_date, description, work_image_url, created_at, updated_at FROM works WHERE work_id = ?"
	err = db.QueryRow(query, id).Scan(&work.WorkID, &work.PersonID, &work.Title, &work.Category, &work.StylePeriod, &work.CreationYear, &work.Dimensions, &work.Seal, &work.Inscription, &work.Material, &work.CreationDate, &work.Description, &work.WorkImageURL, &work.CreatedAt, &work.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query created work")
		return
	}

	SuccessResponse(w, work)
}

// UpdateWork 更新作品
// PUT /api/v1/works/{id}
func UpdateWork(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid work ID")
		return
	}

	var req models.WorkUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	db := database.GetDB()

	// 检查作品是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM works WHERE work_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check work")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Work not found")
		return
	}

	// 构建更新语句
	updates := []string{}
	args := []interface{}{}

	if req.Title != nil {
		updates = append(updates, "title = ?")
		args = append(args, *req.Title)
	}
	if req.Category != nil {
		updates = append(updates, "category = ?")
		args = append(args, *req.Category)
	}
	if req.StylePeriod != nil {
		updates = append(updates, "style_period = ?")
		args = append(args, *req.StylePeriod)
	}
	if req.CreationYear != nil {
		updates = append(updates, "creation_year = ?")
		args = append(args, *req.CreationYear)
	}
	if req.Dimensions != nil {
		updates = append(updates, "dimensions = ?")
		args = append(args, *req.Dimensions)
	}
	if req.Seal != nil {
		updates = append(updates, "seal = ?")
		args = append(args, *req.Seal)
	}
	if req.Inscription != nil {
		updates = append(updates, "inscription = ?")
		args = append(args, *req.Inscription)
	}
	if req.Material != nil {
		updates = append(updates, "material = ?")
		args = append(args, *req.Material)
	}
	if req.CreationDate != nil {
		updates = append(updates, "creation_date = ?")
		args = append(args, *req.CreationDate)
	}
	if req.Description != nil {
		updates = append(updates, "description = ?")
		args = append(args, *req.Description)
	}
	if req.WorkImageURL != nil {
		updates = append(updates, "work_image_url = ?")
		args = append(args, *req.WorkImageURL)
	}

	if len(updates) == 0 {
		ErrorResponse(w, http.StatusBadRequest, "No fields to update")
		return
	}

	updates = append(updates, "updated_at = CURRENT_TIMESTAMP")
	args = append(args, id)

	query := fmt.Sprintf("UPDATE works SET %s WHERE work_id = ?", strings.Join(updates, ", "))
	_, err = db.Exec(query, args...)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to update work")
		return
	}

	// 返回更新后的作品
	var work models.Work
	query = "SELECT work_id, person_id, title, category, style_period, creation_year, dimensions, seal, inscription, material, creation_date, description, work_image_url, created_at, updated_at FROM works WHERE work_id = ?"
	err = db.QueryRow(query, id).Scan(&work.WorkID, &work.PersonID, &work.Title, &work.Category, &work.StylePeriod, &work.CreationYear, &work.Dimensions, &work.Seal, &work.Inscription, &work.Material, &work.CreationDate, &work.Description, &work.WorkImageURL, &work.CreatedAt, &work.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query updated work")
		return
	}

	SuccessResponse(w, work)
}

// DeleteWork 删除作品
// DELETE /api/v1/works/{id}
func DeleteWork(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid work ID")
		return
	}

	db := database.GetDB()

	// 检查作品是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM works WHERE work_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check work")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Work not found")
		return
	}

	// 删除作品
	_, err = db.Exec("DELETE FROM works WHERE work_id = ?", id)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to delete work")
		return
	}

	DeleteSuccessResponse(w, "Work deleted successfully")
}
