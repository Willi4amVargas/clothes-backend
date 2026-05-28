import express from "express";
import request from "supertest";

import ProductsUnitsRoute from "@/products_units/products_units.route";

jest.mock("@/containers", () => ({
  productsUnitsController: {
    create: (_req: any, res: any) => res.status(201).json({ id: 1 }),
  },
}));

describe("products_units.route", () => {
  it("POST /products_units/:id responds with 201", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", ProductsUnitsRoute);

    const response = await request(app).post("/products_units/1").send({
      cost: 1,
      price: 2,
      unit: "UND",
    });

    expect(response.status).toBe(201);
  });
});
