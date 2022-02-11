package directives

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/je-von/TPA-Web-JV/backend/middlewares"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func Auth(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	tokenData := middlewares.CtxValue(ctx)
	if tokenData == nil {
		return nil, &gqlerror.Error{
			Message: "access denied, belom login",
		}
	}

	return next(ctx)
}
