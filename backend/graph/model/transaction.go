package model

import "time"

type TransactionHeader struct {
	ID              string       `json:"id"`
	TransactionDate time.Time    `json:"transactionDate"`
	UserID          string       `json:"userID" gorm:"size:191"`
	User            *User        `json:"user"`
	ShippingID      string       `json:"shippingID" gorm:"size:191"`
	Shipping        *Shipping    `json:"shipping"`
	PaymentTypeID   string       `json:"paymentTypeID" gorm:"size:191"`
	PaymentType     *PaymentType `json:"paymentType"`
	Status          string       `json:"status"`
	AddressID       string       `json:"addressID" gorm:"size:191"`
	Address         *Address     `json:"address"`
}

type TransactionDetail struct {
	TransactionHeaderID string             `json:"transactionHeaderID" gorm:"size:191;primaryKey"`
	TransactionHeader   *TransactionHeader `json:"transactionHeader"`
	ProductID           string             `json:"productID" gorm:"size:191;primaryKey"`
	Product             *Product           `json:"product"`
	Quantity            int                `json:"quantity"`
	Notes               string             `json:"notes"`
}
