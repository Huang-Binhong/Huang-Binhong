package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"

	"huang_bin_hong/internal/services"
)

var (
	doubaoSettings *services.DoubaoSettings
	basePrompt     string
	initOnce       sync.Once
)

// 延迟初始化，确保在 .env 加载后才创建配置
func getDoubaoSettings() *services.DoubaoSettings {
	initOnce.Do(func() {
		doubaoSettings = services.NewDoubaoSettings()
		basePrompt = os.Getenv("DOUBAO_BASE_PROMPT")
		if basePrompt == "" {
			basePrompt = "将输入图片迁移为黄宾虹风格，保留主体构图与内容，笔墨苍润、墨色层次丰富，提升纸本肌理与皴擦效果。"
		}
	})
	return doubaoSettings
}

// parseTags 解析风格标签
func parseTags(raw string) []string {
	if raw == "" {
		return nil
	}
	raw = strings.ReplaceAll(raw, ";", ",")
	parts := strings.Split(raw, ",")
	var tags []string
	for _, t := range parts {
		t = strings.TrimSpace(t)
		if t != "" {
			tags = append(tags, t)
		}
	}
	return tags
}

// StyleTransferImage 图片风格迁移
func StyleTransferImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 解析 multipart form
	if err := r.ParseMultipartForm(32 << 20); err != nil { // 32MB max
		http.Error(w, "无法解析表单: "+err.Error(), http.StatusBadRequest)
		return
	}

	// 获取上传的文件
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "请上传图片文件", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// 检查文件类型
	contentType := header.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		http.Error(w, "请上传图片文件（image/*）", http.StatusBadRequest)
		return
	}

	// 读取文件内容
	imageBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "读取文件失败: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if len(imageBytes) == 0 {
		http.Error(w, "文件为空", http.StatusBadRequest)
		return
	}

	// 获取表单参数
	prompt := r.FormValue("prompt")
	inkStyle := r.FormValue("ink_style")
	styleTags := r.FormValue("style_tags")
	imgCountStr := r.FormValue("img_count")
	size := r.FormValue("size")

	imgCount := 1
	if imgCountStr != "" {
		if n, err := strconv.Atoi(imgCountStr); err == nil && n > 0 {
			imgCount = n
		}
	}

	// 构建提示词
	tags := parseTags(styleTags)
	if prompt == "" {
		prompt = basePrompt
	}
	promptText := services.BuildPrompt(prompt, inkStyle, tags)

	// 转换为 data URL
	dataURL := services.ToDataURL(imageBytes, contentType)

	// 调用 API
	settings := getDoubaoSettings()
	urls, err := services.GenerateImage(settings, dataURL, promptText, imgCount, size)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":    false,
			"error": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok":     true,
		"model":  settings.ImageModel,
		"prompt": promptText,
		"urls":   urls,
	})
}

// StyleTransferVideo 创建视频风格迁移任务
func StyleTransferVideo(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 解析表单（支持 multipart/form-data 和 application/x-www-form-urlencoded）
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		// 如果不是 multipart，尝试普通表单
		if err := r.ParseForm(); err != nil {
			http.Error(w, "无法解析表单: "+err.Error(), http.StatusBadRequest)
			return
		}
	}

	// 获取参数
	imageURL := r.FormValue("image_url")
	if imageURL == "" {
		http.Error(w, "缺少 image_url 参数", http.StatusBadRequest)
		return
	}

	prompt := r.FormValue("prompt")
	inkStyle := r.FormValue("ink_style")
	styleTags := r.FormValue("style_tags")
	videoMotion := r.FormValue("video_motion")
	videoDurationStr := r.FormValue("video_duration")

	if videoMotion == "" {
		videoMotion = "diffusion"
	}
	videoDuration := 5
	if videoDurationStr != "" {
		if d, err := strconv.Atoi(videoDurationStr); err == nil && d > 0 {
			videoDuration = d
		}
	}

	// 构建提示词
	tags := parseTags(styleTags)
	if prompt == "" {
		prompt = basePrompt
	}
	basePromptText := services.BuildPrompt(prompt, inkStyle, tags)
	promptText := fmt.Sprintf("%s；动效：%s；时长：%ds；水印：true", basePromptText, videoMotion, videoDuration)

	// 创建任务
	settings := getDoubaoSettings()
	taskID, err := services.CreateVideoTask(settings, promptText, imageURL)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":    false,
			"error": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok":      true,
		"task_id": taskID,
		"model":   settings.VideoModel,
		"prompt":  promptText,
	})
}

// StyleTransferVideoQuery 查询视频任务状态
func StyleTransferVideoQuery(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 从 URL 路径中提取 task_id
	// 路径格式: /api/style-transfer/video/{task_id}
	path := r.URL.Path
	prefix := "/api/style-transfer/video/"
	if !strings.HasPrefix(path, prefix) {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	taskID := strings.TrimPrefix(path, prefix)
	if taskID == "" {
		http.Error(w, "缺少 task_id", http.StatusBadRequest)
		return
	}

	// 查询任务
	settings := getDoubaoSettings()
	data, err := services.QueryVideoTask(settings, taskID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":    false,
			"error": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok":    true,
		"model": settings.VideoModel,
		"data":  data,
	})
}

// AIAnalyze AI艺术作品分析
func AIAnalyze(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 解析 multipart form
	if err := r.ParseMultipartForm(32 << 20); err != nil { // 32MB max
		http.Error(w, "无法解析表单: "+err.Error(), http.StatusBadRequest)
		return
	}

	// 获取上传的文件
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "请上传图片文件", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// 检查文件类型
	contentType := header.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		http.Error(w, "请上传图片文件（image/*）", http.StatusBadRequest)
		return
	}

	// 读取文件内容
	imageBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "读取文件失败: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if len(imageBytes) == 0 {
		http.Error(w, "文件为空", http.StatusBadRequest)
		return
	}

	// 获取可选的自定义提示词
	prompt := r.FormValue("prompt")

	// 转换为 data URL
	dataURL := services.ToDataURL(imageBytes, contentType)

	// 调用 API
	settings := getDoubaoSettings()
	result, err := services.AnalyzeArtwork(settings, dataURL, prompt)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	// 提取分析内容
	content := ""
	if len(result.Choices) > 0 {
		content = result.Choices[0].Message.Content
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"content": content,
			"model":   result.Model,
			"usage":   result.Usage,
		},
	})
}
