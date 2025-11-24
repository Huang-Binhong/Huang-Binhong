package models

import "time"

// EventImage 事件关联的图片
type EventImage struct {
	ID      int    `json:"id"`
	URL     string `json:"url"`
	Alt     string `json:"alt"`
	Caption string `json:"caption"`
}

// Event 生平事件模型
type Event struct {
	EventID          int          `json:"event_id"`
	PersonID         int          `json:"person_id"`
	LocationID       *int         `json:"location_id,omitempty"` // 地点ID外键
	EventDate        *string      `json:"event_date,omitempty"`   // 格式: YYYY-MM-DD
	Title            string       `json:"title"`
	Description      *string      `json:"description,omitempty"`
	Type             string       `json:"type"`
	Location         *string      `json:"location,omitempty"` // 地点名称（冗余字段，方便快速查询）
	Period           *string      `json:"period,omitempty"`
	DetailedContent  *string      `json:"detailed_content,omitempty"`
	HistoricalEvents []string     `json:"historical_events,omitempty"`
	Images           []EventImage `json:"images,omitempty"`
	CreatedAt        time.Time    `json:"created_at"`
	UpdatedAt        time.Time    `json:"updated_at"`
}

// EventCreateRequest 创建事件请求
type EventCreateRequest struct {
	PersonID         int          `json:"person_id" binding:"required"`
	LocationID       *int         `json:"location_id,omitempty"`
	EventDate        *string      `json:"event_date,omitempty"`
	Title            string       `json:"title" binding:"required"`
	Description      *string      `json:"description,omitempty"`
	Type             string       `json:"type" binding:"required"`
	Location         *string      `json:"location,omitempty"`
	Period           *string      `json:"period,omitempty"`
	DetailedContent  *string      `json:"detailed_content,omitempty"`
	HistoricalEvents []string     `json:"historical_events,omitempty"`
	Images           []EventImage `json:"images,omitempty"`
}

// EventUpdateRequest 更新事件请求
type EventUpdateRequest struct {
	LocationID       *int         `json:"location_id,omitempty"`
	EventDate        *string      `json:"event_date,omitempty"`
	Title            *string      `json:"title,omitempty"`
	Description      *string      `json:"description,omitempty"`
	Type             *string      `json:"type,omitempty"`
	Location         *string      `json:"location,omitempty"`
	Period           *string      `json:"period,omitempty"`
	DetailedContent  *string      `json:"detailed_content,omitempty"`
	HistoricalEvents []string     `json:"historical_events,omitempty"`
	Images           []EventImage `json:"images,omitempty"`
}
