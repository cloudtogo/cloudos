package main

import (
	"fmt"
	"internal-tools-server/api"
	"internal-tools-server/models"
	"internal-tools-server/storage"
	"internal-tools-server/url"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/spf13/viper"
)

const baseURL = "/api"
const apiVersion = "/v1"

func main() {

	// Read all configurations
	parseConfig()

	// Initialize the database
	initializeDatastore()

	// Run any migrations on the datastore
	runMigrations()

	router := intializeServer()

	host := viper.GetString("server.host")
	port := viper.GetString("server.port")
	log.Fatal(http.ListenAndServe(host+":"+port, router))
}

func intializeServer() *httprouter.Router {
	router := httprouter.New()

	// Account CRUD Endpoints

	// Component CRUD Endpoints
	router.GET(baseURL+apiVersion+url.ComponentURL, api.GetComponents)
	router.POST(baseURL+apiVersion+url.ComponentURL, api.CreateComponents)
	router.PUT(baseURL+apiVersion+url.ComponentURL, api.UpdateComponent)

	// Page CRUD Endpoints

	// Query CRUD Endpoints

	return router
}

func initializeDatastore() {
	var err error
	dialect := viper.GetString("datastore.dialect")
	storage.StorageEngine, err = storage.CreateDatastore(dialect)
	if err != nil {
		panic(fmt.Errorf("Exception while creating datastore"))
	}
}

func parseConfig() {
	viper.AddConfigPath(".")

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal error while reading config file: %s", err))
	}
}

func runMigrations() {
	storage.StorageEngine.GetDatastore().AutoMigrate(
		&models.Component{},
		&models.Account{},
		&models.User{},
		&models.Role{},
		&models.Page{},
	)
	log.Println("Successfully run all migrations")
}
