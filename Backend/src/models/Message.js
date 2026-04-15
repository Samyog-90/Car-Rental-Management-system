const { getDB } = require("../config/db");

module.exports = {
    collection: () => getDB().collection("messages")
};
