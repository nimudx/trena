PNPM := pnpm
COMPOSE := docker compose
PID_FILE := .dev.pid
LOG_FILE := .dev.log

.PHONY: up down dev stop logs status install

up: ## Levanta los servicios de Docker (Postgres) en segundo plano
	$(COMPOSE) up -d

down: ## Apaga los servicios de Docker
	$(COMPOSE) down

dev: up ## Levanta Docker + servidor/frontend Next.js en segundo plano
	@if [ -f $(PID_FILE) ] && kill -0 "$$(cat $(PID_FILE))" 2>/dev/null; then \
		echo "El dev server ya esta corriendo (pid $$(cat $(PID_FILE)))"; \
	else \
		nohup $(PNPM) dev > $(LOG_FILE) 2>&1 & echo $$! > $(PID_FILE); \
		sleep 1; \
		echo "dev server iniciado en segundo plano (pid $$(cat $(PID_FILE)))"; \
		echo "logs: make logs"; \
	fi

stop: ## Detiene el dev server que corre en segundo plano
	@if [ -f $(PID_FILE) ] && kill -0 "$$(cat $(PID_FILE))" 2>/dev/null; then \
		kill "$$(cat $(PID_FILE))"; \
		rm -f $(PID_FILE); \
		echo "dev server detenido"; \
	else \
		echo "dev server no esta corriendo"; \
		rm -f $(PID_FILE); \
	fi

logs: ## Sigue los logs del dev server en segundo plano
	@tail -f $(LOG_FILE)

status: ## Muestra el estado de Docker y del dev server
	@$(COMPOSE) ps
	@if [ -f $(PID_FILE) ] && kill -0 "$$(cat $(PID_FILE))" 2>/dev/null; then \
		echo "dev server: corriendo (pid $$(cat $(PID_FILE)))"; \
	else \
		echo "dev server: detenido"; \
	fi

install: ## Instala dependencias
	$(PNPM) install
