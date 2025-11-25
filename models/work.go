package models

import "time"

// Work 作品模型
type Work struct {
	WorkID       int       `json:"work_id"`
	PersonID     int       `json:"person_id"`
	Title        string    `json:"title"`
	Category     string    `json:"category"`
	StylePeriod  *string   `json:"style_period,omitempty"`
	CreationYear *string   `json:"creation_year,omitempty"`   // 创作年代（原始文本）
	Dimensions   *string   `json:"dimensions,omitempty"`      // 尺寸
	Seal         *string   `json:"seal,omitempty"`            // 钤印
	Inscription  *string   `json:"inscription,omitempty"`     // 款识
	Material     *string   `json:"material,omitempty"`        // 材质
	CreationDate *string   `json:"creation_date,omitempty"`   // 标准化的创作日期 YYYY-MM-DD
	Description  *string   `json:"description,omitempty"`     // 其他描述
	WorkImageURL *string   `json:"work_image_url,omitempty"` // 图片文件路径
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// WorkCreateRequest 创建作品请求
type WorkCreateRequest struct {
	PersonID     int     `json:"person_id" binding:"required"`
	Title        string  `json:"title" binding:"required"`
	Category     string  `json:"category" binding:"required"`
	StylePeriod  *string `json:"style_period,omitempty"`
	CreationYear *string `json:"creation_year,omitempty"`
	Dimensions   *string `json:"dimensions,omitempty"`
	Seal         *string `json:"seal,omitempty"`
	Inscription  *string `json:"inscription,omitempty"`
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
	CreationYear *string `json:"creation_year,omitempty"`
	Dimensions   *string `json:"dimensions,omitempty"`
	Seal         *string `json:"seal,omitempty"`
	Inscription  *string `json:"inscription,omitempty"`
	Material     *string `json:"material,omitempty"`
	CreationDate *string `json:"creation_date,omitempty"`
	Description  *string `json:"description,omitempty"`
	WorkImageURL *string `json:"work_image_url,omitempty"`
}
