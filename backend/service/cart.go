package service

import (
	"context"

	"github.com/je-von/TPA-Web-JV/backend/config"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
)

func CartCreate(ctx context.Context, userID string, productID string, quantity int, notes string) (*model.Cart, error) {
	db := config.GetDB()

	cart := &model.Cart{
		UserID:    userID,
		ProductID: productID,
		Quantity:  quantity,
		Notes:     notes,
	}

	if err := db.Model(cart).Create(&cart).Error; err != nil {
		return nil, err
	}

	return cart, nil
}

func CartGetByUserProduct(ctx context.Context, userID string, productID string) (*model.Cart, error) {
	db := config.GetDB()

	var cart model.Cart
	if err := db.Model(cart).Where("user_id = ? AND product_id = ?", userID, productID).Take(&cart).Error; err != nil {
		return nil, err
	}

	return &cart, nil
}
