package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/je-von/TPA-Web-JV/backend/graph/generated"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
	"github.com/je-von/TPA-Web-JV/backend/service"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *cartResolver) User(ctx context.Context, obj *model.Cart) (*model.User, error) {
	user := new(model.User)

	return user, r.DB.First(user, "id = ?", obj.UserID).Error
}

func (r *cartResolver) Product(ctx context.Context, obj *model.Cart) (*model.Product, error) {
	product := new(model.Product)

	return product, r.DB.First(product, "id = ?", obj.ProductID).Error
}

func (r *mutationResolver) CreateCart(ctx context.Context, productID string, quantity int, notes string) (*model.Cart, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustom).ID

	cart, _ := service.CartGetByUserProduct(ctx, userID, productID)

	if cart != nil {
		cart.Quantity += quantity
		cart.Notes = notes

		return cart, r.DB.Save(cart).Error
	}
	return service.CartCreate(ctx, userID, productID, quantity, notes)
}

func (r *mutationResolver) UpdateCart(ctx context.Context, productID string, quantity int, notes string) (*model.Cart, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustom).ID

	cart, _ := service.CartGetByUserProduct(ctx, userID, productID)

	if cart == nil {
		return nil, &gqlerror.Error{
			Message: "Error, cart gaada",
		}
	}
	if quantity > 0 {
		cart.Quantity = quantity
		// cart.Notes = notes

		return cart, r.DB.Save(cart).Error
	}
	return cart, r.DB.Delete(cart).Error
}

func (r *mutationResolver) DeleteCart(ctx context.Context, productID string) (bool, error) {
	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustom).ID

	model := new(model.Cart)
	if err := r.DB.First(model, "user_id = ? AND product_id = ?", userID, productID).Error; err != nil {
		return false, err
	}

	return true, r.DB.Delete(model).Error
}

func (r *queryResolver) Cart(ctx context.Context, productID string) (*model.Cart, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Carts(ctx context.Context) ([]*model.Cart, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustom).ID

	var models []*model.Cart
	return models, r.DB.Where("user_id = ?", id).Find(&models).Error
}

// Cart returns generated.CartResolver implementation.
func (r *Resolver) Cart() generated.CartResolver { return &cartResolver{r} }

type cartResolver struct{ *Resolver }
