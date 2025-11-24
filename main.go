package main

import (
	"log"
	"net/http"
	"os"

	"huangbinhong/database"
	"huangbinhong/routes"
)

func main() {
	// 初始化数据库
	if err := database.InitDB(); err != nil {
		log.Fatal("Failed to initialize database: ", err)
	}
	defer database.CloseDB()

	// 设置路由
	router := routes.SetupRoutes()

	// 获取端口配置
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("❌ PORT environment variable is required")
	}

	// 启动服务器
	dbPath := os.Getenv("DATABASE_PATH")
	log.Printf("🚀 Server is starting on port %s...", port)
	log.Printf("📊 Database: SQLite (%s)", dbPath)
	log.Printf("🌐 Health check: http://localhost:%s/health", port)

	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}