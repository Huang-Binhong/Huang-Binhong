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
	VideoWatermark bool

	// Chat/分析相关配置
	ChatModel          string
	ChatURL            string
	ChatTimeout        time.Duration
	ChatPrompt         string
	ChatCalligraphyPrompt string
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
		VideoWatermark: getBoolEnv("DOUBAO_VIDEO_WATERMARK", false),

		ChatModel:   getEnv("DOUBAO_CHAT_MODEL", "doubao-seed-1-6-flash-250828"),
		ChatURL:     getEnv("DOUBAO_CHAT_URL", "https://ark.cn-beijing.volces.com/api/v3/chat/completions"),
		ChatTimeout: time.Duration(getIntEnv("DOUBAO_CHAT_TIMEOUT", 120)) * time.Second,
		ChatPrompt:  getEnv("DOUBAO_CHAT_PROMPT", "请分析这幅艺术作品，解释笔法、墨色层次、构图布局、题款用印等特点，并介绍作品背后的故事。"),
		ChatCalligraphyPrompt: getEnv("DOUBAO_CHAT_CALLIGRAPHY_PROMPT", "请分析这幅书法作品，解释笔法特点、墨色运用、章法布局、题款用印等特点，并介绍作品的艺术价值。"),
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

type PromptOptions struct {
	UserPrompt     string
	InkStyle       string
	StyleTags      []string
	Strength       float64
	VideoMotion    string
	NegativePrompt string
}

func strengthHint(strength float64) string {
	if strength <= 0 {
		return ""
	}
	switch {
	case strength >= 0.9:
		return "严格保留原图构图、比例、透视与主体边界，仅转换笔墨与材质表现"
	case strength >= 0.75:
		return "较高保留原图结构与关键细节，优先体现墨色层次与纸本渗化"
	case strength >= 0.55:
		return "结构与写意平衡，允许适度简化细节以增强水墨气韵"
	case strength >= 0.35:
		return "偏写意处理，可适度重构笔墨节奏与留白；强调皴擦层次与墨色灰阶过渡，避免涂抹式大墨团与硬边描线"
	default:
		return "更写意概括，强化积墨/破墨/渍墨的层层堆叠与渗化晕染灰阶，保留主体大轮廓即可；避免大片纯黑实涂与单一墨团"
	}
}

func inkStyleHint(inkStyle string) string {
	switch strings.ToLower(strings.TrimSpace(inkStyle)) {
	case "thick":
		return "浑厚华滋、积墨（多层透明叠加而非平涂）、破墨/渍墨/宿墨交织，皴擦层层堆叠、墨色灰阶丰富，见笔触与纸本渗化；避免大块纯黑墨团、涂抹感与边界硬切"
	case "dry":
		return "干裂秋风、枯笔飞白、干皴擦、笔触颗粒感更强、墨色更苍劲；可少量见焦墨点苔与皴擦毛边，但不做线稿"
	case "light":
		return "淡墨清韵、淡墨层染、清润空灵、留白更大、墨色更通透；以灰阶与渗化层次取胜，避免发白寡淡"
	default:
		if strings.TrimSpace(inkStyle) == "" {
			return ""
		}
		return strings.TrimSpace(inkStyle)
	}
}

func videoMotionHint(motion string) string {
	switch strings.ToLower(strings.TrimSpace(motion)) {
	case "diffusion":
		return "水墨晕染扩散式动态：墨色在纸面自然渗化、层层洇开，节奏舒缓"
	case "parallax":
		return "层峦推移式动态：前景/中景/远景分层微动，镜头缓慢平移或轻推近"
	default:
		return ""
	}
}

func normalizeText(s string) string {
	return strings.TrimSpace(strings.ReplaceAll(strings.ReplaceAll(s, "\n", " "), "\r", " "))
}

