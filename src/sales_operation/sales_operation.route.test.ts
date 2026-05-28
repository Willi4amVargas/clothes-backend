import express from "express";
import request from "supertest";

import SalesOperationRoute from "@/sales_operation/sales_operation.route";

jest.mock("@/containers", () => ({
  salesOperationController: {
    create: (_req: any, res: any) => res.status(200).json({ id: 1 }),
    getAll: (_req: any, res: any) => res.status(200).json([]),
    getOne: (req: any, res: any) => res.status(200).json({ id: Number(req.params.id) }),
  },
}));

describe("sales_operation.route", () => {
  it("GET /sales_operation responds with 200", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", SalesOperationRoute);

    const response = await request(app).get("/sales_operation");
    expect(response.status).toBe(200);
  });
});
