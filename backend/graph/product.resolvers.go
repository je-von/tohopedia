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

func (r *mutationResolver) UpdateProduct(ctx context.Context, input model.NewProduct, lastUpdateID *string) (*model.Product, error) {
	product := new(model.Product)
	now := time.Now()

	// if originalID != nil {
	// 	err := r.DB.First(product, "id = ?", *originalID).Error
	// 	if err != nil {
	// 		return nil, err
	// 	}

	// 	// product.OriginalProductID = *originalID
	// 	product.ValidTo = now

	// 	err = r.DB.Save(product).Error
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// }
	// } else {
	err := r.DB.First(product, "id = ?", *lastUpdateID).Error
	if err != nil {
		return nil, err
	}
	product.ValidTo = now

	err = r.DB.Save(product).Error
	if err != nil {
		return nil, err
	}

	originalID := &product.OriginalProductID
	// }

	model := &model.Product{
		ID:                uuid.NewString(),
		Name:              input.Name,
		OriginalProductID: *originalID,
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
	return models, r.DB.Where("original_product_id = ? AND id != ?", obj.ID, obj.ID).Order("valid_to ASC").Find(&models).Error
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

func (r *productResolver) TransactionDetails(ctx context.Context, obj *model.Product) ([]*model.TransactionDetail, error) {
	var models []*model.TransactionDetail
	return models, r.DB.Where("product_id = ?", obj.ID).Find(&models).Error
}

func (r *productResolver) Reviews(ctx context.Context, obj *model.Product) ([]*model.Review, error) {
	var models []*model.Review
	return models, r.DB.Where("product_id = ?", obj.ID).Order("created_at DESC").Find(&models).Error
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

	return product, r.DB.First(product, "original_product_id = ? AND (valid_to = 0 OR valid_to IS NULL)", id).Error
}

func (r *queryResolver) Products(ctx context.Context, shopID *string, limit *int, offset *int, input *model.SearchProduct, topSold *bool) ([]*model.Product, error) {
	var models []*model.Product
	if topSold != nil && *topSold {
		return models, r.DB.Raw("SELECT p.id, name, description, price, discount, metadata, category_id, shop_id, created_at, stock, original_product_id, valid_to FROM transaction_details td JOIN products p ON p.id = td.product_id  GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 15").Scan(&models).Error
	}

	if shopID != nil && limit != nil && offset != nil {
		fmt.Printf("limit: %d\n", *limit)
		return models, r.DB.Where("shop_id = ?", shopID).Where("(valid_to IS NULL OR valid_to = '0')").Limit(*limit).Offset(*offset).Find(&models).Error
	}

	// temp := r.DB.Where("valid_to IS NULL")
	temp := r.DB.Where("(valid_to IS NULL OR valid_to = '0')")

	if input != nil {
		if input.IsDiscount != nil && *input.IsDiscount {
			temp = temp.Order("discount DESC").Limit(15)
		} else {
			if input.HighRating != nil && *input.HighRating {
				temp = temp.Select("products.id, name, products.description, price, discount, metadata, category_id, shop_id, products.created_at, stock, original_product_id, valid_to").Joins("JOIN reviews ON products.id = reviews.product_id").Group("products.id").Having("AVG(reviews.rating) >= 4")
				// temp = temp.Raw("SELECT p.id, name, p.description, price, discount, metadata, category_id, shop_id, p.created_at, stock, original_product_id, valid_to FROM `products` p JOIN reviews r ON p.id = r.product_id GROUP BY p.id HAVING AVG(r.rating) >= 4")
			}
			if input.MinPrice != nil {
				temp = temp.Where("price >= ?", *input.MinPrice)
			}
			if input.MaxPrice != nil {
				temp = temp.Where("price <= ?", *input.MaxPrice)
			}
			if input.Keyword != nil {
				temp = temp.Where("(name LIKE ? OR products.description LIKE ?)", "%"+*input.Keyword+"%", "%"+*input.Keyword+"%")
				// temp = temp.Where("name LIKE ?", "%"+*input.Keyword+"%")

			}
			if input.CategoryID != nil {
				temp = temp.Where("category_id = ?", *input.CategoryID)
			}
			if input.OrderBy != nil {
				if *input.OrderBy == "newest" {
					temp = temp.Order("products.created_at DESC")
				} else if *input.OrderBy == "highest-price" {
					temp = temp.Order("price DESC")
				} else if *input.OrderBy == "lowest-price" {
					temp = temp.Order("price ASC")
				}
			}

			if input.CreatedAtRange != nil {
				temp = temp.Where("DATEDIFF(NOW(), products.created_at) <= ?", *input.CreatedAtRange)
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

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *productResolver) TransactionDetail(ctx context.Context, obj *model.Product) ([]*model.TransactionDetail, error) {
	panic(fmt.Errorf("not implemented"))
}
