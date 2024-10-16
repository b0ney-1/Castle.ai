import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client
      .connect()
      .then(() => {
        console.log("Connected to MongoDB");
        return client;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client
    .connect()
    .then(() => {
      console.log("Connected to MongoDB");
      return client;
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      throw error;
    });
}

export default clientPromise;
