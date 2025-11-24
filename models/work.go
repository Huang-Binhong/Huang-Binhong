package models

import "time"

// Work 作品模型
type Work struct {
	WorkID       int       `json:"work_id"`
	PersonID     int       `json:"person_id"`
	Title        string    `json:"title"`
	Category     string    `json:"category"`
	StylePeriod  *string   `json:"style_period,omitempty"`
	Material     *string   `json:"material,omitempty"`
	CreationDate *string   `json:"creation_date,omitempty"` // 格式: YYYY-MM-DD
	Description  *string   `json:"description,omitempty"`
	WorkImageURL *string   `json:"work_image_url,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// WorkCreateRequest 创建作品请求
type WorkCreateRequest struct {
	PersonID     int     `json:"person_id" binding:"required"`
	Title        string  `json:"title" binding:"required"`
	Category     string  `json:"category" binding:"required"`
	StylePeriod  *string `json:"style_period,omitempty"`
	Material     *string `json:"material,omitempty"`
	CreationDate *string `json:"creation_date,omitempty"`
	Description  *string `json:"description,omitempty"`
	WorkImageURL *string `json:"work_image_url,omitempty"`
}

// WorkUpdateRequest 更新作品请求
type WorkUpdateRequest struct {
	Title        *string `json:"title,omitempty"`
	Category     *string `json:"category,omitempty"`
	StylePeriod  *string `json:"style_period,omitempty"`
	Material     *string `json:"material,omitempty"`
	CreationDate *string `json:"creation_date,omitempty"`
	Description  *string `json:"description,omitempty"`
	WorkImageURL *string `json:"work_image_url,omitempty"`
}
