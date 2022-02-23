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

func (r *categoryResolver) Products(ctx context.Context, obj *model.Category) ([]*model.Product, error) {
	var models []*model.Product
	return models, r.DB.Where("category_id = ?", obj.ID).Where("(original_product_id IS NULL OR original_product_id = id)").Find(&models).Error
}

func (r *mutationResolver) CreateProduct(ctx context.Context, input model.NewProduct, shopID string) (*model.Product, error) {
	id := uuid.NewString()
	model := &model.Product{
		ID:                id,
		OriginalProductID: id,
		Name:              input.Name,
		Description:       input.Description,
		Price:             input.Price,
		Discount:          input.Discount,
		Metadata:          input.Metadata,
		CategoryID:        input.CategoryID,
		ShopID:            shopID,
		Stock:             input.Stock,
		CreatedAt:         time.Now(),
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

func (r *mutationResolver) UpdateProduct(ctx context.Context, input model.NewProduct, productID string) (*model.Product, error) {
	product := new(model.Product)

	err := r.DB.First(product, "id = ?", productID).Error
	if err != nil {
		return nil, err
	}
	now := time.Now()

	// ! belom update yg udh updatean
	product.OriginalProductID = productID
	product.ValidTo = now

	err = r.DB.Save(product).Error
	if err != nil {
		return nil, err
	}

	model := &model.Product{
		ID:                uuid.NewString(),
		Name:              input.Name,
		OriginalProductID: productID,
		Description:       input.Description,
		Price:             input.Price,
		Discount:          input.Discount,
		Metadata:          "",
		CategoryID:        product.CategoryID,
		ShopID:            product.ShopID,
		Stock:             input.Stock,
		CreatedAt:         now,
	}

	return model, r.DB.Create(model).Error
}

func (r *productResolver) OriginalProduct(ctx context.Context, obj *model.Product) (*model.Product, error) {
	product := new(model.Product)

	return product, r.DB.FirstOrInit(product, "id = ?", obj.OriginalProductID).Error
}

func (r *productResolver) UpdatedProducts(ctx context.Context, obj *model.Product) ([]*model.Product, error) {
	var models []*model.Product
	return models, r.DB.Where("original_product_id = ?", obj.ID).Order("valid_to ASC").Find(&models).Error
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

func (r *queryResolver) Categories(ctx context.Context, limit *int) ([]*model.Category, error) {
	var models []*model.Category
	q := r.DB
	if limit != nil {
		q = q.Limit(*limit)
	}
	return models, q.Find(&models).Error
}

func (r *queryResolver) Product(ctx context.Context, id string) (*model.Product, error) {
	product := new(model.Product)

	return product, r.DB.First(product, "id = ?", id).Error
}

func (r *queryResolver) Products(ctx context.Context, shopID *string, limit *int, offset *int, input *model.SearchProduct) ([]*model.Product, error) {
	var models []*model.Product
	if shopID != nil && limit != nil && offset != nil {
		fmt.Printf("limit: %d\n", *limit)
		return models, r.DB.Where("shop_id = ?", shopID).Where("(original_product_id IS NULL OR original_product_id = id)").Limit(*limit).Offset(*offset).Find(&models).Error
	}

	// temp := r.DB.Where("valid_to IS NULL")
	temp := r.DB.Where("(original_product_id IS NULL OR original_product_id = id)")

	if input != nil {
		if input.IsDiscount != nil && *input.IsDiscount {
			temp = temp.Order("discount DESC").Limit(15)
		} else {

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
			if input.CategoryID != nil {
				temp = temp.Where("category_id = ?", *input.CategoryID)
			}
			if input.OrderBy != nil {
				if *input.OrderBy == "newest" {
					temp = temp.Order("created_at DESC")
				} else if *input.OrderBy == "highest-price" {
					temp = temp.Order("price DESC")
				} else if *input.OrderBy == "lowest-price" {
					temp = temp.Order("price ASC")
				}
			}
		}
	}

	if limit != nil {
		temp = temp.Limit(*limit)
	}

	if offset != nil {
		temp = temp.Offset(*offset)

	}

	return models, temp.Find(&models).Error
}

// Category returns generated.CategoryResolver implementation.
func (r *Resolver) Category() generated.CategoryResolver { return &categoryResolver{r} }

// Product returns generated.ProductResolver implementation.
func (r *Resolver) Product() generated.ProductResolver { return &productResolver{r} }

// ProductImage returns generated.ProductImageResolver implementation.
func (r *Resolver) ProductImage() generated.ProductImageResolver { return &productImageResolver{r} }

type categoryResolver struct{ *Resolver }
type productResolver struct{ *Resolver }
type productImageResolver struct{ *Resolver }
