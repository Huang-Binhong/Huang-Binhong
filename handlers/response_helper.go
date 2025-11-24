package handlers

import (
	"encoding/json"
	"net/http"
	"huangbinhong/models"
)

// ErrorResponse 返回错误响应
func ErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	// 根据 HTTP 状态码映射到错误码
	code := models.CodeInternalError
	switch statusCode {
	case http.StatusBadRequest:
		code = models.CodeBadRequest
	case http.StatusUnauthorized:
		code = models.CodeUnauthorized
	case http.StatusForbidden:
		code = models.CodeForbidden
	case http.StatusNotFound:
		code = models.CodeNotFound
	case http.StatusConflict:
		code = models.CodeConflict
	case http.StatusInternalServerError:
		code = models.CodeInternalError
	}

	response := models.Response{
		Code:    code,
		Message: message,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

// SuccessResponse 返回成功响应
func SuccessResponse(w http.ResponseWriter, data interface{}) {
	response := models.Response{
		Code:    models.CodeSuccess,
		Message: "success",
		Data:    data,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// PaginationResponse 返回分页数据响应
func PaginationResponse(w http.ResponseWriter, items interface{}, total, page, pageSize int) {
	response := models.Response{
		Code:    models.CodeSuccess,
		Message: "success",
		Data: map[string]interface{}{
			"items":    items,
			"total":    total,
			"page":     page,
			"pageSize": pageSize,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// DeleteSuccessResponse 返回删除成功响应
func DeleteSuccessResponse(w http.ResponseWriter, message string) {
	response := models.Response{
		Code:    models.CodeSuccess,
		Message: message,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
