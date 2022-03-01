import request from "supertest";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";
import { Statement } from "../../entities/Statement";

let connection: Connection;

describe("Get Balance Controller", () => {
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

  it("should be able to list all statements and total balance for an authenticated user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "john@user.com",
      password: "12345"
    });

    const { token } = responseToken.body;

    const { body } = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer ${token}`
    });

    expect(body.statement).toEqual([]);
    expect(body).toHaveProperty("balance");
  });
});
