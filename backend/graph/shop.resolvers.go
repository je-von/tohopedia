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

func (r *mutationResolver) CreateShop(ctx context.Context, input model.NewShop) (*model.Shop, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustom).ID

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
		NameSlug:          input.NameSlug,
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

func (r *mutationResolver) UpdateShop(ctx context.Context, input model.NewShop) (*model.Shop, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustom).ID

	shop, _ := service.ShopGetByUserID(ctx, userID)

	if shop == nil {
		return nil, &gqlerror.Error{
			Message: "Error, shop gaada",
		}
	}
	shop.Name = input.Name
	shop.NameSlug = input.NameSlug
	shop.Slogan = input.Slogan
	shop.Description = input.Description
	shop.OpenTime = input.OpenTime
	shop.CloseTime = input.CloseTime
	shop.OperationalStatus = input.OperationalStatus
	shop.ProfilePic = input.ProfilePic

	return shop, r.DB.Save(shop).Error
}

func (r *queryResolver) Shop(ctx context.Context, id *string, keyword *string) (*model.Shop, error) {
	shop := new(model.Shop)

	if keyword != nil {
		// return shop, r.DB.FirstOrInit(shop, "(name LIKE ? OR description LIKE ?)", "%"+*keyword+"%", "%"+*keyword+"%").Error
		return shop, r.DB.First(shop, "(name LIKE ? OR description LIKE ?)", "%"+*keyword+"%", "%"+*keyword+"%").Error
	}

	return shop, r.DB.First(shop, "id = ?", *id).Error
}

func (r *queryResolver) Shops(ctx context.Context) ([]*model.Shop, error) {
	var models []*model.Shop
	return models, r.DB.Find(&models).Error
}

func (r *queryResolver) ShopBySlug(ctx context.Context, nameSlug string) (*model.Shop, error) {
	shop := new(model.Shop)
	return shop, r.DB.First(shop, "name_slug = ?", nameSlug).Error
}

func (r *shopResolver) User(ctx context.Context, obj *model.Shop) (*model.User, error) {
	user := new(model.User)

	return user, r.DB.First(user, "id = ?", obj.UserID).Error
}

func (r *shopResolver) Products(ctx context.Context, obj *model.Shop, keyword *string, topSold *bool) ([]*model.Product, error) {
	var models []*model.Product
	if topSold != nil && *topSold {
		return models, r.DB.Raw("SELECT p.id, name, description, price, discount, metadata, category_id, shop_id, created_at, stock, original_product_id, valid_to FROM transaction_details td JOIN products p ON p.id = td.product_id WHERE shop_id = ? GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 10", obj.ID).Scan(&models).Error
	}

	temp := r.DB.Where("shop_id = ?", obj.ID).Where("(valid_to IS NULL OR valid_to = '0')")
	if keyword != nil {
		temp = temp.Where("(name LIKE ? OR description LIKE ?)", "%"+*keyword+"%", "%"+*keyword+"%").Limit(3)
	}

	return models, temp.Find(&models).Error
}

// Shop returns generated.ShopResolver implementation.
func (r *Resolver) Shop() generated.ShopResolver { return &shopResolver{r} }

type shopResolver struct{ *Resolver }
