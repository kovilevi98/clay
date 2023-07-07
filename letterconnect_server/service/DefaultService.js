"use strict";

let games = [];

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
      var examples = {};
      resolve([
        (examples["application/json"] = {
          message: "Not found game with the given id!",
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
      var examples = {};
      resolve([
        (examples["application/json"] = {
          message: "Not found game with the given id!",
        }),
        404,
      ]);
    } else if (checkIfNodesAvailable(id, body.from, body.to)) {
      var examples = {};
      resolve([
        (examples["application/json"] = {
          message: "Not found node with the given id!",
        }),
        404,
      ]);
    } else if (checkIfTypeSame(id, body.from, body.to)) {
      // Two letters of the same kind cannot be connected to each other (i.e. A->A is not valid)
      var examples = {};
      resolve([
        (examples["application/json"] = { message: "Invalid move!" }),
        404,
      ]);
    } else if (checkMaxConnectionsLength(id, body.from, body.from)) {
      // Each letter can be connected with up to 2 other letters
      var examples = {};
      resolve([
        (examples["application/json"] = { message: "Invalid move!" }),
        404,
      ]);
    } else if (checkIfInValidConnection(id, body.from, body.to)) {
      // A letter cannot be connected to two letters of the same type (i.e. B<-A->B is not valid)
      var examples = {};
      resolve([
        (examples["application/json"] = { message: "Invalid move!" }),
        404,
      ]);
    } else {
      games[id].nodes[body.from].connections.push(body.to);
      games[id].nodes[body.to].connections.push(body.from);
      
      checkIfOver(id);
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
    var examples = {};
    const game = {};
    game.id = games.length;
    game.winner = null;
    game.current_player = "first";
    game.nodes = [];
    games.push(game);

    body.nodes.forEach((element) => {
      const node = {};
      node.id = game.nodes.length;
      node.type = element;
      node.connections = [];
      game.nodes.push(node);
    });

    examples["application/json"] = {
      game_id: game.id,
    };

    if (Object.keys(examples).length > 0) {
      resolve([examples[Object.keys(examples)[0]]]);
      // resolve([examples[Object.keys(examples)[0]], 203]);
    } else {
      resolve([
        (examples["application/json"] = { message: "Something went wrong!" }),
        403,
      ]);
    }
  });
};

function checkIfOver(id) {
  let over = true;
  games[id].nodes.every((element) => {
    games[id].nodes.every((element2) => {
      if (element.id == element2.id || checkIfInValidConnection(id, element.id, element2.id)) {
        return false;
      } else {
        over = false;
        return true;
      }
    });
    if (!over) {
      return false;
    } else {
      return true;
    }
  });
  console.log(over);
}

function checkIfNodesAvailable(id, from, to) {
  return games[id].nodes[from] == null || games[id].nodes[to] == null;
}

function checkIfTypeSame(id, from, to) {
  return games[id].nodes[from].type == games[id].nodes[to].type;
}

function checkMaxConnectionsLength(id, from, to) {
  return (
    games[id].nodes[from].connections.length >= 2 ||
    games[id].nodes[to].connections.length >= 2
  );
}

function checkIfInValidConnection(id, from, to) {
  let inValid = false;
  games[id].nodes[from].connections.forEach((element) => {
    if (games[id].nodes[element].type == games[id].nodes[to].type) {
      inValid = true;
    }
  });
  return inValid;

  /*return (
    games[id].nodes[from].connections.filter(
      (element) => games[id].nodes[element].type == games[id].nodes[to].type
    ) > 0
  );*/
}
