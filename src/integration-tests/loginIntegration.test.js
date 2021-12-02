const chai = require("chai");
const sinon = require("sinon");

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../api/app");
const { getConnection } = require("./connectionMock");
const MongoClient = require("mongodb/lib/mongo_client");

const { expect } = chai;

describe("Quando usuario faz login na rota /login", () => {
  describe("Quando não é realizado com sucesso", () => {
    let response;

    before(async () => {
      response = await chai.request(app).post("/login").send({});
    });

    it("retorna status 401", () => {
      expect(response).to.have.status(401);
    });

    it("o objeto de resposta tem propriedade `message`", () => {
      expect(response.body).to.have.property("message");
    });
  });

  describe("Quando é realizado com sucesso", () => {
    let connectionMock;
    let response;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      response = await chai.request(app).post("/login").send({
        email: "fake.email10@gmail.com",
        password: "12345678",
      });
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db("Cookmaster").collection("users").deleteOne({
        name: "Fake name",
      });
    });

    it("retorna status 200", () => {
      expect(response).to.have.status(200);
    });
    it("o objeto de resposta tem propriedade `token`", () => {
      expect(response.body).to.have.property("token");
    });
  });
});
