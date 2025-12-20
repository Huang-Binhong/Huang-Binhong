package config

import (
	"bufio"
	"os"
	"path/filepath"
	"strings"
)

// Config 应用配置
type Config struct {
	ServerPort string
	DBPath     string
	DataDir    string
}

// LoadEnv 加载 .env 文件
func LoadEnv() error {
	// 尝试从当前目录和上级目录加载 .env
	paths := []string{".env", "../.env"}

	// 获取可执行文件所在目录
	if exe, err := os.Executable(); err == nil {
		exeDir := filepath.Dir(exe)
		paths = append(paths, filepath.Join(exeDir, ".env"))
	}

	for _, path := range paths {
		if err := loadEnvFile(path); err == nil {
			return nil
		}
	}
	return nil // 如果找不到 .env 文件，使用默认值
}

func loadEnvFile(path string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// 跳过空行和注释
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		// 解析 KEY=VALUE
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])

		// 只在环境变量未设置时才设置
		if os.Getenv(key) == "" {
			os.Setenv(key, value)
		}
	}

	return scanner.Err()
}

// GetConfig 获取配置
func GetConfig() *Config {
	return &Config{
		ServerPort: getEnv("SERVER_PORT", "8080"),
		DBPath:     getEnv("DB_PATH", "data/huang_bin_hong.db"),
		DataDir:    getEnv("DATA_DIR", "data/datas"),
	}
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
