package service

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type JwtCustom struct {
	ID string `json:"id"`
	jwt.StandardClaims
}

var jwtSecret = []byte(getJwtSecret())

func getJwtSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "jevon_tohopedia_secret"
	}
	return secret
}

func JwtGenerate(ctx context.Context, userID string) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, &JwtCustom{
		ID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 72).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	})

	token, err := t.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return token, nil
}

func JwtValidate(ctx context.Context, token string) (*jwt.Token, error) {
	return jwt.ParseWithClaims(token, &JwtCustom{}, func(t *jwt.Token) (interface{}, error) {
		if _, success := t.Method.(*jwt.SigningMethodHMAC); !success {
			return nil, fmt.Errorf("jwt token ngaco")
		}
		return jwtSecret, nil
	})
}
