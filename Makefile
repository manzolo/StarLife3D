# StarLife 3D — Makefile
# Local development & preview via Docker (plus handy local npm targets).

IMAGE      ?= starlife3d
DEV_IMAGE  ?= starlife3d-dev
PORT       ?= 8080
DEV_PORT   ?= 5173

.DEFAULT_GOAL := help

## ---------------------------------------------------------------------------
## Docker (recommended for local testing)
## ---------------------------------------------------------------------------

.PHONY: build
build: ## Build the production Docker image (nginx)
	docker build -t $(IMAGE) .

.PHONY: run
run: build ## Build & serve the production image at http://localhost:$(PORT)
	docker run --rm -p $(PORT):80 --name $(IMAGE) $(IMAGE)

.PHONY: up
up: build ## Serve production image in the background
	docker run -d --rm -p $(PORT):80 --name $(IMAGE) $(IMAGE)
	@echo "▶ StarLife 3D on http://localhost:$(PORT)"

.PHONY: down
down: ## Stop the background production container
	-docker stop $(IMAGE)

.PHONY: dev
dev: ## Hot-reload dev server in Docker at http://localhost:$(DEV_PORT)
	docker build -f Dockerfile.dev -t $(DEV_IMAGE) .
	docker run --rm -it -p $(DEV_PORT):5173 \
		-v $(PWD)/src:/app/src \
		-v $(PWD)/index.html:/app/index.html \
		-v $(PWD)/public:/app/public \
		--name $(DEV_IMAGE) $(DEV_IMAGE)

.PHONY: logs
logs: ## Follow logs of the background container
	docker logs -f $(IMAGE)

## ---------------------------------------------------------------------------
## Local (no Docker)
## ---------------------------------------------------------------------------

.PHONY: install
install: ## Install npm dependencies locally
	npm install

.PHONY: local-dev
local-dev: ## Run the Vite dev server locally
	npm run dev

.PHONY: local-build
local-build: ## Build locally into dist/
	npm run build

.PHONY: preview
preview: ## Build & preview the production bundle locally
	npm run build && npm run preview

## ---------------------------------------------------------------------------
## Housekeeping
## ---------------------------------------------------------------------------

.PHONY: clean
clean: ## Remove build output and Docker images
	rm -rf dist node_modules/.vite
	-docker rmi $(IMAGE) $(DEV_IMAGE) 2>/dev/null || true

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'
