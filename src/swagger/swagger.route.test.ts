import express from "express";
import request from "supertest";

import SwaggerRoute from "@/swagger/swagger.route";

describe("swagger.route", () => {
  it("GET /docs/ responds with 200", async () => {
    const app = express();
    app.use("/", SwaggerRoute);

    const response = await request(app).get("/docs/");
    expect(response.status).toBe(200);
  });
});
