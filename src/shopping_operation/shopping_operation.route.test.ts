import express from "express";
import request from "supertest";

import ShoppingOperationRoute from "@/shopping_operation/shopping_operation.route";

jest.mock("@/containers", () => ({
  shoppingOperationController: {
    create: (_req: any, res: any) => res.status(200).json({ id: 1 }),
    getAll: (_req: any, res: any) => res.status(200).json([]),
    getOne: (req: any, res: any) => res.status(200).json({ id: Number(req.params.id) }),
  },
}));

describe("shopping_operation.route", () => {
  it("GET /shopping_operation responds with 200", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", ShoppingOperationRoute);

    const response = await request(app).get("/shopping_operation");
    expect(response.status).toBe(200);
  });
});
