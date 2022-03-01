import request from "supertest";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Create Statement Controller", () => {
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

  it("should be able to do a deposit statement for an authenticated user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john@user.com",
      password: "12345"
    });

    const { token } = responseToken.body;

    const { body } = await request(app).post("/api/v1/statements/deposit").send({
      amount: 10,
      description: "Deposit supertest"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(body).toHaveProperty("id");
    expect(body.amount).toBe(10);
  });

  it("should be able to do a withdraw statement for an authenticated user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john@user.com",
      password: "12345"
    });

    const { token } = responseToken.body;

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 10,
      description: "Deposit supertest"
    }).set({
      Authorization: `Bearer ${token}`
    });

    const { body } = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 9,
      description: "Withdraw supertest"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(body).toHaveProperty("id");
    expect(body.amount).toBe(9);
  });

  it("should not be able to do a withdraw for an authenticated user without balance available", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john@user.com",
      password: "12345"
    });

    const { token } = responseToken.body;

    const withdrawResponse = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 50,
      description: "Withdraw supertest"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(withdrawResponse.status).toBe(400);
  });
});
