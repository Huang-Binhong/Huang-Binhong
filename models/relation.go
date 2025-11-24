package models

import "time"

// Relation 人际关系模型
type Relation struct {
	RelationID   int       `json:"relation_id"`
	FromPersonID int       `json:"from_person_id"`
	ToPersonID   int       `json:"to_person_id"`
	RelationType string    `json:"relation_type"`
	Description  *string   `json:"description,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// RelationCreateRequest 创建关系请求
type RelationCreateRequest struct {
	FromPersonID int     `json:"from_person_id" binding:"required"`
	ToPersonID   int     `json:"to_person_id" binding:"required"`
	RelationType string  `json:"relation_type" binding:"required"`
	Description  *string `json:"description,omitempty"`
}

// RelationUpdateRequest 更新关系请求
type RelationUpdateRequest struct {
	RelationType *string `json:"relation_type,omitempty"`
	Description  *string `json:"description,omitempty"`
}
