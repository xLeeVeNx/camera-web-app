PORT?=3000
TAG?=camera-web-app

build:
	DOCKER_BUILDKIT=1 docker build --build-arg PORT=$(PORT) -t $(TAG) .

up: build
	docker run -d -p $(PORT):$(PORT) --env PORT=$(PORT) --name $(TAG)-container $(TAG)

stop:
	docker stop $(TAG)-container

