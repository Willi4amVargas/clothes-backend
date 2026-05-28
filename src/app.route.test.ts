import express from "express";
import request from "supertest";

import AppRoute from "@/app.route";

jest.mock("@/containers", () => ({
  appController: {
    get: (_req: any, res: any) => res.status(200).json({ status: "ok" }),
  },
}));

describe("app.route", () => {
  it("GET / responds with 200", async () => {
    const app = express();
    app.use("/", AppRoute);

    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
