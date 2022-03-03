package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/je-von/TPA-Web-JV/backend/graph/generated"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
	"github.com/je-von/TPA-Web-JV/backend/service"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *mutationResolver) CreateReview(ctx context.Context, productID string, rating int, description string, isAnonymous bool) (*model.Review, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustom).ID

	model := &model.Review{
		ID:          uuid.NewString(),
		CreatedAt:   time.Now(),
		UserID:      userID,
		ProductID:   productID,
		Rating:      rating,
		Description: description,
		IsAnonymous: isAnonymous,
	}

	return model, r.DB.Create(model).Error
}

func (r *mutationResolver) CreateReviewImages(ctx context.Context, images []string, reviewID string) (bool, error) {
	for _, img := range images {
		model := &model.ReviewImage{
			ID:       uuid.NewString(),
			Image:    img,
			ReviewID: reviewID,
		}
		err := r.DB.Create(model).Error

		if err != nil {
			return false, err
		}
	}
	return true, nil
}

func (r *queryResolver) Reviews(ctx context.Context, productID string) ([]*model.Review, error) {
	var models []*model.Review
	return models, r.DB.Where("product_id = ?", productID).Find(&models).Error
}

func (r *reviewResolver) User(ctx context.Context, obj *model.Review) (*model.User, error) {
	user := new(model.User)
	return user, r.DB.First(user, "id = ?", obj.UserID).Error
}

func (r *reviewResolver) Product(ctx context.Context, obj *model.Review) (*model.Product, error) {
	product := new(model.Product)
	return product, r.DB.First(product, "id = ?", obj.ProductID).Error
}

func (r *reviewResolver) Images(ctx context.Context, obj *model.Review) ([]*model.ReviewImage, error) {
	var models []*model.ReviewImage
	return models, r.DB.Where("review_id = ?", obj.ID).Find(&models).Error
}

func (r *reviewImageResolver) Review(ctx context.Context, obj *model.ReviewImage) (*model.Review, error) {
	review := new(model.Review)
	return review, r.DB.First(review, "id = ?", obj.ReviewID).Error
}

// Review returns generated.ReviewResolver implementation.
func (r *Resolver) Review() generated.ReviewResolver { return &reviewResolver{r} }

// ReviewImage returns generated.ReviewImageResolver implementation.
func (r *Resolver) ReviewImage() generated.ReviewImageResolver { return &reviewImageResolver{r} }

type reviewResolver struct{ *Resolver }
type reviewImageResolver struct{ *Resolver }
