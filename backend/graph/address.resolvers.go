package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/google/uuid"
	"github.com/je-von/TPA-Web-JV/backend/graph/generated"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
	"github.com/je-von/TPA-Web-JV/backend/service"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *addressResolver) User(ctx context.Context, obj *model.Address) (*model.User, error) {
	user := new(model.User)

	return user, r.DB.First(user, "id = ?", obj.UserID).Error
}

func (r *mutationResolver) CreateAddress(ctx context.Context, name string, detail string, isPrimary bool) (*model.Address, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	model := &model.Address{
		ID:        uuid.NewString(),
		Name:      name,
		Detail:    detail,
		IsPrimary: isPrimary,
		UserID:    userID,
	}

	return model, r.DB.Create(model).Error
}

func (r *mutationResolver) TogglePrimary(ctx context.Context, id string) (*model.Address, error) {
	model := new(model.Address)
	if err := r.DB.First(model, "id = ?", id).Error; err != nil {
		return nil, err
	}

	model.IsPrimary = !model.IsPrimary

	return model, r.DB.Save(model).Error
}

func (r *queryResolver) Address(ctx context.Context, id string) (*model.Address, error) {
	address := new(model.Address)

	return address, r.DB.First(address, "id = ?", id).Error
}

func (r *queryResolver) Addresses(ctx context.Context) ([]*model.Address, error) {
	var models []*model.Address
	return models, r.DB.Order("is_primary DESC").Find(&models).Error
}

// Address returns generated.AddressResolver implementation.
func (r *Resolver) Address() generated.AddressResolver { return &addressResolver{r} }

type addressResolver struct{ *Resolver }
