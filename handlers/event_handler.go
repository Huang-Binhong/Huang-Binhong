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

// GetEvents 获取事件列表（支持分页和筛选）
// GET /api/v1/events?page=1&pageSize=10&personId=1&type=birth
func GetEvents(w http.ResponseWriter, r *http.Request) {
	// 获取查询参数
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("pageSize")
	personIDStr := r.URL.Query().Get("personId")
	eventType := r.URL.Query().Get("type")

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

	if personIDStr != "" {
		if personID, err := strconv.Atoi(personIDStr); err == nil {
			conditions = append(conditions, "person_id = ?")
			args = append(args, personID)
		}
	}

	if eventType != "" {
		conditions = append(conditions, "type = ?")
		args = append(args, eventType)
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = " WHERE " + strings.Join(conditions, " AND ")
	}

	// 获取总数
	countQuery := "SELECT COUNT(*) FROM events" + whereClause
	var total int
	err := db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to count events")
		return
	}

	// 查询数据
	query := "SELECT event_id, person_id, location_id, event_date, title, description, type, location, period, detailed_content, historical_events, images, created_at, updated_at FROM events" + whereClause + " ORDER BY event_date, event_id LIMIT ? OFFSET ?"
	queryArgs := append(args, pageSize, offset)

	rows, err := db.Query(query, queryArgs...)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query events")
		return
	}
	defer rows.Close()

	events := []models.Event{}
	for rows.Next() {
		var event models.Event
		var historicalEventsJSON, imagesJSON sql.NullString

		err := rows.Scan(&event.EventID, &event.PersonID, &event.LocationID, &event.EventDate, &event.Title, &event.Description, &event.Type, &event.Location, &event.Period, &event.DetailedContent, &historicalEventsJSON, &imagesJSON, &event.CreatedAt, &event.UpdatedAt)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to scan event")
			return
		}

		// 解析JSON字段
		if historicalEventsJSON.Valid && historicalEventsJSON.String != "" {
			json.Unmarshal([]byte(historicalEventsJSON.String), &event.HistoricalEvents)
		}

		if imagesJSON.Valid && imagesJSON.String != "" {
			json.Unmarshal([]byte(imagesJSON.String), &event.Images)
		}

		events = append(events, event)
	}

	// 返回分页数据
	PaginationResponse(w, events, total, page, pageSize)
}

// GetEvent 获取单个事件详情
// GET /api/v1/events/{id}
func GetEvent(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid event ID")
		return
	}

	db := database.GetDB()
	query := "SELECT event_id, person_id, location_id, event_date, title, description, type, location, period, detailed_content, historical_events, images, created_at, updated_at FROM events WHERE event_id = ?"

	var event models.Event
	var historicalEventsJSON, imagesJSON sql.NullString

	err = db.QueryRow(query, id).Scan(&event.EventID, &event.PersonID, &event.LocationID, &event.EventDate, &event.Title, &event.Description, &event.Type, &event.Location, &event.Period, &event.DetailedContent, &historicalEventsJSON, &imagesJSON, &event.CreatedAt, &event.UpdatedAt)
	if err == sql.ErrNoRows {
		ErrorResponse(w, http.StatusNotFound, "Event not found")
		return
	} else if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query event")
		return
	}

	// 解析JSON字段
	if historicalEventsJSON.Valid && historicalEventsJSON.String != "" {
		json.Unmarshal([]byte(historicalEventsJSON.String), &event.HistoricalEvents)
	}

	if imagesJSON.Valid && imagesJSON.String != "" {
		json.Unmarshal([]byte(imagesJSON.String), &event.Images)
	}

	SuccessResponse(w, event)
}

// CreateEvent 创建事件
// POST /api/v1/events
func CreateEvent(w http.ResponseWriter, r *http.Request) {
	var req models.EventCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// 验证必填字段
	if strings.TrimSpace(req.Title) == "" {
		ErrorResponse(w, http.StatusBadRequest, "Title is required")
		return
	}
	if strings.TrimSpace(req.Type) == "" {
		ErrorResponse(w, http.StatusBadRequest, "Type is required")
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

	// 如果提供了 location_id，验证是否存在
	if req.LocationID != nil && *req.LocationID != 0 {
		var locExists bool
		err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM locations WHERE location_id = ?)", *req.LocationID).Scan(&locExists)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to check location")
			return
		}
		if !locExists {
			ErrorResponse(w, http.StatusBadRequest, "Location not found")
			return
		}
	}

	// 将JSON字段序列化
	var historicalEventsJSON, imagesJSON *string

	if len(req.HistoricalEvents) > 0 {
		data, _ := json.Marshal(req.HistoricalEvents)
		str := string(data)
		historicalEventsJSON = &str
	}

	if len(req.Images) > 0 {
		data, _ := json.Marshal(req.Images)
		str := string(data)
		imagesJSON = &str
	}

	query := "INSERT INTO events (person_id, location_id, event_date, title, description, type, location, period, detailed_content, historical_events, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

	result, err := db.Exec(query, req.PersonID, req.LocationID, req.EventDate, req.Title, req.Description, req.Type, req.Location, req.Period, req.DetailedContent, historicalEventsJSON, imagesJSON)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to create event")
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to get event ID")
		return
	}

	// 返回创建的事件
	var event models.Event
	var historicalEventsJSONStr, imagesJSONStr sql.NullString

	query = "SELECT event_id, person_id, location_id, event_date, title, description, type, location, period, detailed_content, historical_events, images, created_at, updated_at FROM events WHERE event_id = ?"
	err = db.QueryRow(query, id).Scan(&event.EventID, &event.PersonID, &event.LocationID, &event.EventDate, &event.Title, &event.Description, &event.Type, &event.Location, &event.Period, &event.DetailedContent, &historicalEventsJSONStr, &imagesJSONStr, &event.CreatedAt, &event.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query created event")
		return
	}

	// 解析JSON字段
	if historicalEventsJSONStr.Valid && historicalEventsJSONStr.String != "" {
		json.Unmarshal([]byte(historicalEventsJSONStr.String), &event.HistoricalEvents)
	}

	if imagesJSONStr.Valid && imagesJSONStr.String != "" {
		json.Unmarshal([]byte(imagesJSONStr.String), &event.Images)
	}

	SuccessResponse(w, event)
}

