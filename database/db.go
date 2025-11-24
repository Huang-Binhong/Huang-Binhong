package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

// parseSQLStatements 解析SQL文件为单独的语句
func parseSQLStatements(sql string) []string {
	var statements []string
	var currentStmt strings.Builder
	
	lines := strings.Split(sql, "\n")
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		
		// 跳过空行和注释
		if trimmed == "" || strings.HasPrefix(trimmed, "--") {
			continue
		}
		
		currentStmt.WriteString(line)
		currentStmt.WriteString("\n")
		
		// 如果行以分号结尾，这是一条完整的语句
		if strings.HasSuffix(trimmed, ";") {
			stmt := strings.TrimSpace(currentStmt.String())
			if stmt != "" {
				statements = append(statements, stmt)
			}
			currentStmt.Reset()
		}
	}
	
	// 处理最后一条可能没有分号的语句
	if currentStmt.Len() > 0 {
		stmt := strings.TrimSpace(currentStmt.String())
		if stmt != "" {
			statements = append(statements, stmt)
		}
	}
	
	return statements
}

// InitDB 初始化数据库
func InitDB() error {
	var err error
	dbPath := os.Getenv("DATABASE_PATH")
	if dbPath == "" {
		return fmt.Errorf("DATABASE_PATH environment variable is required")
	}

	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		return err
	}

	// 启用外键约束
	_, err = db.Exec("PRAGMA foreign_keys = ON")
	if err != nil {
		return err
	}

	// 读取并执行schema.sql
	schemaSQL, err := os.ReadFile("./database/schema.sql")
	if err != nil {
		log.Printf("Warning: Could not read schema.sql: %v", err)
		// 如果文件不存在，继续使用旧的初始化方式
		return initLegacyDB()
	}

	// 执行SQL脚本 - 改进的SQL解析逻辑
	sqlStatements := parseSQLStatements(string(schemaSQL))
	for _, stmt := range sqlStatements {
		if stmt == "" {
			continue
		}
		_, err = db.Exec(stmt)
		if err != nil {
			log.Printf("Warning: Failed to execute SQL statement: %v\nStatement: %s", err, stmt)
			// 继续执行其他语句
		}
	}

	log.Println("✅ Database schema initialized successfully")

	// 检查是否需要插入示例数据
	var personCount int
	err = db.QueryRow("SELECT COUNT(*) FROM persons").Scan(&personCount)
	if err == nil && personCount == 0 {
		// 读取并执行seed.sql插入示例数据
		seedSQL, err := os.ReadFile("./database/seed.sql")
		if err != nil {
			log.Printf("Warning: Could not read seed.sql: %v", err)
		} else {
			seedStatements := parseSQLStatements(string(seedSQL))
			for _, stmt := range seedStatements {
				if stmt == "" {
					continue
				}
				_, err = db.Exec(stmt)
				if err != nil {
					log.Printf("Warning: Failed to execute seed statement: %v\nStatement: %s", err, stmt)
				}
			}
			log.Println("✅ Sample data inserted successfully")
		}
	} else {
		log.Println("ℹ️  Database already contains data, skipping seed")
	}

	return nil
}

// initLegacyDB 旧的数据库初始化方式（兼容性）
func initLegacyDB() error {
	// 创建健康检查表
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS health (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		service_name TEXT NOT NULL,
		status TEXT NOT NULL,
		checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		return err
	}

	log.Println("✅ Database initialized with legacy schema")

	// 检查是否有数据，如果没有则插入一条记录
	var count int
	db.QueryRow("SELECT COUNT(*) FROM health").Scan(&count)
	if count == 0 {
		_, err = db.Exec("INSERT INTO health (service_name, status) VALUES (?, ?)",
			"go-backend-api", "healthy")
		if err != nil {
			log.Printf("插入健康记录失败: %v", err)
		} else {
			log.Println("✅ Health record inserted")
		}
	}

	return nil
}

// GetDB 获取数据库连接
func GetDB() *sql.DB {
	return db
}

// CloseDB 关闭数据库连接
func CloseDB() error {
	if db != nil {
		return db.Close()
	}
	return nil
}
