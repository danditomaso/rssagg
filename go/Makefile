.DEFAULT_GOAL := build

dev:
	go run ./...
.PHONY:dev

fmt:
	go fmt ./...
.PHONY:fmt

lint: fmt
	go lint ./...
.PHONY:lint

vet: fmt
	go vet ./...
.PHONY:vet

build: vet
	go build main.go
.PHONY:build
