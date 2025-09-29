package Controllers

import (
	"net/http"
	"strconv"
	"strings"
	"wan-api-kol-event/Const"
	"wan-api-kol-event/Logic"
	"wan-api-kol-event/ViewModels"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetKolsController godoc
// @Summary Lấy danh sách KOL
// @Description API trả về danh sách KOL với phân trang, tìm kiếm (theo từ khóa), lọc chính xác (exact filter) và sắp xếp
// @Tags KOL
// @Accept  json
// @Produce  json
// @Param pageIndex query int false "Số trang hiện tại (>=1). Nếu <1 sẽ tự động reset về 1." default(1)
// @Param pageSize query int false "Số bản ghi mỗi trang (1-200). Nếu <1 sẽ reset về 10." default(10)
// @Param keyword query string false "Từ khóa tìm kiếm (không phân biệt hoa thường, bỏ dấu). Áp dụng cho Code, Language, Education, CreatedBy, ModifiedBy."
// @Param KolID query int64 false "Lọc chính xác theo KolID"
// @Param UserProfileID query int64 false "Lọc chính xác theo UserProfileID"
// @Param Code query string false "Lọc chính xác theo Code"
// @Param Language query string false "Lọc chính xác theo Language"
// @Param Education query string false "Lọc chính xác theo Education"
// @Param Enabled query bool false "Lọc chính xác theo trạng thái Enabled"
// @Param Active query bool false "Lọc chính xác theo trạng thái Active"
// @Param VerificationStatus query bool false "Lọc chính xác theo trạng thái xác minh"
// @Param IsRemove query bool false "Lọc chính xác theo trạng thái IsRemove"
// @Param IsOnBoarding query bool false "Lọc chính xác theo trạng thái OnBoarding"
// @Param RewardID query int64 false "Lọc chính xác theo RewardID"
// @Param PaymentMethodID query int64 false "Lọc chính xác theo PaymentMethodID"
// @Param TestimonialsID query int64 false "Lọc chính xác theo TestimonialsID"
// @Param ChannelSettingTypeID query int64 false "Lọc chính xác theo ChannelSettingTypeID"
// @Param CreatedDate query string false "Lọc chính xác theo ngày tạo (format: 2006-01-02T15:04:05.00)"
// @Param ModifiedDate query string false "Lọc chính xác theo ngày sửa (format: 2006-01-02T15:04:05.00)"
// @Param ActiveDate query string false "Lọc chính xác theo ngày kích hoạt (format: 2006-01-02T15:04:05.00)"
// @Param CreatedDateFrom query string false "Lọc từ ngày tạo (>=). Format: 2006-01-02T15:04:05.00"
// @Param CreatedDateTo query string false "Lọc đến ngày tạo (<=). Format: 2006-01-02T15:04:05.00"
// @Param ActiveDateFrom query string false "Lọc từ ngày kích hoạt (>=). Format: 2006-01-02T15:04:05.00"
// @Param ActiveDateTo query string false "Lọc đến ngày kích hoạt (<=). Format: 2006-01-02T15:04:05.00"
// @Param sortBy query string false "Cột để sắp xếp (KolID, Code, Language, Education, CreatedDate, ModifiedDate, ExpectedSalary)" default(CreatedDate)
// @Param sortDir query string false "Chiều sắp xếp (asc|desc)" default(desc)
// @Success 200 {object} ViewModels.KolViewModel
// @Failure 400 {object} ViewModels.KolViewModel
// @Failure 500 {object} ViewModels.KolViewModel
// @Router /kols [get]

func GetKolsController(c *gin.Context) {
	var vm ViewModels.KolViewModel
	vm.Guid = uuid.New().String()

	// --- paging ---
	pageIndex, err := strconv.Atoi(c.DefaultQuery("pageIndex", "1"))
	if err != nil || pageIndex < 1 {
		pageIndex = 1
		vm.Result = Const.UnSuccess
		vm.ErrorMessage = "pageIndex invalid, reset to 1"
	}
	pageSize, err := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	if err != nil || pageSize < 1 {
		pageSize = 10
		if vm.ErrorMessage == "" {
			vm.Result = Const.UnSuccess
		}
		vm.ErrorMessage += " pageSize invalid, reset to 10"
	}
	if pageSize > 200 {
		vm.Result = Const.UnSuccess
		vm.ErrorMessage = "pageSize too large (max 200)"
		vm.PageIndex = int64(pageIndex)
		vm.PageSize = int64(pageSize)
		vm.TotalCount = 0
		vm.KOL = nil
		c.JSON(http.StatusBadRequest, vm)
		return
	}

	// --- search ---
	keyword := c.Query("keyword")
	exact := map[string]string{}
	for _, k := range []string{
		"KolID", "UserProfileID", "Code", "Language", "Education",
		"Enabled", "Active", "VerificationStatus", "IsRemove", "IsOnBoarding",
		"RewardID", "PaymentMethodID", "TestimonialsID", "ChannelSettingTypeID",
	} {
		if v := c.Query(k); v != "" {
			exact[k] = v
		}
	}

	// --- sort ---
	sortBy := c.DefaultQuery("sortBy", "CreatedDate")
	sortDir := strings.ToLower(c.DefaultQuery("sortDir", "desc"))
	if sortDir != "asc" && sortDir != "desc" {
		sortDir = "desc"
	}

	// --- logic ---
	kols, total, err := Logic.GetKolLogic(pageIndex, pageSize, keyword, exact, sortBy, sortDir)
	if err != nil {
		vm.Result = Const.UnSuccess
		vm.ErrorMessage = err.Error()
		vm.PageIndex = int64(pageIndex)
		vm.PageSize = int64(pageSize)
		vm.TotalCount = 0
		vm.KOL = nil
		c.JSON(http.StatusInternalServerError, vm)
		return
	}

	// Nếu trước đó chưa có lỗi -> Success
	if vm.Result == "" {
		vm.Result = Const.Success
		vm.ErrorMessage = ""
	}
	vm.PageIndex = int64(pageIndex)
	vm.PageSize = int64(pageSize)
	vm.TotalCount = total
	vm.KOL = kols

	c.JSON(http.StatusOK, vm)
}
