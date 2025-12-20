package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
	"github.com/xuri/excelize/v2"
)

var DB *sql.DB

// InitDB 初始化数据库连接并创建表
func InitDB(dbPath string) error {
	var err error
	DB, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	if err = createTables(); err != nil {
		return fmt.Errorf("failed to create tables: %w", err)
	}

	log.Println("Database initialized successfully")
	return nil
}

// createTables 创建所有表
func createTables() error {
	// 创建 persons 表
	personsSQL := `
	CREATE TABLE IF NOT EXISTS persons (
		person_id INTEGER PRIMARY KEY,
		name TEXT NOT NULL,
		alias TEXT,
		birth_date TEXT,
		death_date TEXT,
		biography TEXT
	);`

	// 创建 events 表
	eventsSQL := `
	CREATE TABLE IF NOT EXISTS events (
		event_id INTEGER PRIMARY KEY,
		person_id INTEGER NOT NULL,
		event_date TEXT,
		title TEXT,
		description TEXT,
		type TEXT,
		period TEXT,
		historical_events TEXT,
		historical_details TEXT,
		FOREIGN KEY (person_id) REFERENCES persons(person_id)
	);`

	// 创建 relations 表
	relationsSQL := `
	CREATE TABLE IF NOT EXISTS relations (
		relation_id INTEGER PRIMARY KEY,
		from_person_id INTEGER NOT NULL,
		to_person_id INTEGER NOT NULL,
		relation_type TEXT,
		description TEXT,
		FOREIGN KEY (from_person_id) REFERENCES persons(person_id),
		FOREIGN KEY (to_person_id) REFERENCES persons(person_id)
	);`

	// 创建 works 表
	worksSQL := `
	CREATE TABLE IF NOT EXISTS works (
		work_id INTEGER PRIMARY KEY,
		person_id INTEGER NOT NULL,
		title TEXT,
		category TEXT,
		style_period TEXT,
		material TEXT,
		creation_date TEXT,
		description TEXT,
		work_image_url TEXT,
		FOREIGN KEY (person_id) REFERENCES persons(person_id)
	);`

	statements := []string{personsSQL, eventsSQL, relationsSQL, worksSQL}
	for _, stmt := range statements {
		if _, err := DB.Exec(stmt); err != nil {
			return err
		}
	}

	return nil
}

// Close 关闭数据库连接
func Close() {
	if DB != nil {
		DB.Close()
	}
}

// NeedImportData 检查是否需要导入数据
func NeedImportData() bool {
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM persons").Scan(&count)
	if err != nil {
		return true
	}
	return count == 0
}

// ImportData 从xlsx文件导入数据
func ImportData(dataDir string) error {
	log.Println("Starting data import...")

	if err := importPersons(filepath.Join(dataDir, "person.xlsx")); err != nil {
		return fmt.Errorf("failed to import persons: %w", err)
	}

	if err := importEvents(filepath.Join(dataDir, "event.xlsx")); err != nil {
		return fmt.Errorf("failed to import events: %w", err)
	}

	if err := importRelations(filepath.Join(dataDir, "relation.xlsx")); err != nil {
		return fmt.Errorf("failed to import relations: %w", err)
	}

	if err := importWorks(filepath.Join(dataDir, "work.xlsx")); err != nil {
		return fmt.Errorf("failed to import works: %w", err)
	}

	log.Println("Data import completed successfully")
	return nil
}

func importPersons(filePath string) error {
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return fmt.Errorf("file not found: %s", filePath)
	}

	f, err := excelize.OpenFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to open %s: %w", filePath, err)
	}
	defer f.Close()

	rows, err := f.GetRows("Sheet1")
	if err != nil {
		return fmt.Errorf("failed to get rows: %w", err)
	}

	stmt, err := DB.Prepare(`INSERT OR REPLACE INTO persons
		(person_id, name, alias, birth_date, death_date, biography)
		VALUES (?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	count := 0
	for i, row := range rows {
		if i == 0 {
			continue
		}
		if len(row) < 6 {
			continue
		}

		personID, _ := strconv.Atoi(row[0])
		_, err := stmt.Exec(personID, row[1], row[2], row[3], row[4], row[5])
		if err != nil {
			log.Printf("Warning: failed to insert person %d: %v", personID, err)
			continue
		}
		count++
	}

	log.Printf("Imported %d persons", count)
	return nil
}

func importEvents(filePath string) error {
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return fmt.Errorf("file not found: %s", filePath)
	}

	f, err := excelize.OpenFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to open %s: %w", filePath, err)
	}
	defer f.Close()

	rows, err := f.GetRows("Sheet1")
	if err != nil {
		return fmt.Errorf("failed to get rows: %w", err)
	}

	stmt, err := DB.Prepare(`INSERT OR REPLACE INTO events
		(event_id, person_id, event_date, title, description, type, period, historical_events, historical_details)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	count := 0
	for i, row := range rows {
		if i == 0 {
			continue
		}
		for len(row) < 9 {
			row = append(row, "")
		}

		eventID, _ := strconv.Atoi(row[0])
		personID, _ := strconv.Atoi(row[1])
		_, err := stmt.Exec(eventID, personID, row[2], row[3], row[4], row[5], row[6], row[7], row[8])
		if err != nil {
			log.Printf("Warning: failed to insert event %d: %v", eventID, err)
			continue
		}
		count++
	}

	log.Printf("Imported %d events", count)
	return nil
}

func importRelations(filePath string) error {
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return fmt.Errorf("file not found: %s", filePath)
	}

	f, err := excelize.OpenFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to open %s: %w", filePath, err)
	}
	defer f.Close()

	rows, err := f.GetRows("Sheet1")
	if err != nil {
		return fmt.Errorf("failed to get rows: %w", err)
	}

	stmt, err := DB.Prepare(`INSERT OR REPLACE INTO relations
		(relation_id, from_person_id, to_person_id, relation_type, description)
		VALUES (?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	count := 0
	for i, row := range rows {
		if i == 0 {
			continue
		}
		for len(row) < 5 {
			row = append(row, "")
		}

		relationID, _ := strconv.Atoi(row[0])
		fromPersonID, _ := strconv.Atoi(row[1])
		toPersonID, _ := strconv.Atoi(row[2])
		_, err := stmt.Exec(relationID, fromPersonID, toPersonID, row[3], row[4])
		if err != nil {
			log.Printf("Warning: failed to insert relation %d: %v", relationID, err)
			continue
		}
		count++
	}

	log.Printf("Imported %d relations", count)
	return nil
}

func importWorks(filePath string) error {
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return fmt.Errorf("file not found: %s", filePath)
	}

	f, err := excelize.OpenFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to open %s: %w", filePath, err)
	}
	defer f.Close()

	rows, err := f.GetRows("Sheet1")
	if err != nil {
		return fmt.Errorf("failed to get rows: %w", err)
	}

	stmt, err := DB.Prepare(`INSERT OR REPLACE INTO works
		(work_id, person_id, title, category, style_period, material, creation_date, description, work_image_url)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	count := 0
	for i, row := range rows {
		if i == 0 {
			continue
		}
		for len(row) < 9 {
			row = append(row, "")
		}

		workID, _ := strconv.Atoi(row[0])
		personID, _ := strconv.Atoi(row[1])
		_, err := stmt.Exec(workID, personID, row[2], row[3], row[4], row[5], row[6], row[7], row[8])
		if err != nil {
			log.Printf("Warning: failed to insert work %d: %v", workID, err)
			continue
		}
		count++
	}

	log.Printf("Imported %d works", count)
	return nil
}
