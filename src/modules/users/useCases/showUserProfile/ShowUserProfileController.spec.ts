import request from "supertest";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("12345", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        VALUES('${id}', 'John Doe', 'john@user.com', '${password}')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show profile for the authenticated user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john@user.com",
      password: "12345"
    });

    const { token } = responseToken.body;

    const profile = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    });

    const user = profile.body;

    expect(user).toHaveProperty("id");
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@user.com");
  });

  it("should not be able to show profile for an unauthenticated user", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: "fake-token"
    });

    expect(response.status).toBe(401);
  });
});
