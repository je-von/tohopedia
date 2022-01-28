package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/je-von/TPA-Web-JV/backend/graph/generated"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
)

func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	password, err := model.HashPassword(input.Password)

	if err != nil {
		return nil, err
	}

	model := &model.User{
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

	err = r.DB.Create(model).Error
	return model, err
}

func (r *mutationResolver) UpdateUser(ctx context.Context, id string, input model.NewUser) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) ToggleSuspend(ctx context.Context, id string) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) User(ctx context.Context, id *string, email *string, password *string) (*model.User, error) {
	user := new(model.User)

	if id != nil {
		return user, r.DB.First(user, "id = ?", id).Error
	}

	err := r.DB.First(user, "email = ?", email).Error

	if model.CheckPasswordHash(*password, user.Password) {
		return user, err
	}

	return nil, err
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	var models []*model.User
	return models, r.DB.Find(&models).Error
}

func (r *userResolver) IsSuspended(ctx context.Context, obj *model.User) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type userResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *mutationResolver) ToggleStatus(ctx context.Context, id string) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}
