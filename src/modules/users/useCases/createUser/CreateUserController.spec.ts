import request from "supertest";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import {Connection} from "typeorm";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "john@user.com",
      password: "12345"
    });

    expect(response.status).toBe(201);
  });
});
