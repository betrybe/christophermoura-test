
const chai = require("chai");
const sinon = require("sinon");

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../api/app");
const { getConnection } = require("./connectionMock");
const MongoClient = require("mongodb/lib/mongo_client");

const { expect } = chai;

describe("1-Quando cria um usuario na rota /users", () => {
  describe("Quando algum campo é invalido", () => {
    let response;

    before(async () => {
      response = await chai.request(app).post("/users").send({});
    });

    it("retorna status HTTP 400", () => {
      expect(response).to.have.status(400);
    });

    it("o objeto da resposta contém a `message` correta", () => {
      expect(response.body.message).to.equal("Invalid entries. Try again.");
    });
  });

  describe("Quando os campos são válidos", () => {
    describe("usuario já está cadastrado", () => {
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

        response = await chai.request(app).post("/users").send({
          name: "Fake name",
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

      it("retorna status HTTP 409", () => {
        expect(response).to.have.status(409);
      });

      it("o objeto da resposta contém a `message` correta", () => {
        expect(response.body.message).to.equal("Email already registered");
      });
    });
  });

  describe("Quando o usuario já existe", () => {
    let response;
    let connectionMock;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fakeEmail@gmail.com",
        password: "fakePassword",
      });

      response = await chai.request(app).post("/users").send({
        name: "Fake name",
        email: "fakeEmail@gmail.com",
        password: "fakePassword",
      });
    });

    after(async () => {
      MongoClient.connect.restore();
      connectionMock.db("Cookmaster").collection("users").deleteMany({});
    });

    it("retorna status HTTP 409", () => {
      expect(response).to.have.status(409);
    });
    it("o corpo da resposta tem a `message` correta", () => {
      expect(response.body.message).to.be.equal("Email already registered");
    });
  });
});

describe("2-Quando um usuario faz login", () => {
  describe("Quando falta preencher algum campo", () => {
    let response;
    let connectionMock;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fakeEmail@gmail.com",
        password: "fakePassword",
      });

      response = await chai.request(app).post("/login").send({
        email: "fakeEmail@gmail.com",
      });
    });

    after(async () => {
      MongoClient.connect.restore();
      connectionMock.db("Cookmaster").collection("users").deleteMany({});
    });

    it("retorna status HTTP 401", () => {
      expect(response).to.have.status(401)
    });
    it("o obejto da resposta tem a `message` correta", () => {
      expect(response.body.message).to.be.equal('All fields must be filled')
    });
  });

  describe("Quando email ou senha são invalidos", () => {
    let response;
    let connectionMock;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fakeEmail@gmail.com",
        password: "fakePassword",
      });

      response = await chai.request(app).post("/login").send({
        email: "fakeEmail@gmail.com",
        password: "fakePass",
      });
    });

    after(async () => {
      MongoClient.connect.restore();
      connectionMock.db("Cookmaster").collection("users").deleteMany({});
    });

    it("retorna status HTTP 401", () => {
      expect(response).to.have.status(401)
    });
    it("o obejto da resposta tem a `message` correta", () => {
      expect(response.body.message).to.be.equal('Incorrect username or password')
    });
  });

  describe("Quando é possivel fazer o login com sucesso", () => {
    let response;
    let connectionMock;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fakeEmail@gmail.com",
        password: "fakePassword",
      });

      response = await chai.request(app).post("/login").send({
        email: "fakeEmail@gmail.com",
        password: "fakePassword",
      });
    });

    after(async () => {
      MongoClient.connect.restore();
      connectionMock.db("Cookmaster").collection("users").deleteMany({});
    });

    it("retorna status HTTP 200", () => {
      expect(response).to.have.status(200)
    });
    it("o obejto da resposta tem uma propriedade `token`", () => {
      expect(response.body).to.have.a.property('token')
    });
  });
});
