// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"time"
)

type Category struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type NewShop struct {
	Name              string    `json:"name"`
	NameSlug          string    `json:"nameSlug"`
	Address           string    `json:"address"`
	Slogan            string    `json:"slogan"`
	Description       string    `json:"description"`
	ProfilePic        string    `json:"profilePic"`
	OpenTime          time.Time `json:"openTime"`
	CloseTime         time.Time `json:"closeTime"`
	OperationalStatus string    `json:"operationalStatus"`
}

type NewUser struct {
	Name       string `json:"name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Phone      string `json:"phone"`
	Gender     string `json:"gender"`
	Dob        string `json:"dob"`
	ProfilePic string `json:"profilePic"`
	Role       string `json:"role"`
}
