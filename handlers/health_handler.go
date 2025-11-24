package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"huangbinhong/database"
	"huangbinhong/models"
)

// HealthCheck 健康检查处理器
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	db := database.GetDB()

	// 测试数据库连接
	err := db.Ping()
	if err != nil {
		response := models.Response{
			Code:    models.CodeInternalError,
			Message: "Database connection failed: " + err.Error(),
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// 返回健康状态
	response := models.Response{
		Code:    models.CodeSuccess,
		Message: "Service is healthy",
		Data: map[string]interface{}{
			"service":  "ArtChronicle API",
			"status":   "healthy",
			"database": "sqlite3",
			"timestamp": time.Now().Format(time.RFC3339),
		},
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
