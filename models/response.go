package models

// Response 通用响应结构
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// 错误码常量
const (
	CodeSuccess          = 0    // 成功
	CodeBadRequest       = 4001 // 请求参数校验失败
	CodeUnauthorized     = 4011 // 认证失败/未登录
	CodeForbidden        = 4031 // 无权限访问
	CodeNotFound         = 4041 // 资源不存在
	CodeConflict         = 4091 // 资源冲突
	CodeInternalError    = 5001 // 内部服务器错误
)
