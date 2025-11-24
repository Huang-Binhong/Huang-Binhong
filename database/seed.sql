-- 黄宾虹书画艺术大展数字平台 - 示例数据

-- 1. 插入人物数据
INSERT INTO persons (person_id, name, alias, birth_date, death_date, biography) VALUES
(1, '黄宾虹', '宾虹', '1865-01-27', '1955-03-25', '黄宾虹，浙江金华人，近现代山水画家，号宾虹，学术深厚，尤以黄山画作著名。');

-- 如果后续需要添加其他人物（如齐白石），可以继续添加
INSERT INTO persons (person_id, name, alias, birth_date, death_date, biography) VALUES
(20, '齐白石', '白石', '1864-01-01', '1957-09-16', '齐白石，湖南湘潭人，近现代著名画家、书法家、篆刻家。');

-- 2. 插入作品数据
INSERT INTO works (work_id, person_id, title, category, style_period, material, creation_date, description, work_image_url) VALUES
(101, 1, '黄山纪游图', '画作', '晚期', '纸本设色', '1947-01-01', '黄山纪游图是黄宾虹创作的代表性山水画之一，描绘了黄山的壮丽景色。', '/images/works/huangshan.jpg');

-- 3. 插入地点数据
INSERT INTO locations (location_id, name, latitude, longitude, description) VALUES
(10, '浙江金华', 29.0781, 119.6528, '黄宾虹出生地，位于浙江省金华市。');

INSERT INTO locations (location_id, name, latitude, longitude, description) VALUES
(11, '上海', 31.23037, 121.47370, '上海市，黄宾虹曾长期居住于此');

-- 4. 插入事件数据
INSERT INTO events (event_id, person_id, location_id, event_date, title, description, type, location, period, detailed_content, historical_events, images) VALUES
(1, 1, 10, '1865-01-27', '出生于浙江金华', '1月27日黄宾虹出生于浙江金华...', 'birth', '浙江金华', '早年求学',
'黄宾虹，原名原字，号宾虹，1865年1月27日出生于浙江金华的一个书香门第...',
'["江南制造总局在上海成立", "捻军在山东青州开天赋格林苏部"]',
'[{"id": 1, "url": "/images/bio/birthplace.jpg", "alt": "金华铁道岔头居", "caption": "黄宾虹出生地—浙江金华铁道岔头街"}]');

-- 5. 插入人际关系数据
INSERT INTO relations (relation_id, from_person_id, to_person_id, relation_type, description) VALUES
(5001, 1, 20, '朋友', '黄宾虹与齐白石是朋友，并共同参与多个艺术展览。');
