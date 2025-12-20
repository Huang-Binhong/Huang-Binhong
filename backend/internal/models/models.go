package models

// Person 人物信息
type Person struct {
	PersonID  int    `json:"person_id"`
	Name      string `json:"name"`
	Alias     string `json:"alias"`
	BirthDate string `json:"birth_date"`
	DeathDate string `json:"death_date"`
	Biography string `json:"biography"`
}

// Event 事件信息
type Event struct {
	EventID           int    `json:"event_id"`
	PersonID          int    `json:"person_id"`
	EventDate         string `json:"event_date"`
	Title             string `json:"title"`
	Description       string `json:"description"`
	Type              string `json:"type"`
	Period            string `json:"period"`
	HistoricalEvents  string `json:"historical_events"`
	HistoricalDetails string `json:"historical_details"`
}

// Relation 人物关系
type Relation struct {
	RelationID   int    `json:"relation_id"`
	FromPersonID int    `json:"from_person_id"`
	ToPersonID   int    `json:"to_person_id"`
	RelationType string `json:"relation_type"`
	Description  string `json:"description"`
}

// Work 作品信息
type Work struct {
	WorkID       int    `json:"work_id"`
	PersonID     int    `json:"person_id"`
	Title        string `json:"title"`
	Category     string `json:"category"`
	StylePeriod  string `json:"style_period"`
	Material     string `json:"material"`
	CreationDate string `json:"creation_date"`
	Description  string `json:"description"`
	WorkImageURL string `json:"work_image_url"`
}
