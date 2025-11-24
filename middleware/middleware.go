package middleware

import (
	"log"
	"net/http"
	"os"
	"time"
)

// LoggingMiddleware 日志中间件
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("[%s] %s %s", r.Method, r.RequestURI, r.RemoteAddr)
		next.ServeHTTP(w, r)
		log.Printf("Request completed in %v", time.Since(start))
	})
}

// CORSMiddleware CORS中间件
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 从环境变量读取允许的来源，默认为 *
		allowOrigin := os.Getenv("CORS_ALLOW_ORIGIN")
		if allowOrigin == "" {
			allowOrigin = "*"
		}
		w.Header().Set("Access-Control-Allow-Origin", allowOrigin)

		// 允许的 HTTP 方法
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")

		// 允许的请求头
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin")

		// 暴露给前端的响应头
		w.Header().Set("Access-Control-Expose-Headers", "Content-Length, Content-Type")

		// 预检请求缓存时间（秒）
		w.Header().Set("Access-Control-Max-Age", "86400")

		// 如果允许所有来源（*），不能设置 Credentials 为 true
		// 如果需要发送 cookie/凭证，需要指定具体域名
		// w.Header().Set("Access-Control-Allow-Credentials", "true")

		// 处理预检请求
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
