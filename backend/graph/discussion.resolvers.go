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

func (r *discussionResolver) User(ctx context.Context, obj *model.Discussion) (*model.User, error) {
	user := new(model.User)
	return user, r.DB.First(user, "id = ?", obj.UserID).Error
}

func (r *discussionResolver) Product(ctx context.Context, obj *model.Discussion) (*model.Product, error) {
	product := new(model.Product)
	return product, r.DB.First(product, "id = ?", obj.ProductID).Error
}

func (r *mutationResolver) CreateDiscussion(ctx context.Context, productID string, content string) (*model.Discussion, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustom).ID

	model := &model.Discussion{
		ID:        uuid.NewString(),
		CreatedAt: time.Now(),
		UserID:    userID,
		ProductID: productID,
		Content:   content,
	}

	return model, r.DB.Create(model).Error
}

// Discussion returns generated.DiscussionResolver implementation.
func (r *Resolver) Discussion() generated.DiscussionResolver { return &discussionResolver{r} }

type discussionResolver struct{ *Resolver }
