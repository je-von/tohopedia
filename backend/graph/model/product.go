package model

type Product struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Images      []*ProductImage `json:"images"`
	Description string          `json:"description"`
	Price       int             `json:"price"`
	Discount    float64         `json:"discount"`
	Metadata    string          `json:"metadata"`
	CategoryID  string          `json:"categoryID" gorm:"size:191"`
	Category    *Category       `json:"category"`
	ShopID      string          `json:"shopID" gorm:"size:191"`
	Shop        *Shop           `json:"shop"`
}

type ProductImage struct {
	ID        string   `json:"id"`
	Image     string   `json:"image"`
	ProductID string   `json:"productID" gorm:"size:191"`
	Product   *Product `json:"product"`
}
