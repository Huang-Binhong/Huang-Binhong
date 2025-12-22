package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"

	"huang_bin_hong/internal/db"
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

// AIAnalyze AI艺术作品分析（支持缓存）
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

	// 获取作品ID
	workIDStr := r.FormValue("work_id")
	if workIDStr == "" {
		http.Error(w, "缺少 work_id 参数", http.StatusBadRequest)
		return
	}

	workID, err := strconv.Atoi(workIDStr)
	if err != nil {
		http.Error(w, "无效的 work_id", http.StatusBadRequest)
		return
	}

	// 检查是否已有缓存的分析结果
	var cachedAnalysis string
	err = db.DB.QueryRow("SELECT initial_analysis FROM ai_analysis WHERE work_id = ?", workID).Scan(&cachedAnalysis)

	// 如果找到缓存且内容不为空，直接返回
	if err == nil && cachedAnalysis != "" {
		log.Printf("使用缓存的分析结果，work_id: %d", workID)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"cached":  true,
			"data": map[string]interface{}{
				"content": cachedAnalysis,
			},
		})
		return
	}

	// 没有缓存，需要进行新的分析
	log.Printf("未找到缓存，开始AI分析，work_id: %d", workID)

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

	// 获取可选的自定义提示词和作品类别
	prompt := r.FormValue("prompt")
	category := r.FormValue("category")

	// 转换为 data URL
	dataURL := services.ToDataURL(imageBytes, contentType)

	// 调用 API
	settings := getDoubaoSettings()

	// 根据作品类别选择提示词
	if prompt == "" {
		if category == "书法" {
			prompt = settings.ChatCalligraphyPrompt
		} else {
			// 默认使用画作提示词
			prompt = settings.ChatPrompt
		}
	}

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

	// 保存到数据库（使用 INSERT OR REPLACE 确保插入或更新）
	_, err = db.DB.Exec(`INSERT OR REPLACE INTO ai_analysis (work_id, initial_analysis, updated_at)
		VALUES (?, ?, CURRENT_TIMESTAMP)`, workID, content)
	if err != nil {
		log.Printf("Warning: failed to cache analysis for work_id %d: %v", workID, err)
	} else {
		log.Printf("成功缓存分析结果，work_id: %d", workID)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"cached":  false,
		"data": map[string]interface{}{
			"content": content,
			"model":   result.Model,
			"usage":   result.Usage,
		},
	})
}

// AIChat AI对话功能（带内容限制，不保留历史）
func AIChat(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 解析JSON请求
	var req struct {
		WorkID   int    `json:"work_id"`
		Question string `json:"question"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error: 无法解析请求: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   "无法解析请求: " + err.Error(),
		})
		return
	}

	log.Printf("AIChat request: work_id=%d, question=%s", req.WorkID, req.Question)

	if req.WorkID == 0 {
		log.Printf("Error: 缺少 work_id 参数")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   "缺少 work_id 参数",
		})
		return
	}

	if req.Question == "" {
		log.Printf("Error: 缺少 question 参数")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   "缺少 question 参数",
		})
		return
	}

	// 获取作品信息
	var workTitle, workCategory string
	err := db.DB.QueryRow("SELECT title, category FROM works WHERE work_id = ?", req.WorkID).Scan(&workTitle, &workCategory)
	if err != nil {
		log.Printf("Error: 作品不存在, work_id=%d, error=%v", req.WorkID, err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   "作品不存在",
		})
		return
	}

	// 获取初始分析结果作为上下文（如果有的话）
	var initialAnalysis string
	err = db.DB.QueryRow("SELECT initial_analysis FROM ai_analysis WHERE work_id = ?", req.WorkID).Scan(&initialAnalysis)
	if err != nil {
		// 如果没有初始分析，使用默认提示
		initialAnalysis = "暂无初始分析内容"
		log.Printf("Warning: work_id %d 没有初始分析记录", req.WorkID)
	}

	// 构建系统提示词，限制对话范围
	systemPrompt := fmt.Sprintf(`你是一个专业的艺术讲解助手，正在为用户讲解黄宾虹的作品《%s》（%s）。

之前的分析内容：
%s

你只能回答与这幅作品相关的问题，包括：
- 作品的笔法、墨色、构图等艺术特点
- 作品的创作背景和历史故事
- 黄宾虹的艺术风格和理念
- 与这幅作品相关的艺术知识

如果用户的问题与这幅作品无关，请礼貌地回复："抱歉，我只能帮您讲解这幅作品哦"`, workTitle, workCategory, initialAnalysis)

	// 构建消息列表（不包含历史记录）
	messages := []services.ChatMessage{
		{
			Role: "system",
			Content: []services.ChatContent{
				{Type: "text", Text: systemPrompt},
			},
		},
		{
			Role: "user",
			Content: []services.ChatContent{
				{Type: "text", Text: req.Question},
			},
		},
	}

	// 调用AI
	settings := getDoubaoSettings()
	result, err := services.ChatWithHistory(settings, messages)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	// 提取回复内容
	reply := ""
	if len(result.Choices) > 0 {
		reply = result.Choices[0].Message.Content
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"content": reply,
			"model":   result.Model,
		},
	})
}
