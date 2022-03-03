package model

import "time"

type Review struct {
	ID          string         `json:"id"`
	UserID      string         `json:"userID" gorm:"size:191"`
	User        *User          `json:"user"`
	ProductID   string         `json:"productID" gorm:"size:191"`
	Product     *Product       `json:"product"`
	CreatedAt   time.Time      `json:"createdAt"`
	Rating      int            `json:"rating"`
	Description string         `json:"description"`
	Images      []*ReviewImage `json:"images"`
	IsAnonymous bool           `json:"isAnonymous"`
}

type ReviewImage struct {
	ID       string  `json:"id"`
	Image    string  `json:"image"`
	ReviewID string  `json:"reviewID" gorm:"size:191"`
	Review   *Review `json:"review"`
}
