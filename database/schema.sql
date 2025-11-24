-- 黄宾虹书画艺术大展数字平台 - SQLite数据库结构

-- 1. 人物表（persons）
CREATE TABLE IF NOT EXISTS persons (
    person_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    alias VARCHAR(100),
    birth_date DATE,
    death_date DATE,
    biography TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 为人物表创建索引以支持模糊查询
CREATE INDEX IF NOT EXISTS idx_persons_name ON persons(name);
CREATE INDEX IF NOT EXISTS idx_persons_alias ON persons(alias);

-- 2. 作品表（works）
CREATE TABLE IF NOT EXISTS works (
    work_id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    style_period VARCHAR(50),
    material VARCHAR(100),
    creation_date DATE,
    description TEXT,
    work_image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES persons(person_id) ON DELETE CASCADE
);

-- 为作品表创建索引以支持筛选查询
CREATE INDEX IF NOT EXISTS idx_works_person_id ON works(person_id);
CREATE INDEX IF NOT EXISTS idx_works_category ON works(category);
CREATE INDEX IF NOT EXISTS idx_works_style_period ON works(style_period);
CREATE INDEX IF NOT EXISTS idx_works_material ON works(material);
CREATE INDEX IF NOT EXISTS idx_works_title ON works(title);

-- 3. 生平事件表（events）
CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER NOT NULL,
    location_id INTEGER,
    event_date DATE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    period VARCHAR(50),
    detailed_content TEXT,
    historical_events TEXT,  -- JSON格式存储
    images TEXT,             -- JSON格式存储
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES persons(person_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL
);

-- 为事件表创建索引
CREATE INDEX IF NOT EXISTS idx_events_person_id ON events(person_id);
CREATE INDEX IF NOT EXISTS idx_events_location_id ON events(location_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);

-- 4. 地点表（locations）
CREATE TABLE IF NOT EXISTS locations (
    location_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    latitude REAL,
    longitude REAL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 为地点表创建索引
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);

-- 5. 人际关系表（relations）
CREATE TABLE IF NOT EXISTS relations (
    relation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_person_id INTEGER NOT NULL,
    to_person_id INTEGER NOT NULL,
    relation_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_person_id) REFERENCES persons(person_id) ON DELETE CASCADE,
    FOREIGN KEY (to_person_id) REFERENCES persons(person_id) ON DELETE CASCADE
);

-- 为关系表创建索引
CREATE INDEX IF NOT EXISTS idx_relations_from_person ON relations(from_person_id);
CREATE INDEX IF NOT EXISTS idx_relations_to_person ON relations(to_person_id);
CREATE INDEX IF NOT EXISTS idx_relations_type ON relations(relation_type);

-- 创建唯一约束，防止重复关系
CREATE UNIQUE INDEX IF NOT EXISTS idx_relations_unique ON relations(from_person_id, to_person_id, relation_type);
