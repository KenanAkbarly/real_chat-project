const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports = async function connect() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(process.env.URL_MONGO);
  console.log(`MongoDb connected with ${mongoUri}`);
};
