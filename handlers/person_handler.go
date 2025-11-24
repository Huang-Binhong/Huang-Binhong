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

// GetPersons 获取人物列表（支持分页和模糊搜索）
// GET /api/v1/persons?page=1&pageSize=10&search=黄宾虹
func GetPersons(w http.ResponseWriter, r *http.Request) {
	// 获取查询参数
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("pageSize")
	search := r.URL.Query().Get("search")

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

	// 构建查询条件
	var countQuery string
	var query string
	var args []interface{}

	if search != "" {
		searchPattern := "%" + search + "%"
		countQuery = "SELECT COUNT(*) FROM persons WHERE name LIKE ? OR alias LIKE ?"
		query = "SELECT person_id, name, alias, birth_date, death_date, biography, created_at, updated_at FROM persons WHERE name LIKE ? OR alias LIKE ? ORDER BY person_id LIMIT ? OFFSET ?"
		args = []interface{}{searchPattern, searchPattern, pageSize, offset}
	} else {
		countQuery = "SELECT COUNT(*) FROM persons"
		query = "SELECT person_id, name, alias, birth_date, death_date, biography, created_at, updated_at FROM persons ORDER BY person_id LIMIT ? OFFSET ?"
		args = []interface{}{pageSize, offset}
	}

	// 获取总数
	var total int
	if search != "" {
		searchPattern := "%" + search + "%"
		err := db.QueryRow(countQuery, searchPattern, searchPattern).Scan(&total)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to count persons")
			return
		}
	} else {
		err := db.QueryRow(countQuery).Scan(&total)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to count persons")
			return
		}
	}

	// 查询数据
	rows, err := db.Query(query, args...)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query persons")
		return
	}
	defer rows.Close()

	persons := []models.Person{}
	for rows.Next() {
		var p models.Person
		err := rows.Scan(&p.PersonID, &p.Name, &p.Alias, &p.BirthDate, &p.DeathDate, &p.Biography, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to scan person")
			return
		}
		persons = append(persons, p)
	}

	// 返回分页数据
	PaginationResponse(w, persons, total, page, pageSize)
}

// GetPerson 获取单个人物详情
// GET /api/v1/persons/{id}
func GetPerson(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid person ID")
		return
	}

	db := database.GetDB()
	query := "SELECT person_id, name, alias, birth_date, death_date, biography, created_at, updated_at FROM persons WHERE person_id = ?"

	var p models.Person
	err = db.QueryRow(query, id).Scan(&p.PersonID, &p.Name, &p.Alias, &p.BirthDate, &p.DeathDate, &p.Biography, &p.CreatedAt, &p.UpdatedAt)
	if err == sql.ErrNoRows {
		ErrorResponse(w, http.StatusNotFound, "Person not found")
		return
	} else if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query person")
		return
	}

	SuccessResponse(w, p)
}

// CreatePerson 创建人物
// POST /api/v1/persons
func CreatePerson(w http.ResponseWriter, r *http.Request) {
	var req models.PersonCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// 验证必填字段
	if strings.TrimSpace(req.Name) == "" {
		ErrorResponse(w, http.StatusBadRequest, "Name is required")
		return
	}

	db := database.GetDB()
	query := "INSERT INTO persons (name, alias, birth_date, death_date, biography) VALUES (?, ?, ?, ?, ?)"

	result, err := db.Exec(query, req.Name, req.Alias, req.BirthDate, req.DeathDate, req.Biography)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to create person")
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to get person ID")
		return
	}

	// 返回创建的人物
	var person models.Person
	query = "SELECT person_id, name, alias, birth_date, death_date, biography, created_at, updated_at FROM persons WHERE person_id = ?"
	err = db.QueryRow(query, id).Scan(&person.PersonID, &person.Name, &person.Alias, &person.BirthDate, &person.DeathDate, &person.Biography, &person.CreatedAt, &person.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query created person")
		return
	}

	SuccessResponse(w, person)
}

// UpdatePerson 更新人物
// PUT /api/v1/persons/{id}
func UpdatePerson(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid person ID")
		return
	}

	var req models.PersonUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	db := database.GetDB()

	// 检查人物是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM persons WHERE person_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check person")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Person not found")
		return
	}

	// 构建更新语句
	updates := []string{}
	args := []interface{}{}

	if req.Name != nil {
		updates = append(updates, "name = ?")
		args = append(args, *req.Name)
	}
	if req.Alias != nil {
		updates = append(updates, "alias = ?")
		args = append(args, *req.Alias)
	}
	if req.BirthDate != nil {
		updates = append(updates, "birth_date = ?")
		args = append(args, *req.BirthDate)
	}
	if req.DeathDate != nil {
		updates = append(updates, "death_date = ?")
		args = append(args, *req.DeathDate)
	}
	if req.Biography != nil {
		updates = append(updates, "biography = ?")
		args = append(args, *req.Biography)
	}

	if len(updates) == 0 {
		ErrorResponse(w, http.StatusBadRequest, "No fields to update")
		return
	}

	updates = append(updates, "updated_at = CURRENT_TIMESTAMP")
	args = append(args, id)

	query := fmt.Sprintf("UPDATE persons SET %s WHERE person_id = ?", strings.Join(updates, ", "))
	_, err = db.Exec(query, args...)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to update person")
		return
	}

	// 返回更新后的人物
	var person models.Person
	query = "SELECT person_id, name, alias, birth_date, death_date, biography, created_at, updated_at FROM persons WHERE person_id = ?"
	err = db.QueryRow(query, id).Scan(&person.PersonID, &person.Name, &person.Alias, &person.BirthDate, &person.DeathDate, &person.Biography, &person.CreatedAt, &person.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query updated person")
		return
	}

	SuccessResponse(w, person)
}

// DeletePerson 删除人物
// DELETE /api/v1/persons/{id}
func DeletePerson(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid person ID")
		return
	}

	db := database.GetDB()

	// 检查人物是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM persons WHERE person_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check person")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Person not found")
		return
	}

	// 删除人物（关联数据会通过外键级联删除）
	_, err = db.Exec("DELETE FROM persons WHERE person_id = ?", id)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to delete person")
		return
	}

	DeleteSuccessResponse(w, "Person deleted successfully")
}
