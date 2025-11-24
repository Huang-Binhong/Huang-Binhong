package models

import "time"

// Person 人物模型
type Person struct {
	PersonID  int       `json:"person_id"`
	Name      string    `json:"name"`
	Alias     *string   `json:"alias,omitempty"`
	BirthDate *string   `json:"birth_date,omitempty"` // 格式: YYYY-MM-DD
	DeathDate *string   `json:"death_date,omitempty"` // 格式: YYYY-MM-DD
	Biography *string   `json:"biography,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// PersonCreateRequest 创建人物请求
type PersonCreateRequest struct {
	Name      string  `json:"name" binding:"required"`
	Alias     *string `json:"alias,omitempty"`
	BirthDate *string `json:"birth_date,omitempty"`
	DeathDate *string `json:"death_date,omitempty"`
	Biography *string `json:"biography,omitempty"`
}

// PersonUpdateRequest 更新人物请求
type PersonUpdateRequest struct {
	Name      *string `json:"name,omitempty"`
	Alias     *string `json:"alias,omitempty"`
	BirthDate *string `json:"birth_date,omitempty"`
	DeathDate *string `json:"death_date,omitempty"`
	Biography *string `json:"biography,omitempty"`
}
