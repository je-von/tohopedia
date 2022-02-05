package model

type Address struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Detail    string `json:"detail"`
	IsPrimary bool   `json:"isPrimary"`
	UserID    string `json:"userID" gorm:"size:191"`
	User      *User  `json:"user"`
}
