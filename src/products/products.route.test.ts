import express from "express";
import request from "supertest";

import ProductsRoute from "@/products/products.route";

jest.mock("@/containers", () => ({
  productsController: {
    create: (_req: any, res: any) => res.status(201).json({ id: 1 }),
    delete: (_req: any, res: any) => res.status(200).json({ ok: true }),
    getAll: (_req: any, res: any) => res.status(200).json([]),
    getOne: (req: any, res: any) => res.status(200).json({ id: Number(req.params.id) }),
    update: (_req: any, res: any) => res.status(201).json({ id: 1 }),
  },
}));

describe("products.route", () => {
  it("GET /products responds with 200", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", ProductsRoute);

    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
  });
});
