import { test, expect } from "@playwright/test";

test("creates a project and lands on its detail page", async ({ page }) => {
  await page.goto("/projects");

  await page.getByRole("button", { name: "Nuevo proyecto" }).click();
  await page.getByLabel("Nombre").fill("E2E project");
  await page.getByRole("button", { name: "Crear proyecto" }).click();

  await expect(page).toHaveURL(/\/projects\/.+/);
  await expect(page.getByRole("heading", { name: "E2E project" })).toBeVisible();
});

test("adds a task to a project and moves it across the kanban board", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Nuevo proyecto" }).click();
  await page.getByLabel("Nombre").fill("Kanban project");
  await page.getByRole("button", { name: "Crear proyecto" }).click();
  await expect(page).toHaveURL(/\/projects\/.+/);

  await page.goto("/tasks");
  await page.getByRole("button", { name: "Nueva tarea" }).click();
  await page.getByLabel("Título").fill("Write e2e tests");
  await page.getByRole("button", { name: "Crear tarea" }).click();

  await expect(page.getByText("Write e2e tests")).toBeVisible();
});
