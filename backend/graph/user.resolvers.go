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

func (r *authOpsResolver) Login(ctx context.Context, obj *model.AuthOps, email string, password string) (interface{}, error) {
	return service.UserLogin(ctx, email, password)
}

func (r *authOpsResolver) Register(ctx context.Context, obj *model.AuthOps, input model.NewUser) (interface{}, error) {
	return service.UserRegister(ctx, input)
}

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

func (r *mutationResolver) UpdateUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustom).ID

	user, _ := service.UserGetByID(ctx, userID)

	if user == nil {
		return nil, &gqlerror.Error{
			Message: "Error, user gaada",
		}
	}
	user.Name = input.Name
	user.Email = input.Email
	user.Dob = input.Dob
	user.Gender = input.Gender
	user.Phone = input.Phone
	user.ProfilePic = input.ProfilePic

	return user, r.DB.Save(user).Error
}

func (r *mutationResolver) ToggleSuspend(ctx context.Context, id string) (*model.User, error) {
	user, _ := service.UserGetByID(ctx, id)

	if user == nil {
		return nil, &gqlerror.Error{
			Message: "Error, user gaada",
		}
	}

	user.IsSuspended = !user.IsSuspended

	return user, r.DB.Save(user).Error
}

func (r *mutationResolver) Login(ctx context.Context, email string, password string) (*model.User, error) {
	user := new(model.User)
	err := r.DB.First(user, "email = ?", email).Error
	if err != nil {
		return nil, err
	}

	if model.CheckPasswordHash(password, user.Password) {
		return user, err
	}

	return nil, nil
}

func (r *mutationResolver) Auth(ctx context.Context) (*model.AuthOps, error) {
	return &model.AuthOps{}, nil
}

func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	// user := new(model.User)

	// if id != nil {
	// return user, r.DB.First(user, "id = ?", id).Error
	// }

	// 	err := r.DB.First(user, "email = ?", email).Error

	// 	if model.CheckPasswordHash(*password, user.Password) {
	// 		return user, err
	// 	}

	// 	return nil, err

	return service.UserGetByID(ctx, id)
}

func (r *queryResolver) Users(ctx context.Context, limit *int, offset *int) ([]*model.User, error) {
	var models []*model.User
	query := r.DB.Where("role != 'Admin'")
	if limit != nil && offset != nil {
		query = query.Limit(*limit).Offset(*offset).Find(&models)
	}
	return models, query.Find(&models).Error
}

func (r *queryResolver) GetCurrentUser(ctx context.Context) (*model.User, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustom).ID

	return service.UserGetByID(ctx, id)
}

func (r *queryResolver) Protected(ctx context.Context) (string, error) {
	// fmt.Println(ctx.Value("auth").(*service.JwtCustomClaim).ID)
	return "Success", nil
}

func (r *userResolver) Shop(ctx context.Context, obj *model.User) (*model.Shop, error) {
	shop := new(model.Shop)

	return shop, r.DB.FirstOrInit(shop, "user_id = ?", obj.ID).Error
}

func (r *userResolver) Carts(ctx context.Context, obj *model.User) ([]*model.Cart, error) {
	var models []*model.Cart
	return models, r.DB.Where("user_id = ?", obj.ID).Find(&models).Error
}

func (r *userResolver) Addresses(ctx context.Context, obj *model.User) ([]*model.Address, error) {
	var models []*model.Address
	return models, r.DB.Where("user_id = ?", obj.ID).Order("is_primary DESC").Find(&models).Error
}

func (r *userResolver) TransactionHeaders(ctx context.Context, obj *model.User, id *string, limit *int, offset *int) ([]*model.TransactionHeader, error) {
	var models []*model.TransactionHeader
	query := r.DB
	if limit != nil && offset != nil {
		query = query.Where("user_id = ?", obj.ID).Limit(*limit).Offset(*offset)
	}

	if id != nil {
		fmt.Printf("id: %s\n", *id)
		query = query.Where("user_id = ? AND id = ?", obj.ID, *id).Limit(1)
	} else {
		query = query.Where("user_id = ?", obj.ID)
	}

	return models, query.Order("transaction_date DESC").Find(&models).Error
}

// AuthOps returns generated.AuthOpsResolver implementation.
func (r *Resolver) AuthOps() generated.AuthOpsResolver { return &authOpsResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type authOpsResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
