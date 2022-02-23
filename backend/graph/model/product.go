package model

import "time"

type Product struct {
	ID                string   `json:"id"`
	OriginalProductID string   `json:"productID" gorm:"size:191"`
	OriginalProduct   *Product `json:"product"`
	// UpdatedProducts   []*Product      `json:"updatedProducts"`
	Name        string          `json:"name"`
	Images      []*ProductImage `json:"images"`
	Description string          `json:"description"`
	Price       int             `json:"price"`
	Discount    float64         `json:"discount"`
	Metadata    string          `json:"metadata"`
	Stock       int             `json:"stock"`
	CreatedAt   time.Time       `json:"createdAt"`
	ValidTo     time.Time       `json:"validTo"`
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
