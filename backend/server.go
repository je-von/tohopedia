package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/rs/cors"

	"github.com/go-chi/chi/v5"
	// "github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/je-von/TPA-Web-JV/backend/config"
	"github.com/je-von/TPA-Web-JV/backend/directives"
	"github.com/je-von/TPA-Web-JV/backend/graph"
	"github.com/je-von/TPA-Web-JV/backend/graph/generated"
	"github.com/je-von/TPA-Web-JV/backend/graph/model"
	"github.com/je-von/TPA-Web-JV/backend/middlewares"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedHeaders:   []string{"*"},
		AllowedOrigins:   []string{"https://toped.vercel.app", "http://localhost:3000", "http://localhost:8080"},
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowCredentials: true,
		Debug:            true,
	}).Handler, middlewares.AuthMiddleware)

	// router.Use(middlewares.AuthMiddleware)

	// var temp gorm.Dialector
	db := config.GetDB()

	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.Shop{})
	db.AutoMigrate(&model.Category{})
	db.AutoMigrate(&model.Product{})
	db.AutoMigrate(&model.ProductImage{})
	db.AutoMigrate(&model.Cart{})
	db.AutoMigrate(&model.Wishlist{})

	db.AutoMigrate(&model.Address{})
	db.AutoMigrate(&model.PaymentType{})
	db.AutoMigrate(&model.Shipping{})
	db.AutoMigrate(&model.TransactionHeader{})
	db.AutoMigrate(&model.TransactionDetail{})

	db.AutoMigrate(&model.Review{})
	db.AutoMigrate(&model.ReviewImage{})

	db.AutoMigrate(&model.Discussion{})

	c := generated.Config{
		Resolvers: &graph.Resolver{
			DB: db,
		},
	}
	c.Directives.Auth = directives.Auth
	srv := handler.NewDefaultServer(
		generated.NewExecutableSchema(c),
	)
	srv.AddTransport(&transport.Websocket{
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return r.Host == "http://localhost:3000"
			},
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
	})

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	err := http.ListenAndServe(":"+port, router)
	if err != nil {
		panic(err)
	}
}
