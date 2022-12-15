import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  });

  it("Should be able to create a new User", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "gerente",
        email: "gerencia@iti.com.br",
        password: "admin",
      });

      expect(response.status).toBe(201);
  });

  it("Shouldn't be able to create an user with an email that already exists", async () => {
    const response = await request(app)
    .post("/api/v1/users")
    .send({
      name: "admin",
      email: "gerencia@iti.com.br",
      password: "4321",
    });

    expect(response.status).toBe(400)
  });
});
