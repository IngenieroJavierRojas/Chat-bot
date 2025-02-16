const { MongoAdapter } = require("@builderbot/database-mongo");
require("dotenv").config();

const adapterDB = new MongoAdapter({
  dbUri: process.env.DB_CNN_STRING,
  dbName: process.env.DB_NAME,
});

module.exports = {
  adapterDB,
};
