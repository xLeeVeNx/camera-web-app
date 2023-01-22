PORT?=3000

build:
	DOCKER_BUILDKIT=1 docker build --build-arg PORT=$(PORT) -t camera-web-app .

up: build
	docker run -p $(PORT):$(PORT) --env PORT=$(PORT) camera-web-app

