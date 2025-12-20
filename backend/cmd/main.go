package main

import (
	"log"
	"net/http"
	"os"

	"huang_bin_hong/internal/config"
	"huang_bin_hong/internal/db"
	"huang_bin_hong/internal/handlers"
)

// CORS中间件
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	log.Println("=== 黄宾虹数据管理系统 ===")

	// 加载环境变量
	if err := config.LoadEnv(); err != nil {
		log.Printf("Warning: Failed to load .env file: %v", err)
	}

	// 获取配置
	cfg := config.GetConfig()

	// 确保data目录存在
	if err := os.MkdirAll("data", 0755); err != nil {
		log.Fatalf("Failed to create data directory: %v", err)
	}

	// 初始化数据库
	log.Println("Initializing database...")
	if err := db.InitDB(cfg.DBPath); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// 检查是否需要导入数据
	if db.NeedImportData() {
		log.Println("Database is empty, importing data from xlsx files...")
		if err := db.ImportData(cfg.DataDir); err != nil {
			log.Fatalf("Failed to import data: %v", err)
		}
	} else {
		log.Println("Database already contains data, skipping import")
	}

	// 设置路由
	mux := http.NewServeMux()

	// 健康检查
	mux.HandleFunc("/health", handlers.Health)

	// 前端兼容API（模拟Python后端格式）
	mux.HandleFunc("/frontend/pg/huang/huang-collection", handlers.HuangCollection)
	mux.HandleFunc("/frontend/pg/huang/get-dong-by-id", handlers.HuangDetail)
	mux.HandleFunc("/frontend/pg/huang/vr-works", handlers.HuangVRWorks)

	// 新API
	mux.HandleFunc("/api/events", handlers.GetEvents)
	mux.HandleFunc("/api/persons", handlers.GetPersons)
	mux.HandleFunc("/api/relations", handlers.GetRelations)
	mux.HandleFunc("/api/works", handlers.GetWorks)
	mux.HandleFunc("/api/timeline/events", handlers.GetTimelineEvents)
	mux.HandleFunc("/api/timeline/carousel", handlers.GetCarouselImages)

	// AI风格迁移API
	mux.HandleFunc("/api/style-transfer/image", handlers.StyleTransferImage)
	mux.HandleFunc("/api/style-transfer/video", handlers.StyleTransferVideo)
	mux.HandleFunc("/api/style-transfer/video/", handlers.StyleTransferVideoQuery)

	// AI分析API
	mux.HandleFunc("/api/ai/analyze", handlers.AIAnalyze)

	// 静态文件服务（图片）
	fs := http.FileServer(http.Dir("data"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	// 应用CORS中间件
	handler := corsMiddleware(mux)

	port := ":" + cfg.ServerPort
	log.Printf("Server starting on http://localhost%s", port)
	log.Println("API endpoints:")
	log.Println("  POST /frontend/pg/huang/huang-collection - 作品列表")
	log.Println("  POST /frontend/pg/huang/get-dong-by-id   - 作品详情")
	log.Println("  POST /frontend/pg/huang/vr-works         - VR作品")
	log.Println("  GET  /api/events                         - 事件列表")
	log.Println("  GET  /api/persons                        - 人物列表")
	log.Println("  GET  /api/relations                      - 关系列表")
	log.Println("  GET  /api/works                          - 作品列表")
	log.Println("  POST /api/style-transfer/image           - 图片风格迁移")
	log.Println("  POST /api/style-transfer/video           - 创建视频任务")
	log.Println("  GET  /api/style-transfer/video/{id}      - 查询视频任务")
	log.Println("  POST /api/ai/analyze                     - AI艺术作品分析")
	log.Println("  GET  /static/work/*                      - 静态图片")

	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
