package model

import "golang.org/x/crypto/bcrypt"

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

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
