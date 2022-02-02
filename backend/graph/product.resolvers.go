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
)

func (r *mutationResolver) CreateProduct(ctx context.Context, input model.NewProduct, shopID string) (*model.Product, error) {
	model := &model.Product{
		ID:          uuid.NewString(),
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Discount:    input.Discount,
		Metadata:    input.Metadata,
		CategoryID:  input.CategoryID,
		ShopID:      shopID,
		Stock:       input.Stock,
		CreatedAt:   time.Now(),
	}

	return model, r.DB.Create(model).Error
}

func (r *mutationResolver) CreateProductImage(ctx context.Context, image string, productID string) (*model.ProductImage, error) {
	model := &model.ProductImage{
		ID:        uuid.NewString(),
		Image:     image,
		ProductID: productID,
	}

	return model, r.DB.Create(model).Error
}

func (r *mutationResolver) CreateProductImages(ctx context.Context, images []string, productID string) (bool, error) {
	for _, img := range images {
		model := &model.ProductImage{
			ID:        uuid.NewString(),
			Image:     img,
			ProductID: productID,
		}
		err := r.DB.Create(model).Error

		if err != nil {
			return false, err
		}
	}
	return true, nil
}

func (r *productResolver) Images(ctx context.Context, obj *model.Product) ([]*model.ProductImage, error) {
	var models []*model.ProductImage
	return models, r.DB.Where("product_id = ?", obj.ID).Find(&models).Error
}

func (r *productResolver) Category(ctx context.Context, obj *model.Product) (*model.Category, error) {
	category := new(model.Category)

	return category, r.DB.First(category, "id = ?", obj.CategoryID).Error
}

func (r *productResolver) Shop(ctx context.Context, obj *model.Product) (*model.Shop, error) {
	shop := new(model.Shop)

	return shop, r.DB.First(shop, "id = ?", obj.ShopID).Error
}

func (r *productImageResolver) Product(ctx context.Context, obj *model.ProductImage) (*model.Product, error) {
	product := new(model.Product)

	return product, r.DB.First(product, "id = ?", obj.ProductID).Error
}

func (r *queryResolver) Category(ctx context.Context, id string) (*model.Category, error) {
	category := new(model.Category)

	return category, r.DB.First(category, "id = ?", id).Error
}

func (r *queryResolver) Categories(ctx context.Context) ([]*model.Category, error) {
	var models []*model.Category
	return models, r.DB.Find(&models).Error
}

func (r *queryResolver) Product(ctx context.Context, id string) (*model.Product, error) {
	product := new(model.Product)

	return product, r.DB.First(product, "id = ?", id).Error
}

func (r *queryResolver) Products(ctx context.Context, shopID *string, limit *int, offset *int, input *model.SearchProduct) ([]*model.Product, error) {
	var models []*model.Product
	if shopID != nil && limit != nil && offset != nil {
		fmt.Printf("limit: %d\n", *limit)
		return models, r.DB.Where("shop_id = ?", shopID).Limit(*limit).Offset(*offset).Find(&models).Error
	}

	temp := r.DB
	if input != nil {
		if input.MinPrice != nil {
			temp = temp.Where("price >= ?", *input.MinPrice)
		}
		if input.MaxPrice != nil {
			temp = temp.Where("price <= ?", *input.MaxPrice)
		}
		if input.Keyword != nil {
			temp = temp.Where("(name LIKE ? OR description LIKE ?)", "%"+*input.Keyword+"%", "%"+*input.Keyword+"%")
			// temp = temp.Where("name LIKE ?", "%"+*input.Keyword+"%")

		}
	}

	return models, temp.Find(&models).Error
}

// Product returns generated.ProductResolver implementation.
func (r *Resolver) Product() generated.ProductResolver { return &productResolver{r} }

// ProductImage returns generated.ProductImageResolver implementation.
func (r *Resolver) ProductImage() generated.ProductImageResolver { return &productImageResolver{r} }

type productResolver struct{ *Resolver }
type productImageResolver struct{ *Resolver }
