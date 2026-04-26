import express from "express";
import request from "supertest";
import ClientsRoute from "@/clients/clients.route";

jest.mock("@/containers", () => ({
  clientsController: {
    getAll: (_req: any, res: any) => res.status(200).json([]),
    getOne: (req: any, res: any) => res.status(200).json({ id: Number(req.params.id) }),
    create: (_req: any, res: any) => res.status(201).json({ id: 1 }),
    update: (_req: any, res: any) => res.status(200).json({ ok: true }),
    delete: (_req: any, res: any) => res.status(200).json({ ok: true }),
  },
}));

describe("clients.route", () => {
  const app = express();
  app.use(express.json());
  app.use("/", ClientsRoute);

  it("GET /clients responds with 200", async () => {
    const response = await request(app).get("/clients");
    expect(response.status).toBe(200);
  });
});
