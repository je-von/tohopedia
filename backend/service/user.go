package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/je-von/TPA-Web-JV/backend/config"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
)

func UserCreate(ctx context.Context, input model.NewUser) (*model.User, error) {
	db := config.GetDB()

	password, err := model.HashPassword(input.Password)

	if err != nil {
		return nil, err
	}

	user := &model.User{
		ID:          uuid.NewString(),
		Name:        input.Name,
		Email:       input.Email,
		Password:    password,
		Phone:       input.Phone,
		Gender:      input.Gender,
		Dob:         input.Dob,
		ProfilePic:  input.ProfilePic,
		Role:        input.Role,
		IsSuspended: false,
	}

	if err := db.Model(user).Create(&user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func UserGetByID(ctx context.Context, id string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("id = ?", id).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByEmail(ctx context.Context, email string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("email = ?", email).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