// UpdateEvent 更新事件
// PUT /api/v1/events/{id}
func UpdateEvent(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid event ID")
		return
	}

	var req models.EventUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	db := database.GetDB()

	// 检查事件是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM events WHERE event_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check event")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Event not found")
		return
	}

	// 构建更新语句
	updates := []string{}
	args := []interface{}{}

	if req.LocationID != nil {
		// 如果提供了 location_id，验证是否存在
		if *req.LocationID != 0 {
			var locExists bool
			err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM locations WHERE location_id = ?)", *req.LocationID).Scan(&locExists)
			if err != nil {
				ErrorResponse(w, http.StatusInternalServerError, "Failed to check location")
				return
			}
			if !locExists {
				ErrorResponse(w, http.StatusBadRequest, "Location not found")
				return
			}
		}
		updates = append(updates, "location_id = ?")
		args = append(args, *req.LocationID)
	}
	if req.EventDate != nil {
		updates = append(updates, "event_date = ?")
		args = append(args, *req.EventDate)
	}
	if req.Title != nil {
		updates = append(updates, "title = ?")
		args = append(args, *req.Title)
	}
	if req.Description != nil {
		updates = append(updates, "description = ?")
		args = append(args, *req.Description)
	}
	if req.Type != nil {
		updates = append(updates, "type = ?")
		args = append(args, *req.Type)
	}
	if req.Location != nil {
		updates = append(updates, "location = ?")
		args = append(args, *req.Location)
	}
	if req.Period != nil {
		updates = append(updates, "period = ?")
		args = append(args, *req.Period)
	}
	if req.DetailedContent != nil {
		updates = append(updates, "detailed_content = ?")
		args = append(args, *req.DetailedContent)
	}
	if req.HistoricalEvents != nil {
		data, _ := json.Marshal(req.HistoricalEvents)
		updates = append(updates, "historical_events = ?")
		args = append(args, string(data))
	}
	if req.Images != nil {
		data, _ := json.Marshal(req.Images)
		updates = append(updates, "images = ?")
		args = append(args, string(data))
	}

	if len(updates) == 0 {
		ErrorResponse(w, http.StatusBadRequest, "No fields to update")
		return
	}

	updates = append(updates, "updated_at = CURRENT_TIMESTAMP")
	args = append(args, id)

	query := fmt.Sprintf("UPDATE events SET %s WHERE event_id = ?", strings.Join(updates, ", "))
	_, err = db.Exec(query, args...)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to update event")
		return
	}

	// 返回更新后的事件
	var event models.Event
	var historicalEventsJSON, imagesJSON sql.NullString

	query = "SELECT event_id, person_id, location_id, event_date, title, description, type, location, period, detailed_content, historical_events, images, created_at, updated_at FROM events WHERE event_id = ?"
	err = db.QueryRow(query, id).Scan(&event.EventID, &event.PersonID, &event.LocationID, &event.EventDate, &event.Title, &event.Description, &event.Type, &event.Location, &event.Period, &event.DetailedContent, &historicalEventsJSON, &imagesJSON, &event.CreatedAt, &event.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query updated event")
		return
	}

	// 解析JSON字段
	if historicalEventsJSON.Valid && historicalEventsJSON.String != "" {
		json.Unmarshal([]byte(historicalEventsJSON.String), &event.HistoricalEvents)
	}

	if imagesJSON.Valid && imagesJSON.String != "" {
		json.Unmarshal([]byte(imagesJSON.String), &event.Images)
	}

	SuccessResponse(w, event)
}

