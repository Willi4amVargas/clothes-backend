import express from "express";
import request from "supertest";
import InventoryOperationRoute from "@/inventory_operation/inventory_operation.route";

jest.mock("@/containers", () => ({
  inventoryOperationController: {
    getAll: (_req: any, res: any) => res.status(200).json([]),
    getOne: (req: any, res: any) => res.status(200).json({ id: Number(req.params.id) }),
    create: (_req: any, res: any) => res.status(200).json({ id: 1 }),
  },
}));

describe("inventory_operation.route", () => {
  it("GET /inventory_operation responds with 200", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", InventoryOperationRoute);

    const response = await request(app).get("/inventory_operation");
    expect(response.status).toBe(200);
  });
});
