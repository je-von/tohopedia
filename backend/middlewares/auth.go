package middlewares

import (
	"context"
	"fmt"

	"net/http"

	"github.com/je-von/TPA-Web-JV/backend/service"
)

type authString string

func AuthMiddleware(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")

		if auth == "" {
			next.ServeHTTP(w, r)
			return
		}

		bearer := "bearer "
		auth = auth[len(bearer):]

		// data, err := base64.StdEncoding.DecodeString(auth)
		// fmt.Println("data:" + string(data))
		validate, err := service.JwtValidate(context.Background(), auth)
		if err != nil || !validate.Valid {
			// if err != nil {
			fmt.Println("asd: " + err.Error())
			http.Error(w, "Invalid token", http.StatusForbidden)
			return
		}
		// fmt.Println(validate.Claims.(*service.JwtCustomClaim).ID)
		customClaim, _ := validate.Claims.(*service.JwtCustomClaim)

		// fmt.Println(authString("auth"))
		ctx := context.WithValue(r.Context(), "auth", customClaim)

		// fmt.Println(ctx.Value("auth"))

		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func CtxValue(ctx context.Context) *service.JwtCustomClaim {
	raw, _ := ctx.Value("auth").(*service.JwtCustomClaim)
	return raw
}
