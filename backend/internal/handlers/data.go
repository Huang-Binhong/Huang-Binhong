package handlers

import (
	"encoding/json"
	"net/http"

	"huang_bin_hong/internal/db"
)

// Event 事件
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

// Person 人物
type Person struct {
	PersonID  int    `json:"person_id"`
	Name      string `json:"name"`
	Alias     string `json:"alias"`
	BirthDate string `json:"birth_date"`
	DeathDate string `json:"death_date"`
	Biography string `json:"biography"`
}

// Relation 关系
type Relation struct {
	RelationID   int    `json:"relation_id"`
	FromPersonID int    `json:"from_person_id"`
	ToPersonID   int    `json:"to_person_id"`
	RelationType string `json:"relation_type"`
	Description  string `json:"description"`
	FromName     string `json:"from_name"`
	ToName       string `json:"to_name"`
}

// GetEvents 获取事件列表（时间线）
func GetEvents(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`
		SELECT event_id, person_id, event_date, title, description, type, period, historical_events, historical_details
		FROM events ORDER BY event_date`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	events := []Event{}
	for rows.Next() {
		var e Event
		rows.Scan(&e.EventID, &e.PersonID, &e.EventDate, &e.Title, &e.Description,
			&e.Type, &e.Period, &e.HistoricalEvents, &e.HistoricalDetails)
		events = append(events, e)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"events": events,
		"total":  len(events),
	})
}

// GetPersons 获取人物列表
func GetPersons(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`SELECT person_id, name, alias, birth_date, death_date, biography FROM persons`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	persons := []Person{}
	for rows.Next() {
		var p Person
		rows.Scan(&p.PersonID, &p.Name, &p.Alias, &p.BirthDate, &p.DeathDate, &p.Biography)
		persons = append(persons, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"persons": persons,
		"total":   len(persons),
	})
}

// GetRelations 获取人物关系
func GetRelations(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`
		SELECT r.relation_id, r.from_person_id, r.to_person_id, r.relation_type, r.description,
			   p1.name as from_name, p2.name as to_name
		FROM relations r
		LEFT JOIN persons p1 ON r.from_person_id = p1.person_id
		LEFT JOIN persons p2 ON r.to_person_id = p2.person_id`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	relations := []Relation{}
	for rows.Next() {
		var rel Relation
		rows.Scan(&rel.RelationID, &rel.FromPersonID, &rel.ToPersonID, &rel.RelationType,
			&rel.Description, &rel.FromName, &rel.ToName)
		relations = append(relations, rel)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"relations": relations,
		"total":     len(relations),
	})
}

// GetWorks 获取作品列表（简化版）
func GetWorks(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`
		SELECT work_id, person_id, title, category, style_period, material, creation_date, description, work_image_url
		FROM works`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

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

	works := []Work{}
	for rows.Next() {
		var w Work
		rows.Scan(&w.WorkID, &w.PersonID, &w.Title, &w.Category, &w.StylePeriod,
			&w.Material, &w.CreationDate, &w.Description, &w.WorkImageURL)
		works = append(works, w)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"works": works,
		"total": len(works),
	})
}
