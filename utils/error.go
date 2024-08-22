package utils

import (
	"fmt"
	"groupietracker/config"
	"net/http"
)

func NewError(errorCode int, errorMessage string) config.ErrorData {
	err := config.ErrorData{
		ErrorCode: errorCode,
		Message:   errorMessage,
	}
	return err
}

func RenderError(w http.ResponseWriter, errCode int, message string) {
	fmt.Println(errCode, message)
	w.WriteHeader(errCode)
	temp, _ := ParseTemplate("Error.html")
	err := temp.Execute(w, NewError(errCode, message))
	if err != nil {
		panic(err)
	}
}