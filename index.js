const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Connect to MongoDB using Mongoose
mongoose
  .connect(
    "mongodb+srv://vinitha:6nEye3eS1xaCOyvI@cluster0.28ve347.mongodb.net/db?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// Create a schema for the population model
const countryPopulationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  population: { type: Number, required: true },
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const corsOptions = {
  origin: "http://localhost:4200",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// Create a population model based on the schema
const PopulationRecords = mongoose.model(
  "Population",
  countryPopulationSchema,
  "population"
);

// Create the Express app
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Define the routes

// Get all population
app.get("/population", async (req, res) => {
  try {
    const population = await PopulationRecords.find();
    res.json(population);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch population" });
  }
});

// Get a specific population by ID
app.get("/population/:id", async (req, res) => {
  try {
    const population = await PopulationRecords.findById(req.params.id);
    if (!population) {
      res.status(404).json({ error: "Population not found" });
    } else {
      res.json(population);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch population" });
  }
});

// Create a new population
app.post("/population", async (req, res) => {
  try {
    const population = new PopulationRecords(req.body);
    await population.save();
    res.status(201).json(population);
  } catch (error) {
    res.status(500).json({ error: "Failed to create population" });
  }
});

// Update a population
app.put("/population/:id", async (req, res) => {
  try {
    const population = await PopulationRecords.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!population) {
      res.status(404).json({ error: "Population not found" });
    } else {
      res.json(population);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update population" });
  }
});

// Delete a population
app.delete("/population/:id", async (req, res) => {
  try {
    const population = await PopulationRecords.findByIdAndDelete(req.params.id);
    if (!population) {
      res.status(404).json({ error: "Population not found" });
    } else {
      res.json({ message: "Population deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete population" });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
