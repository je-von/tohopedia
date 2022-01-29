package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/je-von/TPA-Web-JV/backend/graph/generated"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
)

func (r *mutationResolver) CreateShop(ctx context.Context, input model.NewShop, userID string) (*model.Shop, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) UpdateShop(ctx context.Context, id string, input model.NewShop) (*model.Shop, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Shop(ctx context.Context, id *string, userID *string) (*model.Shop, error) {
	shop := new(model.Shop)

	if id != nil {
		return shop, r.DB.First(shop, "id = ?", id).Error
	}

	return shop, r.DB.First(shop, "user_id = ?", userID).Error
}

func (r *queryResolver) Shops(ctx context.Context) ([]*model.Shop, error) {
	var models []*model.Shop
	return models, r.DB.Find(&models).Error
}

func (r *shopResolver) User(ctx context.Context, obj *model.Shop) (*model.User, error) {
	user := new(model.User)

	return user, r.DB.First(user, "id = ?", obj.UserID).Error
}

// Shop returns generated.ShopResolver implementation.
func (r *Resolver) Shop() generated.ShopResolver { return &shopResolver{r} }

type shopResolver struct{ *Resolver }
