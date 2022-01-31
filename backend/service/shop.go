package service

import (
	"context"

	"github.com/je-von/TPA-Web-JV/backend/config"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
)

func ShopGetByUserID(ctx context.Context, userID string) (*model.Shop, error) {
	db := config.GetDB()

	var shop model.Shop
	if err := db.Model(shop).Where("user_id = ?", userID).Take(&shop).Error; err != nil {
		return nil, err
	}

	return &shop, nil
}
