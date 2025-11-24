package models

import "time"

// Location 地点模型
type Location struct {
	LocationID  int       `json:"location_id"`
	Name        string    `json:"name"`
	Latitude    *float64  `json:"latitude,omitempty"`
	Longitude   *float64  `json:"longitude,omitempty"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// LocationCreateRequest 创建地点请求
type LocationCreateRequest struct {
	Name        string   `json:"name" binding:"required"`
	Latitude    *float64 `json:"latitude,omitempty"`
	Longitude   *float64 `json:"longitude,omitempty"`
	Description *string  `json:"description,omitempty"`
}

// LocationUpdateRequest 更新地点请求
type LocationUpdateRequest struct {
	Name        *string  `json:"name,omitempty"`
	Latitude    *float64 `json:"latitude,omitempty"`
	Longitude   *float64 `json:"longitude,omitempty"`
	Description *string  `json:"description,omitempty"`
}
