const { getDB } = require("../config/db");

module.exports = {
    collection: () => getDB().collection("users")
};
