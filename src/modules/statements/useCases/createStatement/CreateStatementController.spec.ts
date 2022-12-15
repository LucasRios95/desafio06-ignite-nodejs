import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../../../../app';

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash("abcd1234", 8);

    await connection.query(
      `INSERT INTO USERS (id, name, email, password, created_at, updated_at)
      values ('${id}', 'Lucas Rios', 'lucashrios@gmail.com', '${password}', 'now()', 'now()')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to Create a statement wiht a deposit operation", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "lucashrios@gmail.com",
        password: "abcd1234",
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "Primeiro depósito"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("Should be able to Create a statement wiht a withdraw operation", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "lucashrios@gmail.com",
        password: "abcd1234",
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 250,
        description: "Primeiro Saque"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });
});
