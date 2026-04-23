import request from "supertest";
import { boostrap } from "./app"; // Tu instancia de express

const app = boostrap();

describe("GET /api/", () => {
  it("debería responder con un estado 200", async () => {
    const response = await request(app).get("/api/");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
  });
});
