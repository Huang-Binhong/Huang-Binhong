package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"huang_bin_hong/internal/db"
)

// 作品列表响应
type CollectionResponse struct {
	PageN          int              `json:"pageN"`
	PageNo         int              `json:"pageNo"`
	RealPath       string           `json:"realPath"`
	InfomationList []CollectionItem `json:"infomationList"`
}

type CollectionItem struct {
	ID             string   `json:"id"`
	CollectionName string   `json:"collectionName"`
	Author         string   `json:"author"`
	Age            string   `json:"age"`
	Category       string   `json:"category"`
	StylePeriod    string   `json:"stylePeriod"`
	Texture        string   `json:"texture"`
	CollectionSize string   `json:"collectionSize"`
	CollectionTime string   `json:"collectionTime"`
	CollectionUnit string   `json:"collectionUnit"`
	Intro          string   `json:"intro"`
	Description    string   `json:"description"`
	SmallPic       SmallPic `json:"smallPic"`
}

type SmallPic struct {
	DirectoryName string `json:"directoryName"`
	ResourceName  string `json:"resourceName"`
}

// 作品详情响应
type DetailResponse struct {
	BigPicSrcs  []string   `json:"bigPicSrcs"`
	Infomation  InfoDetail `json:"infomation"`
	SmallPicSrc string     `json:"smallPicSrc"`
}

type InfoDetail struct {
	ID             string `json:"id"`
	CollectionName string `json:"collectionName"`
	Author         string `json:"author"`
	Age            string `json:"age"`
	Category       string `json:"category"`
	StylePeriod    string `json:"stylePeriod"`
	CollectionSize string `json:"collectionSize"`
	CollectionTime string `json:"collectionTime"`
	CollectionUnit string `json:"collectionUnit"`
	Texture        string `json:"texture"`
	Intro          string `json:"intro"`
	Description    string `json:"description"`
}

