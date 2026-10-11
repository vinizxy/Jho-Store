import { expect, test } from "@playwright/test"

test("compra em 3 toques: home → produto → carrinho → checkout", async ({ page }) => {
  await page.goto("/")

  // 1. produto (primeiro card das ofertas)
  await page.locator("#ofertas a").first().click()
  await expect(page).toHaveURL(/\/p\//)
  const name = await page.getByRole("heading", { level: 1 }).textContent()
  expect(name).toBeTruthy()

  // 2. adicionar (no mobile, a barra fixa)
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click()
  const drawer = page.getByRole("dialog", { name: /Seu carrinho/ })
  await expect(drawer).toBeVisible()
  await expect(drawer.getByText("Adicionado ao carrinho")).toBeVisible()
  await expect(drawer.getByRole("link", { name: name! })).toBeVisible()

  // 3. finalizar
  await drawer.getByRole("link", { name: "Finalizar compra" }).click()
  await expect(page).toHaveURL(/\/checkout$/)

  // validação: enviar vazio foca o primeiro campo com erro
  await page.getByRole("button", { name: "Confirmar pedido" }).click()
  await expect(page.getByLabel("Nome completo")).toBeFocused()
  await expect(page.getByText("Informe seu nome.")).toBeVisible()

  await page.getByLabel("Nome completo").fill("Joana Ribeiro")
  await page.getByLabel("E-mail").fill("joana@email.com")
  await page.getByLabel("Celular (WhatsApp)").fill("11987654321")
  await page.getByLabel("CEP").fill("01310100")
  await expect(page.getByLabel("CEP")).toHaveValue("01310-100")
  await page.getByLabel("Endereço").fill("Avenida Paulista")
  await page.getByLabel("Número").fill("1000")
  await page.getByLabel("Bairro").fill("Bela Vista")
  await page.getByLabel("Cidade").fill("São Paulo")
  await page.getByLabel("Estado").selectOption("SP")
  await expect(page.getByLabel("Estado")).toHaveValue("SP")
  await page.getByRole("button", { name: "Confirmar pedido" }).click()

  await expect(page.getByRole("heading", { name: "Pedido recebido!" })).toBeVisible()
  await expect(page.getByText(/JHO-[A-Z0-9]{6}/)).toBeVisible()

  // carrinho foi limpo
  await page.goto("/carrinho")
  await expect(page.getByRole("heading", { name: "Seu carrinho está vazio" })).toBeVisible()
})

test("busca sem acento e filtro pela URL", async ({ page }) => {
  await page.goto("/busca?q=eletronico")
  await expect(page.getByText(/resultados? para “eletronico”/)).toBeVisible()
  await page.getByRole("link", { name: "Em oferta" }).click()
  await expect(page).toHaveURL(/f=oferta/)
  await expect(page.getByRole("link", { name: "Em oferta" })).toHaveAttribute("aria-current", "page")
})

// Com PPR o status já saiu como 200 quando o notFound() acontece; o Next injeta noindex
// (docs: file-conventions/loading#status-codes), que é o que importa para o Google.
test("slug inexistente mostra 404 com busca e noindex", async ({ page }) => {
  await page.goto("/p/nao-existe")
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible()
  await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached()
  await expect(page.locator("#conteudo").getByRole("search")).toBeVisible()
})
