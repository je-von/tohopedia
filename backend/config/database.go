package config

import (
	"fmt"
	"io"
	"log"
	"net/url"
	"os"
	"strings"
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

	var temp gorm.Dialector

	if os.Getenv("DB_CONNECTION") == "mysql" {
		databaseConfig := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_DATABASE"),
		)
		temp = mysql.Open(databaseConfig)
	} else {

		databaseUrl, _ := url.Parse(os.Getenv("DATABASE_URL"))
		host := strings.Split(databaseUrl.Host, ":")[0]
		port := databaseUrl.Port()
		username := databaseUrl.User.Username()
		pass, _ := databaseUrl.User.Password()
		databaseName := strings.TrimLeft(databaseUrl.Path, "/")

		// databaseConfig := fmt.Sprintf("host=%s user=%s password=%s port=%s dbname=%s sslmode=require TimeZone=Asia/Shanghai", os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"))
		databaseConfig := fmt.Sprintf("host=%s user=%s password=%s port=%s dbname=%s sslmode=require TimeZone=Asia/Shanghai", host, username, pass, port, databaseName)
		temp = postgres.Open(databaseConfig)
	}

	db, err = gorm.Open(temp, &gorm.Config{
		Logger: newLogger,
		NamingStrategy: &schema.NamingStrategy{
			SingularTable: false,
			TablePrefix:   "",
		},
	})

	if err != nil {
		panic("Error Connect Database:" + err.Error())
	}
}