// HuangCollection 作品列表API
func HuangCollection(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 支持 multipart/form-data 和 application/x-www-form-urlencoded
	r.ParseMultipartForm(10 << 20)
	r.ParseForm()

	category := r.FormValue("category")
	stylePeriod := r.FormValue("stylePeriod")
	sort := r.FormValue("sort")
	shuffleSeedStr := r.FormValue("shuffleSeed")
	pageNoStr := r.FormValue("pageNo")
	pageSizeStr := r.FormValue("pageSize")

	// 如果 FormValue 为空，尝试从 MultipartForm 中获取
	if r.MultipartForm != nil && r.MultipartForm.Value != nil {
		if category == "" {
			if vals, ok := r.MultipartForm.Value["category"]; ok && len(vals) > 0 {
				category = vals[0]
			}
		}
		if stylePeriod == "" {
			if vals, ok := r.MultipartForm.Value["stylePeriod"]; ok && len(vals) > 0 {
				stylePeriod = vals[0]
			}
		}
		if sort == "" {
			if vals, ok := r.MultipartForm.Value["sort"]; ok && len(vals) > 0 {
				sort = vals[0]
			}
		}
		if shuffleSeedStr == "" {
			if vals, ok := r.MultipartForm.Value["shuffleSeed"]; ok && len(vals) > 0 {
				shuffleSeedStr = vals[0]
			}
		}
		if pageNoStr == "" {
			if vals, ok := r.MultipartForm.Value["pageNo"]; ok && len(vals) > 0 {
				pageNoStr = vals[0]
			}
		}
		if pageSizeStr == "" {
			if vals, ok := r.MultipartForm.Value["pageSize"]; ok && len(vals) > 0 {
				pageSizeStr = vals[0]
			}
		}
	}

	pageNo, _ := strconv.Atoi(pageNoStr)
	pageSize, _ := strconv.Atoi(pageSizeStr)

	if pageNo < 1 {
		pageNo = 1
	}
	if pageSize < 1 {
		pageSize = 12
	}

	// 查询作品
	query := `SELECT work_id, title, category, style_period, material, creation_date, size, description, work_image_url
			  FROM works WHERE 1=1`
	args := []interface{}{}

	if category != "" {
		query += " AND category LIKE ?"
		args = append(args, category+"%")
	}

	if stylePeriod != "" {
		query += " AND style_period = ?"
		args = append(args, stylePeriod)
	}

	// 获取总数
	countQuery := "SELECT COUNT(*) FROM works WHERE 1=1"
	if category != "" {
		countQuery += " AND category LIKE ?"
	}
	if stylePeriod != "" {
		countQuery += " AND style_period = ?"
	}
	var total int
	if category != "" || stylePeriod != "" {
		countArgs := []interface{}{}
		if category != "" {
			countArgs = append(countArgs, category+"%")
		}
		if stylePeriod != "" {
			countArgs = append(countArgs, stylePeriod)
		}
		db.DB.QueryRow(countQuery, countArgs...).Scan(&total)
	} else {
		db.DB.QueryRow(countQuery).Scan(&total)
	}

	pageN := (total + pageSize - 1) / pageSize

	orderBy := ""
	orderArgs := []interface{}{}
	switch sort {
	case "year_asc":
		orderBy = " ORDER BY CAST(creation_date AS INTEGER) ASC, work_id ASC"
	case "year_desc":
		orderBy = " ORDER BY CAST(creation_date AS INTEGER) DESC, work_id DESC"
	default:
		shuffleSeed, _ := strconv.ParseInt(shuffleSeedStr, 10, 64)
		orderBy = " ORDER BY abs((work_id * 1103515245 + ?) % 2147483647) ASC"
		orderArgs = append(orderArgs, shuffleSeed)
	}

	// 分页查询
	offset := (pageNo - 1) * pageSize
	query += orderBy
	args = append(args, orderArgs...)
	query += " LIMIT ? OFFSET ?"
	args = append(args, pageSize, offset)

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	items := []CollectionItem{}
	for rows.Next() {
		var workID int
		var title, cat, stylePeriod, material, creationDate, size, desc, imageURL string
		rows.Scan(&workID, &title, &cat, &stylePeriod, &material, &creationDate, &size, &desc, &imageURL)

		// 提取文件名
		fileName := imageURL
		if len(imageURL) > 5 && imageURL[:5] == "work/" {
			fileName = imageURL[5:]
		}

		item := CollectionItem{
			ID:             strconv.Itoa(workID),
			CollectionName: title,
			Author:         "黄宾虹",
			Age:            "近现代",
			Category:       cat,
			StylePeriod:    stylePeriod,
			Texture:        material,
			CollectionSize: size,
			CollectionTime: creationDate,
			CollectionUnit: "",
			Intro:          desc,
			Description:    desc,
			SmallPic: SmallPic{
				DirectoryName: "work",
				ResourceName:  fileName,
			},
		}
		items = append(items, item)
	}

	resp := CollectionResponse{
		PageN:          pageN,
		PageNo:         pageNo,
		RealPath:       ".",
		InfomationList: items,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// HuangDetail 作品详情API
func HuangDetail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 支持 multipart/form-data 和 application/x-www-form-urlencoded
	r.ParseMultipartForm(10 << 20)
	r.ParseForm()

	infomationId := r.FormValue("infomationId")
	// 如果 FormValue 为空，尝试从 MultipartForm 中获取
	if infomationId == "" && r.MultipartForm != nil && r.MultipartForm.Value != nil {
		if vals, ok := r.MultipartForm.Value["infomationId"]; ok && len(vals) > 0 {
			infomationId = vals[0]
		}
	}

	workID, err := strconv.Atoi(infomationId)
	if err != nil {
		json.NewEncoder(w).Encode(DetailResponse{
			BigPicSrcs:  []string{},
			Infomation:  InfoDetail{},
			SmallPicSrc: "",
		})
		return
	}

	var title, cat, stylePeriod, material, creationDate, size, desc, imageURL string
	err = db.DB.QueryRow(`SELECT title, category, style_period, material, creation_date, size, description, work_image_url
						  FROM works WHERE work_id = ?`, workID).
		Scan(&title, &cat, &stylePeriod, &material, &creationDate, &size, &desc, &imageURL)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(DetailResponse{
			BigPicSrcs:  []string{},
			Infomation:  InfoDetail{},
			SmallPicSrc: "",
		})
		return
	}

	info := InfoDetail{
		ID:             infomationId,
		CollectionName: title,
		Author:         "黄宾虹",
		Age:            "近现代",
		Category:       cat,
		StylePeriod:    stylePeriod,
		CollectionSize: size,
		CollectionTime: creationDate,
		CollectionUnit: "",
		Texture:        material,
		Intro:          desc,
		Description:    desc,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(DetailResponse{
		BigPicSrcs:  []string{imageURL},
		Infomation:  info,
		SmallPicSrc: imageURL,
	})
}

// VRWork VR作品项
type VRWork struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Img  string `json:"img"`
	Desc string `json:"desc"`
}

// HuangVRWorks VR作品列表API
func HuangVRWorks(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.DB.Query(`SELECT work_id, title, description, work_image_url FROM works LIMIT 20`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	works := []VRWork{}
	for rows.Next() {
		var workID int
		var title, desc, imageURL string
		rows.Scan(&workID, &title, &desc, &imageURL)

		works = append(works, VRWork{
			ID:   strconv.Itoa(workID),
			Name: title,
			Img:  imageURL,
			Desc: desc,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"works": works,
	})
}

// Health 健康检查
func Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
