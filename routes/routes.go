package routes

import (
	"huangbinhong/handlers"
	"huangbinhong/middleware"

	"github.com/gorilla/mux"
)

// SetupRoutes 设置所有路由
func SetupRoutes() *mux.Router {
	router := mux.NewRouter()

	// API v1路由组
	api := router.PathPrefix("/api/v1").Subrouter()

	// 人物相关路由
	api.HandleFunc("/persons", handlers.GetPersons).Methods("GET")
	api.HandleFunc("/persons", handlers.CreatePerson).Methods("POST")
	api.HandleFunc("/persons/{id}", handlers.GetPerson).Methods("GET")
	api.HandleFunc("/persons/{id}", handlers.UpdatePerson).Methods("PUT")
	api.HandleFunc("/persons/{id}", handlers.DeletePerson).Methods("DELETE")

	// 人物嵌套路由 - 获取某人物的生平事件和关系
	api.HandleFunc("/persons/{personId}/events", handlers.GetPersonEvents).Methods("GET")
	api.HandleFunc("/persons/{personId}/events", handlers.CreatePersonEvent).Methods("POST")
	api.HandleFunc("/persons/{personId}/relations", handlers.GetPersonRelations).Methods("GET")

	// 作品相关路由
	api.HandleFunc("/works", handlers.GetWorks).Methods("GET")
	api.HandleFunc("/works", handlers.CreateWork).Methods("POST")
	api.HandleFunc("/works/{id}", handlers.GetWork).Methods("GET")
	api.HandleFunc("/works/{id}", handlers.UpdateWork).Methods("PUT")
	api.HandleFunc("/works/{id}", handlers.DeleteWork).Methods("DELETE")

	// 事件相关路由
	api.HandleFunc("/events", handlers.GetEvents).Methods("GET")
	api.HandleFunc("/events", handlers.CreateEvent).Methods("POST")
	api.HandleFunc("/events/{id}", handlers.GetEvent).Methods("GET")
	api.HandleFunc("/events/{id}", handlers.UpdateEvent).Methods("PUT")
	api.HandleFunc("/events/{id}", handlers.DeleteEvent).Methods("DELETE")

	// 地点相关路由
	api.HandleFunc("/locations", handlers.GetLocations).Methods("GET")
	api.HandleFunc("/locations", handlers.CreateLocation).Methods("POST")
	api.HandleFunc("/locations/{id}", handlers.GetLocation).Methods("GET")
	api.HandleFunc("/locations/{id}", handlers.UpdateLocation).Methods("PUT")
	api.HandleFunc("/locations/{id}", handlers.DeleteLocation).Methods("DELETE")

	// 关系相关路由
	api.HandleFunc("/relations", handlers.GetRelations).Methods("GET")
	api.HandleFunc("/relations", handlers.CreateRelation).Methods("POST")
	api.HandleFunc("/relations/{id}", handlers.GetRelation).Methods("GET")
	api.HandleFunc("/relations/{id}", handlers.UpdateRelation).Methods("PUT")
	api.HandleFunc("/relations/{id}", handlers.DeleteRelation).Methods("DELETE")

	// 健康检查
	router.HandleFunc("/health", handlers.HealthCheck).Methods("GET")

	// 添加中间件
	router.Use(middleware.LoggingMiddleware)
	router.Use(middleware.CORSMiddleware)

	return router
}
