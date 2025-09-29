package Logic

import (
	"strings"
	"wan-api-kol-event/DTO"
	"wan-api-kol-event/Initializers"
	"wan-api-kol-event/Models"
	"wan-api-kol-event/Utils"

	"gorm.io/gorm/clause"
)

// GetKolLogic lấy danh sách KOL với phân trang, search, filter và order
func GetKolLogic(pageIndex int, pageSize int, keyword string, exact map[string]string, sortBy string, sortDir string) ([]*DTO.KolDTO, int64, error) {
	var kols []Models.Kol
	var total int64

	db := Initializers.DB.Model(&Models.Kol{})

	// --- search keyword (không dấu, lowercase) ---
	if keyword != "" {
		searchKey := Utils.GenerateSearchKeyword(keyword)
		db = db.Where(`
			LOWER("Code") LIKE ? OR
			LOWER("Language") LIKE ? OR
			LOWER("Education") LIKE ? OR
			LOWER("CreatedBy") LIKE ? OR
			LOWER("ModifiedBy") LIKE ?
		`, "%"+searchKey+"%", "%"+searchKey+"%", "%"+searchKey+"%", "%"+searchKey+"%", "%"+searchKey+"%")
	}

	// --- filter exact ---
	for field, val := range exact {
		switch field {
		case "KolID", "UserProfileID", "RewardID", "PaymentMethodID", "TestimonialsID", "ChannelSettingTypeID":
			db = db.Where("\""+field+"\" = ?", Utils.StringToInt64(val))
		case "Enabled", "Active", "VerificationStatus", "IsRemove", "IsOnBoarding":
			db = db.Where("\""+field+"\" = ?", Utils.StringToBool(val))
		case "CreatedDate", "ModifiedDate", "ActiveDate":
			t := Utils.StringToTime(val)
			if !t.IsZero() {
				db = db.Where("\""+field+"\" = ?", t)
			}
		case "CreatedDateFrom":
			t := Utils.StringToTime(val)
			if !t.IsZero() {
				db = db.Where("\"CreatedDate\" >= ?", t)
			}
		case "CreatedDateTo":
			t := Utils.StringToTime(val)
			if !t.IsZero() {
				db = db.Where("\"CreatedDate\" <= ?", t)
			}
		case "ActiveDateFrom":
			t := Utils.StringToTime(val)
			if !t.IsZero() {
				db = db.Where("\"ActiveDate\" >= ?", t)
			}
		case "ActiveDateTo":
			t := Utils.StringToTime(val)
			if !t.IsZero() {
				db = db.Where("\"ActiveDate\" <= ?", t)
			}
		default:
			db = db.Where("\""+field+"\" = ?", val)
		}
	}

	// --- count total trước khi phân trang ---
	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// --- order ---
	isAsc := strings.ToLower(sortDir) == "asc"
	col := Utils.UpperFirstChar(sortBy) // ví dụ createdDate -> CreatedDate
	db = db.Order(clause.OrderByColumn{
		Column: clause.Column{Name: col},
		Desc:   !isAsc,
	})

	// --- paging ---
	offset := (pageIndex - 1) * pageSize
	result := db.Limit(pageSize).Offset(offset).Find(&kols)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	// --- map sang DTO ---
	var kolDTOs []*DTO.KolDTO
	for _, k := range kols {
		kolDTO := &DTO.KolDTO{
			KolID:                k.KolID,
			UserProfileID:        k.UserProfileID,
			Language:             k.Language,
			Education:            k.Education,
			ExpectedSalary:       k.ExpectedSalary,
			ExpectedSalaryEnable: k.ExpectedSalaryEnable,
			ChannelSettingTypeID: k.ChannelSettingTypeID,
			IDFrontURL:           k.IDFrontURL,
			IDBackURL:            k.IDBackURL,
			PortraitURL:          k.PortraitURL,
			RewardID:             k.RewardID,
			PaymentMethodID:      k.PaymentMethodID,
			TestimonialsID:       k.TestimonialsID,
			VerificationStatus:   k.VerificationStatus,
			Enabled:              k.Enabled,
			ActiveDate:           k.ActiveDate,
			Active:               k.Active,
			CreatedBy:            k.CreatedBy,
			CreatedDate:          k.CreatedDate,
			ModifiedBy:           k.ModifiedBy,
			ModifiedDate:         k.ModifiedDate,
			IsRemove:             k.IsRemove,
			IsOnBoarding:         k.IsOnBoarding,
			Code:                 k.Code,
			PortraitRightURL:     k.PortraitRightURL,
			PortraitLeftURL:      k.PortraitLeftURL,
			LivenessStatus:       k.LivenessStatus,
		}
		kolDTOs = append(kolDTOs, kolDTO)
	}

	return kolDTOs, total, nil
}
