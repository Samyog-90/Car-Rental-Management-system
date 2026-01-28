const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

module.exports = {
  collection: () => getDB().collection("admins")
};