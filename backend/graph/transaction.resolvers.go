package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/je-von/TPA-Web-JV/backend/graph/generated"
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
		if err := r.DB.First(product, "original_product_id = ? AND (valid_to IS NULL OR valid_to = '0')", c.ProductID).Error; err != nil {
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

func (r *queryResolver) TransactionHeaders(ctx context.Context) ([]*model.TransactionHeader, error) {
	var models []*model.TransactionHeader
	return models, r.DB.Find(&models).Error
}

func (r *transactionDetailResolver) TransactionHeader(ctx context.Context, obj *model.TransactionDetail) (*model.TransactionHeader, error) {
	transactionHeader := new(model.TransactionHeader)

	return transactionHeader, r.DB.First(transactionHeader, "id = ?", obj.TransactionHeaderID).Error
}

func (r *transactionDetailResolver) Product(ctx context.Context, obj *model.TransactionDetail) (*model.Product, error) {
	transactionHeader := new(model.TransactionHeader)

	err := r.DB.First(transactionHeader, "id = ?", obj.TransactionHeaderID).Error
	if err != nil {
		return nil, &gqlerror.Error{
			Message: "Error, header gak ada",
		}
	}

	product := new(model.Product)

	return product, r.DB.FirstOrInit(product, "original_product_id = ? AND (created_at <= ? AND (valid_to >= ? OR valid_to IS NULL OR valid_to = '0'))", obj.ProductID, transactionHeader.TransactionDate, transactionHeader.TransactionDate).Error
}

func (r *transactionHeaderResolver) User(ctx context.Context, obj *model.TransactionHeader) (*model.User, error) {
	user := new(model.User)

	return user, r.DB.First(user, "id = ?", obj.UserID).Error
}

func (r *transactionHeaderResolver) Shipping(ctx context.Context, obj *model.TransactionHeader) (*model.Shipping, error) {
	shipping := new(model.Shipping)

	return shipping, r.DB.First(shipping, "id = ?", obj.ShippingID).Error
}

func (r *transactionHeaderResolver) PaymentType(ctx context.Context, obj *model.TransactionHeader) (*model.PaymentType, error) {
	paymentType := new(model.PaymentType)

	return paymentType, r.DB.First(paymentType, "id = ?", obj.PaymentTypeID).Error
}

func (r *transactionHeaderResolver) Address(ctx context.Context, obj *model.TransactionHeader) (*model.Address, error) {
	address := new(model.Address)

	return address, r.DB.First(address, "id = ?", obj.AddressID).Error
}

func (r *transactionHeaderResolver) TransactionDetails(ctx context.Context, obj *model.TransactionHeader) ([]*model.TransactionDetail, error) {
	var models []*model.TransactionDetail
	return models, r.DB.Where("transaction_header_id = ?", obj.ID).Find(&models).Error
}

// TransactionDetail returns generated.TransactionDetailResolver implementation.
func (r *Resolver) TransactionDetail() generated.TransactionDetailResolver {
	return &transactionDetailResolver{r}
}

// TransactionHeader returns generated.TransactionHeaderResolver implementation.
func (r *Resolver) TransactionHeader() generated.TransactionHeaderResolver {
	return &transactionHeaderResolver{r}
}

type transactionDetailResolver struct{ *Resolver }
type transactionHeaderResolver struct{ *Resolver }
