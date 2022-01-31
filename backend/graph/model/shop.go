package model

import "time"

type Shop struct {
	ID                string     `json:"id"`
	Name              string     `json:"name"`
	NameSlug          string     `json:"nameSlug"`
	Address           string     `json:"address"`
	Slogan            string     `json:"slogan"`
	Description       string     `json:"description"`
	ProfilePic        string     `json:"profilePic"`
	OpenTime          time.Time  `json:"openTime"`
	CloseTime         time.Time  `json:"closeTime"`
	OperationalStatus string     `json:"operationalStatus"`
	ReputationPoints  int        `json:"reputationPoints"`
	UserID            string     `json:"userID" gorm:"size:191"`
	User              *User      `json:"user"`
	Products          []*Product `json:"products"`
}
