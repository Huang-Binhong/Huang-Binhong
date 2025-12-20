package services

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

// DoubaoSettings 豆包API配置
type DoubaoSettings struct {
	// 分开的 API Keys
	ImageAPIKey string
	VideoAPIKey string
	ChatAPIKey  string

	ImageModel          string
	ImageURL            string
	ImageSize           string
	ImageWatermark      bool
	ImageTimeout        time.Duration
	ImageResponseFormat string

	VideoModel    string
	VideoTaskURL  string
	VideoQueryURL string
	VideoTimeout  time.Duration

	// Chat/分析相关配置
	ChatModel   string
	ChatURL     string
	ChatTimeout time.Duration
	ChatPrompt  string
}

// NewDoubaoSettings 从环境变量创建配置
func NewDoubaoSettings() *DoubaoSettings {
	return &DoubaoSettings{
		// 分开读取各功能的 API Key
		ImageAPIKey: getEnv("DOUBAO_IMAGE_API_KEY", getEnv("DOUBAO_API_KEY", "")),
		VideoAPIKey: getEnv("DOUBAO_VIDEO_API_KEY", getEnv("DOUBAO_API_KEY", "")),
		ChatAPIKey:  getEnv("DOUBAO_CHAT_API_KEY", getEnv("DOUBAO_API_KEY", "")),

		ImageModel:          getEnv("DOUBAO_IMAGE_MODEL", "doubao-seedream-4-0-250828"),
		ImageURL:            getEnv("DOUBAO_IMAGE_URL", "https://ark.cn-beijing.volces.com/api/v3/images/generations"),
		ImageSize:           getEnv("DOUBAO_IMAGE_SIZE", "2K"),
		ImageWatermark:      getBoolEnv("DOUBAO_IMAGE_WATERMARK", true),
		ImageTimeout:        time.Duration(getIntEnv("DOUBAO_IMAGE_TIMEOUT", 60)) * time.Second,
		ImageResponseFormat: getEnv("DOUBAO_IMAGE_RESPONSE_FORMAT", "url"),

		VideoModel:    getEnv("DOUBAO_VIDEO_MODEL", "doubao-seedance-1-0-pro-250528"),
		VideoTaskURL:  getEnv("DOUBAO_VIDEO_TASK_URL", "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks"),
		VideoQueryURL: getEnv("DOUBAO_VIDEO_QUERY_URL", "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/"),
		VideoTimeout:  time.Duration(getIntEnv("DOUBAO_VIDEO_TIMEOUT", 60)) * time.Second,

		ChatModel:   getEnv("DOUBAO_CHAT_MODEL", "doubao-seed-1-6-flash-250828"),
		ChatURL:     getEnv("DOUBAO_CHAT_URL", "https://ark.cn-beijing.volces.com/api/v3/chat/completions"),
		ChatTimeout: time.Duration(getIntEnv("DOUBAO_CHAT_TIMEOUT", 120)) * time.Second,
		ChatPrompt:  getEnv("DOUBAO_CHAT_PROMPT", "请分析这幅艺术作品，解释笔法、墨色层次、构图布局、题款用印等特点，并介绍作品背后的故事。"),
	}
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getBoolEnv(key string, defaultVal bool) bool {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	lower := strings.ToLower(val)
	return lower == "1" || lower == "true" || lower == "yes"
}

func getIntEnv(key string, defaultVal int) int {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	if i, err := strconv.Atoi(val); err == nil {
		return i
	}
	return defaultVal
}

// BuildPrompt 构建提示词
func BuildPrompt(basePrompt, inkStyle string, styleTags []string) string {
	var styleBits []string
	if inkStyle != "" {
		styleBits = append(styleBits, inkStyle)
	}
	for _, tag := range styleTags {
		if tag != "" {
			styleBits = append(styleBits, tag)
		}
	}
	styleSuffix := strings.Join(styleBits, "；")
	if styleSuffix != "" {
		return fmt.Sprintf("%s；风格提示：%s", basePrompt, styleSuffix)
	}
	return basePrompt
}

// ToDataURL 将图片字节转换为 data URL
func ToDataURL(imageBytes []byte, contentType string) string {
	b64 := base64.StdEncoding.EncodeToString(imageBytes)
	return fmt.Sprintf("data:%s;base64,%s", contentType, b64)
}

// ImageGenerationRequest 图片生成请求
type ImageGenerationRequest struct {
	Model                       string `json:"model"`
	Prompt                      string `json:"prompt"`
	Image                       string `json:"image"`
	SequentialImageGeneration   string `json:"sequential_image_generation"`
	ResponseFormat              string `json:"response_format"`
	Size                        string `json:"size"`
	Stream                      bool   `json:"stream"`
	Watermark                   bool   `json:"watermark"`
}

// ImageGenerationResponse 图片生成响应
type ImageGenerationResponse struct {
	URL      string `json:"url"`
	ImageURL string `json:"image_url"`
	Data     []struct {
		URL string `json:"url"`
	} `json:"data"`
}

// GenerateImage 调用豆包图片生成API
func GenerateImage(settings *DoubaoSettings, imageDataURL, prompt string, n int, size string) ([]string, error) {
	if settings.ImageAPIKey == "" {
		return nil, fmt.Errorf("缺少 DOUBAO_IMAGE_API_KEY")
	}

	if size == "" {
		size = settings.ImageSize
	}

	payload := ImageGenerationRequest{
		Model:                       settings.ImageModel,
		Prompt:                      prompt,
		Image:                       imageDataURL,
		SequentialImageGeneration:   "disabled",
		ResponseFormat:              settings.ImageResponseFormat,
		Size:                        size,
		Stream:                      false,
		Watermark:                   settings.ImageWatermark,
	}

	client := &http.Client{Timeout: settings.ImageTimeout}
	results := make([]string, 0, n)

	for i := 0; i < n; i++ {
		jsonData, err := json.Marshal(payload)
		if err != nil {
			return nil, fmt.Errorf("序列化请求失败: %v", err)
		}

		req, err := http.NewRequest("POST", settings.ImageURL, bytes.NewBuffer(jsonData))
		if err != nil {
			return nil, fmt.Errorf("创建请求失败: %v", err)
		}

		req.Header.Set("Authorization", "Bearer "+settings.ImageAPIKey)
		req.Header.Set("Content-Type", "application/json")

		resp, err := client.Do(req)
		if err != nil {
			return nil, fmt.Errorf("请求失败: %v", err)
		}

		body, err := io.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			return nil, fmt.Errorf("读取响应失败: %v", err)
		}

		if resp.StatusCode >= 400 {
			return nil, fmt.Errorf("Doubao image error %d: %s", resp.StatusCode, string(body))
		}

		var result ImageGenerationResponse
		if err := json.Unmarshal(body, &result); err != nil {
			return nil, fmt.Errorf("解析响应失败: %v", err)
		}

		url := result.URL
		if url == "" {
			url = result.ImageURL
		}
		if url == "" && len(result.Data) > 0 {
			url = result.Data[0].URL
		}
		if url == "" {
			return nil, fmt.Errorf("未从 Doubao 返回结果 url")
		}

		results = append(results, url)
	}

	return results, nil
}

