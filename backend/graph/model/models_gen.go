// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"time"
)

type AuthOps struct {
	Login    interface{} `json:"login"`
	Register interface{} `json:"register"`
}

type Category struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type NewProduct struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       int     `json:"price"`
	Discount    float64 `json:"discount"`
	Metadata    string  `json:"metadata"`
	Stock       int     `json:"stock"`
	CategoryID  string  `json:"categoryID"`
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
