const chai = require("chai");
const sinon = require("sinon");
const { ObjectId } = require("mongodb");

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../api/app");
const { getConnection } = require("./connectionMock");
const MongoClient = require("mongodb/lib/mongo_client");

const { expect } = chai;

const validIdRecipe = "61a68b5c89f11275b8ae489f";
const recipeExemplo = {
  _id: ObjectId(validIdRecipe),
  name: "Brownie",
  ingredients: "chocolate, milk",
  preparation: "Minsturation tudo",
  userId: "61a65c85f755c750d539837a",
};

describe("3- Quando cadastra receita na rota /recipes", () => {
  describe("Quando não é possivel cadastrar", () => {
    describe("campos invalidos", () => {
      let response;
      let token;
      let connectionMock;

      before(async () => {
        connectionMock = await getConnection();
        sinon.stub(MongoClient, "connect").resolves(connectionMock);

        await connectionMock.db("Cookmaster").collection("users").insertOne({
          name: "Fake name",
          email: "fake.email10@gmail.com",
          password: "12345678",
        });

        responseLogin = await chai.request(app).post("/login").send({
          email: "fake.email10@gmail.com",
          password: "12345678",
        });

        token = responseLogin.body.token;

        response = await chai
          .request(app)
          .post("/recipes")
          .send({})
          .set({ authorization: token });
      });

      after(async () => {
        MongoClient.connect.restore();
        await connectionMock
          .db("Cookmaster")
          .collection("users")
          .deleteMany({});
      });

      it("retorna status 400", () => {
        expect(response).to.have.status(400);
      });

      it("retorna a `message` correta", () => {
        expect(response.body.message).to.equal("Invalid entries. Try again.");
      });
    });

    describe("quando não é enviado um token", () => {
      let response;

      before(async () => {
        response = await chai.request(app).post("/recipes").send({});
      });

      it("retorna status 401", () => {
        expect(response).to.have.status(401);
      });

      it("retorna a `message` correta", () => {
        expect(response.body.message).to.equal("missing auth token");
      });
    });

    describe("quando o token enviado não é valido", () => {
      let response;

      before(async () => {
        response = await chai
          .request(app)
          .post("/recipes")
          .send({})
          .set({ authorization: "fake-token" });
      });

      it("retorna status 401", () => {
        expect(response).to.have.status(401);
      });

      it("retorna a `message` correta", () => {
        expect(response.body.message).to.equal("jwt malformed");
      });
    });
  });

  describe("quando é possivel cadastrar", () => {
    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      responseLogin = await chai.request(app).post("/login").send({
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      token = responseLogin.body.token;

      response = await chai
        .request(app)
        .post("/recipes")
        .send({
          name: "fake name",
          ingredients: "many fakes ingredients",
          preparation: "some fakes preparation",
        })
        .set({ authorization: token });
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db("Cookmaster").collection("users").deleteMany({});
    });

    it("retorna status 201", () => {
      expect(response).to.have.status(201);
    });

    it("o objeto de resposta tem a propriedade recipes", () => {
      expect(response.body).to.have.property("recipe");
    });
  });
});

describe("4- Quando listar as receitas", () => {
  let connectionMock;
  let response;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, "connect").resolves(connectionMock);

    response = await chai.request(app).get("/recipes");
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  it("retorna status 200", () => {
    expect(response).to.have.status(200);
  });

  it("retorna um array de receitas", () => {
    expect(response.body).to.be.an("array");
  });
});

describe("5- Quando procura por uma receita específica", () => {
  describe("Quando NÃO é uma receita valida", () => {
    let response;

    before(async () => {
      const invalidIdRecipe = "63csikd02m3n9jdci0";
      response = await chai.request(app).get(`/recipes/${invalidIdRecipe}`);
    });

    it("retorna status 404", () => {
      expect(response).to.have.status(404);
    });

    it("o objeto de resposta deve ter a `message` correta", () => {
      expect(response.body.message).to.be.equal("recipe not found");
    });
  });

  describe("Quando é uma receita valida", () => {
    let response;
    let connectionMock;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock
        .db("Cookmaster")
        .collection("recipes")
        .insertOne(recipeExemplo);

      response = await chai
        .request(app)
        .get(`/recipes/${validIdRecipe}`)
        .send({});
    });

    after(async () => {
      MongoClient.connect.restore();
      connectionMock
        .db("Cookmaster")
        .collection("recipes")
        .deleteOne({ _id: ObjectId(validIdRecipe) });
    });

    it("retorna status 200", () => {
      expect(response).to.have.status(200);
    });

    it("retorna um objeto com as propriedades corretas", () => {
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("ingredients");
      expect(response.body).to.have.property("preparation");
    });
  });
});

