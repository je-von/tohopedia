package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/je-von/TPA-Web-JV/backend/graph/model"
)

func (r *queryResolver) Shipping(ctx context.Context, id string) (*model.Shipping, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Shippings(ctx context.Context) ([]*model.Shipping, error) {
	var models []*model.Shipping
	return models, r.DB.Find(&models).Error
}

func (r *queryResolver) PaymentType(ctx context.Context, id string) (*model.PaymentType, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) PaymentTypes(ctx context.Context) ([]*model.PaymentType, error) {
	var models []*model.PaymentType
	return models, r.DB.Find(&models).Error
}
