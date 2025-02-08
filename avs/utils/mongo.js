const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const db = client.db("warpads");

module.exports = { db };
