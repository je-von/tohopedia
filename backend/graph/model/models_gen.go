// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

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

type User struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Phone      string `json:"phone"`
	Gender     string `json:"gender"`
	Dob        string `json:"dob"`
	ProfilePic string `json:"profilePic"`
	Role       string `json:"role"`
	Status     bool   `json:"status"`
}
