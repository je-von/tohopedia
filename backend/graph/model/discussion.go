package model

import "time"

type Discussion struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userID" gorm:"size:191"`
	User      *User     `json:"user"`
	ProductID string    `json:"productID" gorm:"size:191"`
	Product   *Product  `json:"product"`
	CreatedAt time.Time `json:"createdAt"`
	Content   string    `json:"content"`
}