// BuildPrompt 构建提示词（将“控制参数”留给请求参数，prompt 专注画面/风格）
func BuildPrompt(basePrompt string, opts PromptOptions) string {
	basePrompt = normalizeText(basePrompt)
	userPrompt := normalizeText(opts.UserPrompt)
	negative := normalizeText(opts.NegativePrompt)

	var parts []string
	if basePrompt != "" {
		parts = append(parts, basePrompt)
	}

	if userPrompt != "" {
		parts = append(parts, fmt.Sprintf("意境微调：%s", userPrompt))
	}

	if hint := strengthHint(opts.Strength); hint != "" {
		parts = append(parts, fmt.Sprintf("保留度：%s", hint))
	}

	var styleBits []string
	if hint := inkStyleHint(opts.InkStyle); hint != "" {
		styleBits = append(styleBits, hint)
	}
	for _, tag := range opts.StyleTags {
		tag = strings.TrimSpace(tag)
		if tag != "" {
			styleBits = append(styleBits, tag)
		}
	}
	if len(styleBits) > 0 {
		parts = append(parts, fmt.Sprintf("风格提示：%s", strings.Join(styleBits, "；")))
	}

	if hint := videoMotionHint(opts.VideoMotion); hint != "" {
		parts = append(parts, fmt.Sprintf("动态风格：%s", hint))
	}

	if negative != "" {
		parts = append(parts, fmt.Sprintf("避免：%s", negative))
	}

	return strings.Join(parts, "；")
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
	Model                string         `json:"model"`
	Content              []VideoContent `json:"content"`
	CallbackURL          string         `json:"callback_url,omitempty"`
	ReturnLastFrame      bool           `json:"return_last_frame,omitempty"`
	ServiceTier          string         `json:"service_tier,omitempty"`
	ExecutionExpiresAfter int           `json:"execution_expires_after,omitempty"`
	GenerateAudio        *bool          `json:"generate_audio,omitempty"`
	Resolution           string         `json:"resolution,omitempty"`
	Ratio                string         `json:"ratio,omitempty"`
	Duration             int            `json:"duration,omitempty"`
	FramesPerSecond      int            `json:"framespersecond,omitempty"`
	Seed                 int64          `json:"seed,omitempty"`
	Watermark            *bool          `json:"watermark,omitempty"`
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

type VideoTaskParams struct {
	CallbackURL          string
	ReturnLastFrame      bool
	ServiceTier          string
	ExecutionExpiresAfter int
	GenerateAudio        *bool
	Resolution           string
	Ratio                string
	Duration             int
	FramesPerSecond      int
	Seed                 int64
	Watermark            *bool
}

// CreateVideoTask 创建视频生成任务
func CreateVideoTask(settings *DoubaoSettings, prompt, imageURL string, params VideoTaskParams) (string, error) {
	if settings.VideoAPIKey == "" {
		return "", fmt.Errorf("缺少 DOUBAO_VIDEO_API_KEY")
	}

	payload := VideoTaskRequest{
		Model: settings.VideoModel,
		Content: []VideoContent{
			{Type: "text", Text: prompt},
			{Type: "image_url", ImageURL: &ImageURL{URL: imageURL}},
		},
		CallbackURL:          params.CallbackURL,
		ReturnLastFrame:      params.ReturnLastFrame,
		ServiceTier:          params.ServiceTier,
		ExecutionExpiresAfter: params.ExecutionExpiresAfter,
		Resolution:           params.Resolution,
		Ratio:                params.Ratio,
		Duration:             params.Duration,
		FramesPerSecond:      params.FramesPerSecond,
		Seed:                 params.Seed,
	}
	if params.GenerateAudio != nil {
		payload.GenerateAudio = params.GenerateAudio
	}
	if params.Watermark != nil {
		payload.Watermark = params.Watermark
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

// ChatWithHistory 带历史记录的对话
func ChatWithHistory(settings *DoubaoSettings, messages []ChatMessage) (*ChatResponse, error) {
	if settings.ChatAPIKey == "" {
		return nil, fmt.Errorf("缺少 DOUBAO_CHAT_API_KEY")
	}

	payload := ChatRequest{
		Model:    settings.ChatModel,
		Messages: messages,
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
