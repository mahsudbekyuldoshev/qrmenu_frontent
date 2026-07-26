.PHONY: help install dev build start lint \
	up up-d down restart logs ps build-image \
	dev-up dev-down dev-logs \
	shell clean

FRONTEND_PORT ?= 3000
COMPOSE ?= docker compose

help:
	@echo "RestoFlow Frontend — buyruqlar"
	@echo ""
	@echo "  Lokal (npm):"
	@echo "    make install     — npm dependencies"
	@echo "    make dev         — Next.js dev server"
	@echo "    make build       — production build"
	@echo "    make start       — production start"
	@echo "    make lint        — ESLint"
	@echo ""
	@echo "  Docker (production):"
	@echo "    make up          — build + ishga tushirish (foreground)"
	@echo "    make up-d        — build + background (-d)"
	@echo "    make down        — to'xtatish"
	@echo "    make restart     — qayta ishga tushirish"
	@echo "    make logs        — loglarni kuzatish"
	@echo "    make ps          — konteyner holati"
	@echo "    make build-image — faqat image build"
	@echo "    make shell       — frontend konteynerga kirish"
	@echo ""
	@echo "  Docker (dev / hot reload):"
	@echo "    make dev-up      — frontend-dev profili"
	@echo "    make dev-down    — frontend-dev ni to'xtatish"
	@echo "    make dev-logs    — frontend-dev loglari"
	@echo ""
	@echo "  Boshqa:"
	@echo "    make clean       — .next va node_modules tozalash"
	@echo ""
	@echo "  Port: FRONTEND_PORT=$(FRONTEND_PORT)  (masalan: make up-d FRONTEND_PORT=3001)"

# ── Lokal ──────────────────────────────────────────────
install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

# ── Docker production ──────────────────────────────────
up:
	FRONTEND_PORT=$(FRONTEND_PORT) $(COMPOSE) up --build

up-d:
	FRONTEND_PORT=$(FRONTEND_PORT) $(COMPOSE) up --build -d

down:
	$(COMPOSE) down

restart:
	FRONTEND_PORT=$(FRONTEND_PORT) $(COMPOSE) up --build -d --force-recreate

logs:
	$(COMPOSE) logs -f frontend

ps:
	$(COMPOSE) ps

build-image:
	FRONTEND_PORT=$(FRONTEND_PORT) $(COMPOSE) build frontend

shell:
	$(COMPOSE) exec frontend sh

# ── Docker dev ─────────────────────────────────────────
dev-up:
	FRONTEND_PORT=$(FRONTEND_PORT) $(COMPOSE) --profile dev up --build frontend-dev

dev-down:
	$(COMPOSE) --profile dev stop frontend-dev
	$(COMPOSE) --profile dev rm -f frontend-dev

dev-logs:
	$(COMPOSE) logs -f frontend-dev

# ── Clean ──────────────────────────────────────────────
clean:
	rm -rf .next node_modules
	$(COMPOSE) down -v --remove-orphans 2>/dev/null || true
