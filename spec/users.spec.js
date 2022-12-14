import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { cleanUpDatabase, generateValidJwt } from "./utils.js";
import User from "../models/user.js"


afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(cleanUpDatabase);

describe("POST /users", function () {
  test("should create a user", async function () {
    const res = await supertest(app)
      .post("/users")
      .send({
        name: "JohnDoe",
        surname: "John",
        password: "Test",
      })
      .expect(200)
      .expect("Content-Type", /json/);

      expect(res.body).toBeObject();
      expect(res.body._id).toBeString();
      expect(res.body.name).toEqual("Johndoe");
      expect(res.body).toContainAllKeys(["name","surname", "pictures", "notes", "_id", "__v"]);

    
  });
});

describe("GET /users", function () {

    let johnDoe;
    let janeDoe;

    beforeEach(async function() {
      // Create 2 users before retrieving the list.
      [ johnDoe, janeDoe ] = await Promise.all([
        User.create({ name: 'JohnDoe',surname: 'test', passwordHash:'test' }),
        User.create({ name: 'JaneDoe', surname: 'test', passwordHash:'test' })
      ]);
    });


  test("should retrieve the list of users", async function () {
    const token = await generateValidJwt(johnDoe);
    const token2 = await generateValidJwt(janeDoe);
    const res = await supertest(app)
    .get('/users')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/);
    expect(res.body).toBeArray();
    expect(res.body).toHaveLength(2);
  });
});

describe('DELETE /users/:name', function (){

  let johnDoe;
  let janeDoe;

  beforeEach(async function() {
    // Create 2 users before retrieving the list.
    [ johnDoe, janeDoe ] = await Promise.all([
      User.create({ name:'Johndoe',surname:'test', passwordHash:'test' }),
      User.create({ name:'Janedoe', surname:'test', passwordHash:'test' })
    ]);
  });


  test("should delete a user by his name", async function () {
    const token = await generateValidJwt(janeDoe);
    const res = await supertest(app)
    .delete(`/users/${janeDoe.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
  });

})

describe('PATCH /users/:name', function (){

  let johnDoe;
  let janeDoe;

  beforeEach(async function() {
    // Create 2 users before retrieving the list.
    [ johnDoe, janeDoe ] = await Promise.all([
      User.create({ name:'JohnDoe',surname:'test', passwordHash:'test' }),
      User.create({ name:'JaneDoe', surname:'test', passwordHash:'test' })
    ]);
  });

  test("should modify the user's name and surname", async function() {
    const token = await generateValidJwt(johnDoe);
    const res = await supertest(app)
      .patch(`/users/${johnDoe.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Test",
        surname: "Testing"
      })
      .expect(200)
      .expect('Content-Type', /text/)
});

})