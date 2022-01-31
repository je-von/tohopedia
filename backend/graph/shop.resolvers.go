package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/je-von/TPA-Web-JV/backend/graph/generated"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
	"github.com/je-von/TPA-Web-JV/backend/service"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *mutationResolver) CreateShop(ctx context.Context, input model.NewShop) (*model.Shop, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	shop, _ := service.ShopGetByUserID(ctx, userID)

	if shop != nil {
		return nil, &gqlerror.Error{
			Message: "Error, user already has shop",
		}
	}
	// if err != nil {
	// 	return nil, err
	// }

	model := &model.Shop{
		ID:                uuid.NewString(),
		Name:              input.Name,
		NameSlug:          input.Name,
		Address:           input.Address,
		ProfilePic:        input.ProfilePic,
		Slogan:            input.Slogan,
		Description:       input.Description,
		OpenTime:          input.OpenTime,
		CloseTime:         input.CloseTime,
		OperationalStatus: input.OperationalStatus,
		UserID:            userID,
	}

	return model, r.DB.Create(model).Error
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
