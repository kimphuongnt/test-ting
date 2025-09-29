package main

import (
	"log"
	"wan-api-kol-event/Controllers"
	"wan-api-kol-event/Initializers"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "wan-api-kol-event/docs" // <— path này PHẢI khớp module trong go.mod

	_ "github.com/swaggo/files"
	_ "github.com/swaggo/gin-swagger"
)

func init() {
	Initializers.LoadEnvironmentVariables()
	Initializers.ConnectToDB()
}

func main() {
	r := gin.Default()
	Initializers.SetupCors(r)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	// Define your Gin routes here
	r.GET("/kols", Controllers.GetKolsController)

	// Run Gin server
	if err := r.Run(":8081"); err != nil {
		log.Println("Failed to start server")
	}
}