// VideoTaskRequest 视频任务请求
type VideoTaskRequest struct {
	Model   string        `json:"model"`
	Content []VideoContent `json:"content"`
}

// VideoContent 视频内容
type VideoContent struct {
	Type     string    `json:"type"`
	Text     string    `json:"text,omitempty"`
	ImageURL *ImageURL `json:"image_url,omitempty"`
}

// ImageURL 图片URL
type ImageURL struct {
	URL string `json:"url"`
}

// VideoTaskResponse 视频任务响应
type VideoTaskResponse struct {
	ID     string `json:"id"`
	TaskID string `json:"task_id"`
}

// CreateVideoTask 创建视频生成任务
func CreateVideoTask(settings *DoubaoSettings, prompt, imageURL string) (string, error) {
	if settings.VideoAPIKey == "" {
		return "", fmt.Errorf("缺少 DOUBAO_VIDEO_API_KEY")
	}

	payload := VideoTaskRequest{
		Model: settings.VideoModel,
		Content: []VideoContent{
			{Type: "text", Text: prompt},
			{Type: "image_url", ImageURL: &ImageURL{URL: imageURL}},
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("序列化请求失败: %v", err)
	}

	client := &http.Client{Timeout: settings.VideoTimeout}
	req, err := http.NewRequest("POST", settings.VideoTaskURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("创建请求失败: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+settings.VideoAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("请求失败: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("读取响应失败: %v", err)
	}

	if resp.StatusCode >= 400 {
		return "", fmt.Errorf("Doubao video task error %d: %s", resp.StatusCode, string(body))
	}

	var result VideoTaskResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("解析响应失败: %v", err)
	}

	taskID := result.ID
	if taskID == "" {
		taskID = result.TaskID
	}
	if taskID == "" {
		return "", fmt.Errorf("未获取到任务 id")
	}

	return taskID, nil
}

// QueryVideoTask 查询视频任务状态
func QueryVideoTask(settings *DoubaoSettings, taskID string) (map[string]interface{}, error) {
	url := strings.TrimRight(settings.VideoQueryURL, "/") + "/" + taskID

	client := &http.Client{Timeout: settings.VideoTimeout}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+settings.VideoAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求失败: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %v", err)
	}

	// 打印响应日志，便于调试
	fmt.Printf("[QueryVideoTask] taskID=%s, status=%d, body=%s\n", taskID, resp.StatusCode, string(body))

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("Doubao video query error %d: %s", resp.StatusCode, string(body))
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("解析响应失败: %v", err)
	}

	return result, nil
}

