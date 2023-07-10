"use strict";
const games = [];

/**
 * Gets game details.
 * The response object contains the current snapshot of the provided game. Please check the `Game` object for more detailed info.
 *
 * id String The id of the game
 * returns Game
 **/
exports.gamesIdGET = function (id) {
  return new Promise(function (resolve, reject) {
    if (games[id] == null) {
      console.log(games[id]);
      const response = {};
      resolve([
        (response["application/json"] = {
          message: "game_not_found",
        }),
        404,
      ]);
    } else {
      resolve([games[id]]);
    }
  });
};

/**
 * Make a move. Takes two node ids (`from`, `to`).
 *
 * body Id_move_body  (optional)
 * id String The id of the game
 * returns Game
 **/
exports.gamesIdMovePOST = function (body, id) {
  return new Promise(function (resolve, reject) {
    if (games[id] == null) {
      const responses = {};
      resolve([
        (responses["application/json"] = {
          error_type: "game_not_found",
        }),
        404,
      ]);
    } else if (checkIfOver(id)) {
      //check if the game is over
      const responses = {};
      resolve([
        (responses["application/json"] = {
          error_type: "game_is_over",
        }),
        400,
      ]);
    } else if (checkIfNodesAvailable(id, body.from, body.to)) {
      const responses = {};
      resolve([
        (responses["application/json"] = {
          error_type: "invalid_node_id",
        }),
        404,
      ]);
    } else if (checkIfTypeSame(id, body.from, body.to)) {
      // Two letters of the same kind cannot be connected to each other (i.e. A->A is not valid)
      const responses = {};
      resolve([
        (responses["application/json"] = { error_type: "invalid_move" }),
        400,
      ]);
    } else if (checkMaxConnectionsLength(id, body.from, body.from)) {
      // Each letter can be connected with up to 2 other letters
      const responses = {};
      resolve([
        (responses["application/json"] = { error_type: "invalid_move" }),
        400,
      ]);
    } else if (checkIfInValidConnection(id, body.from, body.to)) {
      // A letter cannot be connected to two letters of the same type (i.e. B<-A->B is not valid)
      const responses = {};
      resolve([
        (responses["application/json"] = { error_type: "invalid_move" }),
        400,
      ]);
    } else {
      games[id].nodes[body.from - 1].connections.push(body.to);
      games[id].nodes[body.to - 1].connections.push(body.from);
      games[id].current_player =
        games[id].current_player === "first" ? "second" : "first";

      if (checkIfOver(id)) {
        games[id].winner =
          games[id].current_player === "first" ? "second" : "first";
      }

      resolve([games[id]]);
    }
  });
};

/**
 * Creates a new game
 * The request should contain the the initial node layout. The allowed values for the node are: `a`/`b`/`c`. Returns the id of the game that has been successfully created. The id of each node MUST be sequentially assigned starting from 1, in the same order the nodes are provided.
 *
 * body Games_body  (optional)
 * returns inline_response_200
 **/
exports.gamesPOST = function (body) {
  return new Promise(function (resolve, reject) {
    const responses = {};
    const game = {};
    game.id = games.length;
    game.winner = null;
    game.current_player = "first";
    game.nodes = [];
    games.push(game);

    body.nodes.forEach((element) => {
      const node = {};
      node.id = game.nodes.length + 1;
      node.type = element;
      node.connections = [];
      game.nodes.push(node);
    });

    responses["application/json"] = {
      game_id: game.id,
    };

    if (Object.keys(responses).length > 0) {
      resolve([responses[Object.keys(responses)[0]]]);
    } else {
      resolve([
        (responses["application/json"] = { message: "Something went wrong!" }),
        403,
      ]);
    }
  });
};

function checkIfOver(id) {
  let over = true;

  games[id].nodes.some((element) => {
    return games[id].nodes.some((element2) => {
      if (
        element.id !== element2.id &&
        !checkIfInValidConnection(id, element.id, element2.id) &&
        !checkIfTypeSame(id, element.id, element2.id) &&
        !checkMaxConnectionsLength(id, element.id, element2.id)
      ) {
        over = false;
        return true; // Stop iteration
      }
      return false;
    });
  });

  return over;
}

function checkIfNodesAvailable(id, from, to) {
  return games[id].nodes[from - 1] == null || games[id].nodes[to - 1] == null;
}

function checkIfTypeSame(id, from, to) {
  return games[id].nodes[from - 1].type === games[id].nodes[to - 1].type;
}

function checkMaxConnectionsLength(id, from, to) {
  return (
    games[id].nodes[from - 1].connections.length >= 2 ||
    games[id].nodes[to - 1].connections.length >= 2
  );
}

function checkIfInValidConnection(id, from, to) {
  return games[id].nodes[from - 1].connections.some((element) => {
    return games[id].nodes[element - 1].type === games[id].nodes[to - 1].type;
  });

  /* return (
    games[id].nodes[from].connections.filter(
      (element) => games[id].nodes[element].type == games[id].nodes[to].type
    ) > 0
  ); */
}
