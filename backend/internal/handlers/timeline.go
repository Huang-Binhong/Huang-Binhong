package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"huang_bin_hong/internal/db"
)

// TimelineEvent 时间线事件
type TimelineEvent struct {
	ID              int      `json:"id"`
	Year            int      `json:"year"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	Type            string   `json:"type"`
	Location        string   `json:"location"`
	Period          string   `json:"period"`
	DetailedContent string   `json:"detailedContent"`
	RelatedWorks    []string `json:"relatedWorks"`
}

// HistoricalEvent 历史事件
type HistoricalEvent struct {
	ID          int    `json:"id"`
	Year        int    `json:"year"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

// CarouselImage 轮播图
type CarouselImage struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Image string `json:"image"`
	Desc  string `json:"desc"`
}

// GetTimelineEvents 获取时间线事件（兼容前端格式）
func GetTimelineEvents(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`
		SELECT event_id, event_date, title, description, type, period, historical_events, historical_details
		FROM events ORDER BY event_date`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	personalEvents := []TimelineEvent{}
	historicalEvents := []HistoricalEvent{}

	for rows.Next() {
		var eventID int
		var eventDate, title, desc, eventType, period, histEvents, histDetails string
		rows.Scan(&eventID, &eventDate, &title, &desc, &eventType, &period, &histEvents, &histDetails)

		// 提取年份
		year := 0
		if len(eventDate) >= 4 {
			year, _ = strconv.Atoi(eventDate[:4])
		}

		// 个人事件
		personalEvents = append(personalEvents, TimelineEvent{
			ID:              eventID,
			Year:            year,
			Title:           title,
			Description:     desc,
			Type:            eventType,
			Location:        "",
			Period:          period,
			DetailedContent: desc,
			RelatedWorks:    []string{},
		})

		// 历史事件（从historical_events字段解析）
		if histEvents != "" {
			parts := strings.Split(histEvents, "；")
			for i, part := range parts {
				part = strings.TrimSpace(part)
				if part == "" {
					continue
				}
				// 移除序号
				if len(part) > 3 && part[1] == '.' {
					part = strings.TrimSpace(part[3:])
				}
				historicalEvents = append(historicalEvents, HistoricalEvent{
					ID:          eventID*100 + i,
					Year:        year,
					Title:       part,
					Description: histDetails,
				})
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 0,
		"data": map[string]interface{}{
			"personalEvents":   personalEvents,
			"historicalEvents": historicalEvents,
		},
	})
}

// GetCarouselImages 获取轮播图（使用作品图片）
func GetCarouselImages(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`
		SELECT work_id, title, description, work_image_url
		FROM works
		WHERE style_period IS NOT NULL AND style_period != ''
		LIMIT 10`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	images := []CarouselImage{}
	for rows.Next() {
		var workID int
		var title, desc, imageURL string
		rows.Scan(&workID, &title, &desc, &imageURL)

		images = append(images, CarouselImage{
			ID:    workID,
			Title: title,
			Image: "/static/" + imageURL,
			Desc:  desc,
		})
	}

	// 如果没有带style_period的作品，就取前10个
	if len(images) == 0 {
		rows2, _ := db.DB.Query(`SELECT work_id, title, description, work_image_url FROM works LIMIT 10`)
		if rows2 != nil {
			defer rows2.Close()
			for rows2.Next() {
				var workID int
				var title, desc, imageURL string
				rows2.Scan(&workID, &title, &desc, &imageURL)
				images = append(images, CarouselImage{
					ID:    workID,
					Title: title,
					Image: "/static/" + imageURL,
					Desc:  desc,
				})
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 0,
		"data": map[string]interface{}{
			"items": images,
		},
	})
}
