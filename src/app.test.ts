import request from "supertest";

import { AuthService } from "@/auth/auth.service";
import { authService } from "@/containers";

import { boostrap } from "./app";

const app = boostrap();

describe("app integration", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("GET /api/ responds with 200", async () => {
    const response = await request(app).get("/api/");
    expect(response.status).toBe(200);
  });

  it("POST /api/signin returns 400 when zod validation fails", async () => {
    const response = await request(app).post("/api/signin").send({
      code: "admin",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("POST /api/signin returns 200 on happy path", async () => {
    jest.spyOn(authService, "signIn").mockResolvedValue("mock-jwt");

    const response = await request(app).post("/api/signin").send({
      code: "admin",
      password: "secret",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: "mock-jwt" });
  });

  it("GET /api/clients returns 401 when auth header is missing", async () => {
    const response = await request(app).get("/api/clients");
    expect(response.status).toBe(401);
  });

  it("POST /api/products returns 400 when zod validation fails", async () => {
    jest.spyOn(AuthService, "verifyToken").mockResolvedValue({
      code: "admin",
      id: 1,
      name: "Admin",
    } as any);

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", "Bearer valid-token")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
