import express from "express";
import request from "supertest";
import AuthRoute from "@/auth/auth.route";

jest.mock("@/containers", () => ({
  authController: {
    signIn: (_req: any, res: any) => res.status(200).json({ token: "jwt" }),
  },
}));

describe("auth.route", () => {
  it("POST /signin responds with 200", async () => {
    const app = express();
    app.use(express.json());
    app.use("/", AuthRoute);

    const response = await request(app)
      .post("/signin")
      .send({ code: "admin", password: "secret" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: "jwt" });
  });
});
