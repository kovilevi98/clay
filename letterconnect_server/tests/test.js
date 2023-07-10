const chai = require("chai");
const expect = chai.expect;
const supertest = require("supertest");
const app = require("../index"); // Replace with the path to your Express app

describe("Letter Connect API Tests", function () {
  let gameId; // Store the gameId for further tests

  describe("POST /games", function () {
    it("should create a new game", function (done) {
      const requestBody = {
        nodes: ["a", "a", "c"],
      };

      supertest(app)
        .post("/games")
        .send(requestBody)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property("game_id");
          gameId = res.body.game_id; // Store the gameId for further tests
          done();
        });
    });

    it("should return a 400 Bad Request for invalid request body", function (done) {
      // Send an invalid request body
      const requestBody = {
        nodes: ["a", "a"],
      };

      supertest(app).post("/games").send(requestBody).expect(400, done);
    });
  });

  describe("GET /games/{id}", function () {
    it("should get game details for an existing game", function (done) {
      supertest(app)
        .get(`/games/${gameId}`)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an("object");
          // Add assertions for the response body as per the schema definition
          expect(res.body).to.have.property("current_player");
          expect(res.body).to.have.property("nodes");
          done();
        });
    });

    it("should return a 404 Not Found for a non-existent game", function (done) {
      const nonExistentGameId = "non-existent-game-id";

      supertest(app).get(`/games/${nonExistentGameId}`).expect(404, done);
    });
  });

  describe("POST /games/{id}/move", function () {
    it("should make a valid move", function (done) {
      const requestBody = {
        from: 1,
        to: 3,
      };

      supertest(app)
        .post(`/games/${gameId}/move`)
        .send(requestBody)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an("object");
          // Add assertions for the response body as per the schema definition
          expect(res.body).to.have.property("current_player");
          expect(res.body).to.have.property("nodes");
          done();
        });
    });

    it("should return a 404 Not found for an invalid move", function (done) {
      const requestBody = {
        from: 1,
        to: 4, // node not found
      };

      supertest(app)
        .post(`/games/${gameId}/move`)
        .send(requestBody)
        .expect(404)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it("should return a 400 with invalid_move", function (done) {
        const requestBody = {
          from: 1,
          to: 3, // Invalid move
        };
  
        supertest(app)
          .post(`/games/${gameId}/move`)
          .send(requestBody)
          .expect(400)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("error_type", "invalid_move");
            done();
          });
      });

    it("should return a 400 Bad Request if the game is already completed", function (done) {
      // Assuming the game has already been completed

      const requestBody = {
        from: 2,
        to: 3,
      };

      supertest(app)
        .post(`/games/${gameId}/move`)
        .send(requestBody)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
        });

      supertest(app)
        .post(`/games/${gameId}/move`)
        .send(requestBody)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("error_type", "game_is_over");
          done();
        });
    });
  });  
});

  


