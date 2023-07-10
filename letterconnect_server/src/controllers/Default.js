'use strict'

const utils = require('../utils/writer.js')
const Default = require('../service/DefaultService')

module.exports.gamesIdGET = function gamesIdGET (req, res, next, id) {
  Default.gamesIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response[0], response[1])
    })
    .catch(function (response) {
      utils.writeJson(res, response[0], response[1])
    })
}

module.exports.gamesIdMovePOST = function gamesIdMovePOST (req, res, next, body, id) {
  Default.gamesIdMovePOST(body, id)
    .then(function (response) {
      utils.writeJson(res, response[0], response[1])
    })
    .catch(function (response) {
      utils.writeJson(res, response[0], response[1])
    })
}

module.exports.gamesPOST = function gamesPOST (req, res, next, body) {
  Default.gamesPOST(body)
    .then(function (response) {
      utils.writeJson(res, response[0], response[1])
    })
    .catch(function (response) {
      utils.writeJson(res, response[0], response[1])
    })
}