describe("7-Quando edita uma receita", () => {
  describe("Quando é possivel alterar uma receita com sucesso", () => {
    let response;
    let token;
    let connectionMock;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fake.email10@gmail.com",
        password: "12345678",
        role: "admin"
      });

      await connectionMock.db("Cookmaster").collection("recipes").insertOne(recipeExemplo);

      responseLogin = await chai.request(app).post("/login").send({
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      token = responseLogin.body.token;

      response = await chai
        .request(app)
        .put(`/recipes/${validIdRecipe}`)
        .set({ authorization: token })
        .send({
          name: "new fake name",
          ingredients: "new many fakes ingredients",
          preparation: "new some fakes preparation",
        });
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db("Cookmaster").collection("users").deleteMany({});
      await connectionMock.db("Cookmaster").collection("recipes").deleteMany({});
    });

    it("retorna status 200", () => {
      expect(response).to.have.status(200);
    });

    it("retorna um objeto com as propriedades corretas", () => {
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("ingredients");
      expect(response.body).to.have.property("preparation");
    });
  });

  describe('Quando o usuario não é admin', () => {
    let response;
    let token;
    let connectionMock;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      await connectionMock.db("Cookmaster").collection("recipes").insertOne(recipeExemplo);

      responseLogin = await chai.request(app).post("/login").send({
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      token = responseLogin.body.token;

      response = await chai
        .request(app)
        .put(`/recipes/${validIdRecipe}`)
        .set({ authorization: token })
        .send({
          name: "new fake name",
          ingredients: "new many fakes ingredients",
          preparation: "new some fakes preparation",
        });
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db("Cookmaster").collection("users").deleteMany({});
      await connectionMock.db("Cookmaster").collection("recipes").deleteMany({});
    });

    it("retorna status 401", () => {
      expect(response).to.have.status(401);
    });
  })
});

describe("8-Quando deleta uma receita", () => {
  describe("Quando é possivel deletar uma receita com sucesso", () => {
    let response;
    let token;
    let connectionMock;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fake.email10@gmail.com",
        password: "12345678",
        role: "admin"
      });

      await connectionMock.db("Cookmaster").collection("recipes").insertOne(recipeExemplo);

      responseLogin = await chai.request(app).post("/login").send({
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      token = responseLogin.body.token;

      response = await chai
        .request(app)
        .delete(`/recipes/${validIdRecipe}`)
        .set({ authorization: token })
        .send({
          name: "new fake name",
          ingredients: "new many fakes ingredients",
          preparation: "new some fakes preparation",
        });
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db("Cookmaster").collection("users").deleteMany({});
      await connectionMock.db("Cookmaster").collection("recipes").deleteMany({});
    });
  
    it("retorna status 204", () => {
      expect(response).to.have.status(204);
    });
  });

  describe("Quando não é possivel deletar uma receita", () => {
    let response;
    let token;
    let connectionMock;

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      await connectionMock.db("Cookmaster").collection("recipes").insertOne(recipeExemplo);

      responseLogin = await chai.request(app).post("/login").send({
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      token = responseLogin.body.token;

      response = await chai
        .request(app)
        .delete(`/recipes/${validIdRecipe}`)
        .set({ authorization: token })
        .send({
          name: "new fake name",
          ingredients: "new many fakes ingredients",
          preparation: "new some fakes preparation",
        });
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db("Cookmaster").collection("users").deleteMany({});
      await connectionMock.db("Cookmaster").collection("recipes").deleteMany({});
    });
  
    it("retorna status 401", () => {
      expect(response).to.have.status(401);
    });
  });
});

describe('12- Quando cadastra um novo admin', () => {
  describe('Quando é cadastrado com sucesso', () => {
    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fake.email10@gmail.com",
        password: "12345678",
        role: "admin"
      });

      responseLogin = await chai.request(app).post("/login").send({
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      token = responseLogin.body.token;

      response = await chai
        .request(app)
        .post(`/users/admin`)
        .set({ authorization: token })
        .send({
          name: "newf ake name",
          email: "new.fake@email.com",
          password: "fakePassword"
        });
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db("Cookmaster").collection("users").deleteMany({});
    });
    
    it("retorna status 201", () => {
      expect(response).to.have.status(201);
    });
  })

  describe('Quando não é um admin que está cadastrando', () => {
    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock.db("Cookmaster").collection("users").insertOne({
        name: "Fake name",
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      responseLogin = await chai.request(app).post("/login").send({
        email: "fake.email10@gmail.com",
        password: "12345678",
      });

      token = responseLogin.body.token;

      response = await chai
        .request(app)
        .post(`/users/admin`)
        .set({ authorization: token })
        .send({
          name: "newf ake name",
          email: "new.fake@email.com",
          password: "fakePassword"
        });
    });

    after(async () => {
      MongoClient.connect.restore();
      await connectionMock.db("Cookmaster").collection("users").deleteMany({});
    });

    it("retorna status 403", () => {
      expect(response).to.have.status(403);
    });

    it("O objeto de resposeta tem a `message` correta", () => {
      expect(response.body.message).to.be.equal("Only admins can register new admins");
    });
  })
})

describe('Quando não enviamos uma imagem na rota /recipes/:id/image', () => {
  let response;
  let token;
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, "connect").resolves(connectionMock);

    await connectionMock.db("Cookmaster").collection("users").insertOne({
      name: "Fake name",
      email: "fake.email10@gmail.com",
      password: "12345678",
      role: "admin"
    });

    await connectionMock.db("Cookmaster").collection("recipes").insertOne(recipeExemplo);

    responseLogin = await chai.request(app).post("/login").send({
      email: "fake.email10@gmail.com",
      password: "12345678",
    });

    token = responseLogin.body.token;

    response = await chai
      .request(app)
      .put(`/recipes/${validIdRecipe}/image`)
      .set({ authorization: token })
      .send({});
  });

  after(async () => {
    MongoClient.connect.restore();
    await connectionMock.db("Cookmaster").collection("users").deleteMany({});
    await connectionMock.db("Cookmaster").collection("recipes").deleteMany({});
  });

  it('retorna um status HTTP 500', () => {
    expect(response).to.have.status(500)
  })

  it('o objeto de resposta tem a propriedade `message`', () => {
    expect(response.body).to.have.a.property('message')
  })
  
})