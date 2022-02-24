package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
	"github.com/je-von/TPA-Web-JV/backend/service"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *mutationResolver) Checkout(ctx context.Context, shippingID string, paymentTypeID string, addressID string) (*model.TransactionHeader, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustom).ID

	var carts []*model.Cart
	err := r.DB.Where("user_id = ?", userID).Find(&carts).Error
	if err != nil || carts == nil {
		return nil, &gqlerror.Error{
			Message: "Error, cart gaada",
		}
	}

	header := &model.TransactionHeader{
		ID:              uuid.NewString(),
		TransactionDate: time.Now(),
		UserID:          userID,
		ShippingID:      shippingID,
		PaymentTypeID:   paymentTypeID,
		Status:          "Success",
		AddressID:       addressID,
	}

	err = r.DB.Create(header).Error

	if err != nil {
		return header, &gqlerror.Error{
			Message: "Error, create header",
		}
	}

	for _, c := range carts {
		detail := &model.TransactionDetail{
			TransactionHeaderID: header.ID,
			ProductID:           c.ProductID,
			Quantity:            c.Quantity,
			Notes:               c.Notes,
		}

		product := new(model.Product)
		if err := r.DB.First(product, "id = ?", c.ProductID).Error; err != nil {
			return nil, err
		}
		product.Stock -= c.Quantity

		if err := r.DB.Save(product).Error; err != nil {
			return nil, err
		}
		err = r.DB.Create(detail).Error
		if err != nil {
			return header, &gqlerror.Error{
				Message: "Error, create detail",
			}
		}

		err = r.DB.Delete(c).Error
		if err != nil {
			return header, &gqlerror.Error{
				Message: "Error, delete cart",
			}
		}
	}

	return header, nil
}

func (r *queryResolver) Shipping(ctx context.Context, id string) (*model.Shipping, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Shippings(ctx context.Context) ([]*model.Shipping, error) {
	var models []*model.Shipping
	return models, r.DB.Find(&models).Error
}

func (r *queryResolver) PaymentType(ctx context.Context, id string) (*model.PaymentType, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) PaymentTypes(ctx context.Context) ([]*model.PaymentType, error) {
	var models []*model.PaymentType
	return models, r.DB.Find(&models).Error
}
