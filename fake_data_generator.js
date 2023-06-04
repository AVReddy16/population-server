const { faker } = require("@faker-js/faker");
const { MongoClient, ObjectId } = require("mongodb");

const uri =
  "mongodb+srv://vinitha:6nEye3eS1xaCOyvI@cluster0.28ve347.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function generateAndInsertFakeData() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("db");
    const collection = db.collection("population");

    const records = [];
    const numRecords = 15;

    for (let i = 0; i < numRecords; i++) {
      const record = {
        _id: new ObjectId(),
        country: faker.location.country(),
        population: faker.number.int(100000, 100000000),
        year: faker.number.int(1900, 2023),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      };

      records.push(record);
    }

    await collection.insertMany(records);
    console.log(`Inserted ${numRecords} records into the collection`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

generateAndInsertFakeData();
