const { test, expect } = require("@playwright/test");

// ─── Test 1: GET — Fetch a resource ──────────────────────────────────────────
test("GET /posts/1 — returns a valid post", async ({ page, request }) => {
  await page.route("**/posts/1", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: 1, userId: 1, title: "Sample Title", body: "Sample body text." }),
    })
  );

  await page.goto("about:blank");
  const response = await page.evaluate(async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    return { status: res.status, body: await res.json() };
  });

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    id: 1,
    userId: expect.any(Number),
    title: expect.any(String),
    body: expect.any(String),
  });
});

// ─── Test 2: POST — Create a resource ────────────────────────────────────────
test("POST /posts — creates a new post and returns it", async ({ page }) => {
  const payload = { title: "Playwright Test Post", body: "Hello from Playwright!", userId: 1 };

  await page.route("**/posts", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: 101, ...payload }),
    })
  );

  await page.goto("about:blank");
  const response = await page.evaluate(async (payload) => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { status: res.status, body: await res.json() };
  }, payload);

  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
  expect(response.body.title).toBe(payload.title);
  expect(response.body.userId).toBe(payload.userId);
});

// ─── Test 3: DELETE — Remove a resource ──────────────────────────────────────
test("DELETE /posts/1 — deletes a post successfully", async ({ page }) => {
  await page.route("**/posts/1", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    })
  );

  await page.goto("about:blank");
  const response = await page.evaluate(async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "DELETE",
    });
    return { status: res.status };
  });

  expect(response.status).toBe(200);
});
