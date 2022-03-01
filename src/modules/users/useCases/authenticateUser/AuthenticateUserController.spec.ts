import request from "supertest";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Authenticate User Controller", () => {
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

  it("should be able to authenticate a user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "john@user.com",
      password: "12345"
    });

    expect(response.body.user.email).toBe("john@user.com");
    expect(response.body).toHaveProperty("token");
  });
});