// ChatMessage 聊天消息
type ChatMessage struct {
	Role    string        `json:"role"`
	Content []ChatContent `json:"content"`
}

// ChatContent 聊天内容
type ChatContent struct {
	Type     string        `json:"type"`
	Text     string        `json:"text,omitempty"`
	ImageURL *ChatImageURL `json:"image_url,omitempty"`
}

// ChatImageURL 聊天图片URL
type ChatImageURL struct {
	URL string `json:"url"`
}

// ChatRequest 聊天请求
type ChatRequest struct {
	Model    string        `json:"model"`
	Messages []ChatMessage `json:"messages"`
}

// ChatResponse 聊天响应
type ChatResponse struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Index   int `json:"index"`
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
	Usage struct {
		PromptTokens     int `json:"prompt_tokens"`
		CompletionTokens int `json:"completion_tokens"`
		TotalTokens      int `json:"total_tokens"`
	} `json:"usage"`
}

// AnalyzeArtwork 分析艺术作品
func AnalyzeArtwork(settings *DoubaoSettings, imageDataURL string, prompt string) (*ChatResponse, error) {
	if settings.ChatAPIKey == "" {
		return nil, fmt.Errorf("缺少 DOUBAO_CHAT_API_KEY")
	}

	if prompt == "" {
		prompt = settings.ChatPrompt
	}

	payload := ChatRequest{
		Model: settings.ChatModel,
		Messages: []ChatMessage{
			{
				Role: "user",
				Content: []ChatContent{
					{
						Type:     "image_url",
						ImageURL: &ChatImageURL{URL: imageDataURL},
					},
					{
						Type: "text",
						Text: prompt,
					},
				},
			},
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("序列化请求失败: %v", err)
	}

	client := &http.Client{Timeout: settings.ChatTimeout}
	req, err := http.NewRequest("POST", settings.ChatURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+settings.ChatAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求失败: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %v", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("Doubao chat error %d: %s", resp.StatusCode, string(body))
	}

	var result ChatResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("解析响应失败: %v", err)
	}

	return &result, nil
}
