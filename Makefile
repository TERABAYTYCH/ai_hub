# Load environment variables from .env file
-include .env

# Derived project name (fallback to ject_hub if not set)
NAME := $(or $(COMPOSE_PROJECT_NAME),ject_hub)

## HELP
help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*## ' Makefile | \
		sed -e 's/^\([a-zA-Z_-]*\):.*## \(.*\)/  \x1b[36m\1\x1b[0m  \2/' | \
		column -t -s $$'\t'

## DOCKER COMMANDS
docker-up: ## Start all Docker containers in detached mode
	docker compose up -d

docker-down: ## Stop and remove all Docker containers
	docker compose down

docker-logs: ## Show logs from all Docker containers
	docker compose logs -f

docker-ps: ## Show running Docker containers
	docker compose ps

docker-build: ## Build Docker images
	docker compose build

docker-clean: ## Remove all containers, volumes, and networks
	docker compose down -v --remove-orphans

## TURBOREPO COMMANDS
build-all: ## Build all services via Turborepo
	yarn build

lint-all: ## Lint all services via Turborepo
	yarn lint

dev-all: ## Start dev mode for all services via Turborepo
	yarn dev

test-all: ## Run tests for all services via Turborepo
	yarn test

typecheck-all: ## Typecheck all services via Turborepo
	yarn typecheck

## DATABASE COMMANDS
db-shell-hub: ## Open MySQL shell for Hub database
	docker exec -it $(NAME)_mysql_hub mysql -u$(MYSQL_HUB_USER) -p$(MYSQL_HUB_PASSWORD) $(MYSQL_HUB_DB)

db-shell-pulse: ## Open MySQL shell for Pulse database
	docker exec -it $(NAME)_mysql_pulse mysql -u$(MYSQL_PULSE_USER) -p$(MYSQL_PULSE_PASSWORD) $(MYSQL_PULSE_DB)

db-shell-service: ## Open MySQL shell for Service database
	docker exec -it $(NAME)_mysql_service mysql -u$(MYSQL_SERVICE_USER) -p$(MYSQL_SERVICE_PASSWORD) $(MYSQL_SERVICE_DB)

db-shell-control: ## Open MySQL shell for Control database
	docker exec -it $(NAME)_mysql_control mysql -u$(MYSQL_CONTROL_USER) -p$(MYSQL_CONTROL_PASSWORD) $(MYSQL_CONTROL_DB)

## UTILS
install: ## Install all dependencies
	yarn install

clean: ## Clean node_modules and build artifacts
	yarn cache clean
	rm -rf node_modules apps/*/frontend/node_modules apps/*/backend/node_modules libs/*/node_modules
	rm -rf apps/*/frontend/dist apps/*/backend/dist
