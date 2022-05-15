package config

import (
	"fmt"
	"io"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var (
	db *gorm.DB
)

func GetDB() *gorm.DB {
	return db
}

func init() {
	godotenv.Load()
	// databaseConfig := "root:@tcp(127.0.0.1:3306)/tohopedia-jv?charset=utf8mb4&parseTime=True&loc=Local"

	var err error

	f, _ := os.Create("gorm.log")
	newLogger := logger.New(log.New(io.MultiWriter(f), "\r\n", log.LstdFlags), logger.Config{
		Colorful:      true,
		LogLevel:      logger.Info,
		SlowThreshold: time.Second,
	})

	if os.Getenv("DB_CONNECTION") == "mysql" {
		databaseConfig := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_DATABASE"),
		)
		db, err = gorm.Open(mysql.Open(databaseConfig), &gorm.Config{
			Logger: newLogger,
			NamingStrategy: &schema.NamingStrategy{
				SingularTable: false,
				TablePrefix:   "",
			},
		})
	} else {
		databaseConfig := fmt.Sprintf("host=%s user=%s password=%s port=%s dbname=%s sslmode=require TimeZone=Asia/Shanghai", os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"))
		db, err = gorm.Open(postgres.Open(databaseConfig), &gorm.Config{
			Logger: newLogger,
			NamingStrategy: &schema.NamingStrategy{
				SingularTable: false,
				TablePrefix:   "",
			},
		})
	}

	if err != nil {
		panic("Error Connect Database:" + err.Error())
	}
}