// DeleteEvent 删除事件
// DELETE /api/v1/events/{id}
func DeleteEvent(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid event ID")
		return
	}

	db := database.GetDB()

	// 检查事件是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM events WHERE event_id = ?)", id).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check event")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Event not found")
		return
	}

	// 删除事件
	_, err = db.Exec("DELETE FROM events WHERE event_id = ?", id)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to delete event")
		return
	}

	DeleteSuccessResponse(w, "Event deleted successfully")
}

// GetPersonEvents 获取某人物的生平事件列表
// GET /api/v1/persons/{personId}/events
func GetPersonEvents(w http.ResponseWriter, r *http.Request) {
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

	// 查询该人物的所有事件，按日期升序
	query := "SELECT event_id, person_id, location_id, event_date, title, description, type, location, period, detailed_content, historical_events, images, created_at, updated_at FROM events WHERE person_id = ? ORDER BY event_date, event_id"

	rows, err := db.Query(query, personID)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query events")
		return
	}
	defer rows.Close()

	events := []models.Event{}
	for rows.Next() {
		var event models.Event
		var historicalEventsJSON, imagesJSON sql.NullString

		err := rows.Scan(&event.EventID, &event.PersonID, &event.LocationID, &event.EventDate, &event.Title, &event.Description, &event.Type, &event.Location, &event.Period, &event.DetailedContent, &historicalEventsJSON, &imagesJSON, &event.CreatedAt, &event.UpdatedAt)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to scan event")
			return
		}

		// 解析JSON字段
		if historicalEventsJSON.Valid && historicalEventsJSON.String != "" {
			json.Unmarshal([]byte(historicalEventsJSON.String), &event.HistoricalEvents)
		}

		if imagesJSON.Valid && imagesJSON.String != "" {
			json.Unmarshal([]byte(imagesJSON.String), &event.Images)
		}

		events = append(events, event)
	}

	SuccessResponse(w, events)
}

// CreatePersonEvent 为某人物创建事件
// POST /api/v1/persons/{personId}/events
func CreatePersonEvent(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	personIDStr := vars["personId"]

	personID, err := strconv.Atoi(personIDStr)
	if err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid person ID")
		return
	}

	var req models.EventCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// 覆盖请求中的 person_id
	req.PersonID = personID

	// 验证必填字段
	if strings.TrimSpace(req.Title) == "" {
		ErrorResponse(w, http.StatusBadRequest, "Title is required")
		return
	}
	if strings.TrimSpace(req.Type) == "" {
		ErrorResponse(w, http.StatusBadRequest, "Type is required")
		return
	}

	db := database.GetDB()

	// 验证person_id是否存在
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM persons WHERE person_id = ?)", req.PersonID).Scan(&exists)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to check person")
		return
	}
	if !exists {
		ErrorResponse(w, http.StatusNotFound, "Person not found")
		return
	}

	// 如果提供了 location_id，验证是否存在
	if req.LocationID != nil && *req.LocationID != 0 {
		var locExists bool
		err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM locations WHERE location_id = ?)", *req.LocationID).Scan(&locExists)
		if err != nil {
			ErrorResponse(w, http.StatusInternalServerError, "Failed to check location")
			return
		}
		if !locExists {
			ErrorResponse(w, http.StatusBadRequest, "Location not found")
			return
		}
	}

	// 将JSON字段序列化
	var historicalEventsJSON, imagesJSON *string

	if len(req.HistoricalEvents) > 0 {
		data, _ := json.Marshal(req.HistoricalEvents)
		str := string(data)
		historicalEventsJSON = &str
	}

	if len(req.Images) > 0 {
		data, _ := json.Marshal(req.Images)
		str := string(data)
		imagesJSON = &str
	}

	query := "INSERT INTO events (person_id, location_id, event_date, title, description, type, location, period, detailed_content, historical_events, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

	result, err := db.Exec(query, req.PersonID, req.LocationID, req.EventDate, req.Title, req.Description, req.Type, req.Location, req.Period, req.DetailedContent, historicalEventsJSON, imagesJSON)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to create event")
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to get event ID")
		return
	}

	// 返回创建的事件
	var event models.Event
	var historicalEventsJSONStr, imagesJSONStr sql.NullString

	query = "SELECT event_id, person_id, location_id, event_date, title, description, type, location, period, detailed_content, historical_events, images, created_at, updated_at FROM events WHERE event_id = ?"
	err = db.QueryRow(query, id).Scan(&event.EventID, &event.PersonID, &event.LocationID, &event.EventDate, &event.Title, &event.Description, &event.Type, &event.Location, &event.Period, &event.DetailedContent, &historicalEventsJSONStr, &imagesJSONStr, &event.CreatedAt, &event.UpdatedAt)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Failed to query created event")
		return
	}

	// 解析JSON字段
	if historicalEventsJSONStr.Valid && historicalEventsJSONStr.String != "" {
		json.Unmarshal([]byte(historicalEventsJSONStr.String), &event.HistoricalEvents)
	}

	if imagesJSONStr.Valid && imagesJSONStr.String != "" {
		json.Unmarshal([]byte(imagesJSONStr.String), &event.Images)
	}

	SuccessResponse(w, event)
}
