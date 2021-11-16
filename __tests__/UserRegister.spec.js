const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/User");
const sequelize = require("../src/config/database");

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe("User Registration", () => {
  const postValidUser = () => {
    return request(app).post("/api/1.0/users").send({
      username: "user1",
      email: "user1@mail.com",
      password: "p4ssword",
    });
  };

  it("returns 200 OK when signup request is valid", async () => {
    const response = await postValidUser();
    expect(response.status).toBe(200);
  }, 10000);

  it("returns success message when signup request is valid", async () => {
    const response = await postValidUser();
    expect(response.body.message).toBe("User created");
  }, 10000);

  it("saves the user to database", async () => {
    await postValidUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  }, 10000);

  it("saves the username and email to database", async () => {
    await postValidUser();
    const userList = await User.findAll();
    expect(userList[0].dataValues.username).toBe("user1");
    expect(userList[0].dataValues.email).toBe("user1@mail.com");
  }, 10000);

  it("hashes the password in database", async () => {
    await postValidUser();
    const userList = await User.findAll();
    expect(userList[0].dataValues.password).not.toBe("p4ssword");
  });
});
