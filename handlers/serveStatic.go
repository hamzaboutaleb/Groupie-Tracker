package handlers

import (
	"groupietracker/utils"
	"net/http"
)

func ServeStatic(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/static/" || r.URL.Path == "/static/css/" || r.URL.Path == "/static/images/" {
		utils.RenderError(w, http.StatusUnauthorized, "Page Unauthorized")
		return
	}
	fs := http.FileServer(http.Dir("./static"))
	http.StripPrefix("/static/", fs).ServeHTTP(w, r)
}


