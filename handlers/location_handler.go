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

// GetLocations 获取地点列表（支持分页）
// GET /api/v1/locations?page=1&pageSize=10
func GetLocations(w http.ResponseWriter, r *http.Request) {
	// 获取查询参数
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("pageSize")

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

	// 获取总数
	var total int
	err := db.QueryRow("SELECT COUNT(*) FROM locations").Scan(&total)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to count locations")
		return
	}

	// 查询数据
	query := "SELECT location_id, name, latitude, longitude, description, created_at, updated_at FROM locations ORDER BY location_id LIMIT ? OFFSET ?"
	rows, err := db.Query(query, pageSize, offset)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query locations")
		return
	}
	defer rows.Close()

	locations := []models.Location{}
	for rows.Next() {
		var loc models.Location
		err := rows.Scan(&loc.LocationID, &loc.Name, &loc.Latitude, &loc.Longitude, &loc.Description, &loc.CreatedAt, &loc.UpdatedAt)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to scan location")
			return
		}
		locations = append(locations, loc)
	}

	// 返回分页数据
	PaginationResponse(w, locations, total, page, pageSize)
}

// GetLocation 获取单个地点详情
// GET /api/v1/locations/{id}
func GetLocation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid location ID")
		return
	}

	db := database.GetDB()
	query := "SELECT location_id, name, latitude, longitude, description, created_at, updated_at FROM locations WHERE location_id = ?"

	var loc models.Location
	err = db.QueryRow(query, id).Scan(&loc.LocationID, &loc.Name, &loc.Latitude, &loc.Longitude, &loc.Description, &loc.CreatedAt, &loc.UpdatedAt)
	if err == sql.ErrNoRows {
		ErrorResponse(w, http.StatusNotFound, "Location not found")
		return
	} else if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query location")
		return
	}

	SuccessResponse(w, loc)
}

// CreateLocation 创建地点
// POST /api/v1/locations
func CreateLocation(w http.ResponseWriter, r *http.Request) {
	var req models.LocationCreateRequest
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
	query := "INSERT INTO locations (name, latitude, longitude, description) VALUES (?, ?, ?, ?)"

	result, err := db.Exec(query, req.Name, req.Latitude, req.Longitude, req.Description)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to create location")
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to get location ID")
		return
	}

	// 返回创建的地点
	var loc models.Location
	query = "SELECT location_id, name, latitude, longitude, description, created_at, updated_at FROM locations WHERE location_id = ?"
	err = db.QueryRow(query, id).Scan(&loc.LocationID, &loc.Name, &loc.Latitude, &loc.Longitude, &loc.Description, &loc.CreatedAt, &loc.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query created location")
		return
	}

	SuccessResponse(w, loc)
}

// UpdateLocation 更新地点
// PUT /api/v1/locations/{id}
func UpdateLocation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid location ID")
		return
	}

	var req models.LocationUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	db := database.GetDB()

	// 检查地点是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM locations WHERE location_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check location")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Location not found")
		return
	}

	// 构建更新语句
	updates := []string{}
	args := []interface{}{}

	if req.Name != nil {
		updates = append(updates, "name = ?")
		args = append(args, *req.Name)
	}
	if req.Latitude != nil {
		updates = append(updates, "latitude = ?")
		args = append(args, *req.Latitude)
	}
	if req.Longitude != nil {
		updates = append(updates, "longitude = ?")
		args = append(args, *req.Longitude)
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

	query := fmt.Sprintf("UPDATE locations SET %s WHERE location_id = ?", strings.Join(updates, ", "))
	_, err = db.Exec(query, args...)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to update location")
		return
	}

	// 返回更新后的地点
	var loc models.Location
	query = "SELECT location_id, name, latitude, longitude, description, created_at, updated_at FROM locations WHERE location_id = ?"
	err = db.QueryRow(query, id).Scan(&loc.LocationID, &loc.Name, &loc.Latitude, &loc.Longitude, &loc.Description, &loc.CreatedAt, &loc.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query updated location")
		return
	}

	SuccessResponse(w, loc)
}

// DeleteLocation 删除地点
// DELETE /api/v1/locations/{id}
func DeleteLocation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid location ID")
		return
	}

	db := database.GetDB()

	// 检查地点是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM locations WHERE location_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check location")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Location not found")
		return
	}

	// 删除地点
	_, err = db.Exec("DELETE FROM locations WHERE location_id = ?", id)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to delete location")
		return
	}

	DeleteSuccessResponse(w, "Location deleted successfully")
}
