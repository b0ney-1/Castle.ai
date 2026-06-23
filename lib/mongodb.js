import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

let client;
let clientPromise;

if (!uri) {
  clientPromise = {
    then: (onfulfilled, onrejected) => {
      const err = new Error("Please define the MONGO_URI environment variable inside .env.local");
      return Promise.reject(err).then(onfulfilled, onrejected);
    }
  };
} else if (process.env.NODE_ENV === "development") {
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
