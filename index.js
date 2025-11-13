const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const PORT = process.env.PORT || 9000;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

if (!DB_USER || !DB_PASS) {
  console.warn("Warning: DB_USER or DB_PASS not set in environment variables.");
}

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@crud.p5kddzk.mongodb.net/KrishiLink?retryWrites=true&w=majority&appName=CRUD`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Test route
app.get("/", (req, res) => res.send("KrishLink Server is Running!"));
app.get("/health", (req, res) =>
  res.json({ status: "OK", message: "Server is healthy" })
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("KrishiLink");
    const cropsCol = db.collection("allCrops");
    const interestCol = db.collection("myinterest");

    // -------------------- CROPS ROUTES --------------------

    // ✅ UPDATE INTEREST STATUS (PUT METHOD ONLY)




app.put("/myinterest", async (req, res) => {
  try {
    const { interestId, cropsId, status } = req.body;



    // 1) interest update
    const interest = await interestCol.findOneAndUpdate(
      { _id: new ObjectId(interestId) },
      { $set: { status } },
      { returnDocument: "after" }
      
    );
    console.log(interest)

    let updatedCrop = null;

    // 2) যদি status = accepted → crop quantity কমাও
    if (status === "accepted") {
      updatedCrop = await cropsCol.findOneAndUpdate(
        { _id: new ObjectId(cropsId) },
        { $inc: { quantity: -interest.quantity } }, // quantity কমানো
        { returnDocument: "after" }
      );
    }

    res.json({
      interest: interest,
      crop: updatedCrop?.value || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});














    // Get all crops
    app.get("/allcrops", async (req, res) => {
      try {
        const rows = await cropsCol.find().sort({ createdAt: -1 }).toArray();
        res.send(rows);
      } catch (err) {
        console.error("GET /allcrops error:", err);
        res.status(500).send({ message: "Server error fetching crops" });
      }
    });

    // Get single crop by ID
    app.get("/allcrops/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid crop ID" });
        }
        const objId = new ObjectId(id);
        const doc = await cropsCol.findOne({ _id: objId });
        if (!doc) {
          return res.status(404).send({ message: "Crop not found" });
        }
        res.send(doc);
      } catch (err) {
        console.error("GET /allcrops/:id error:", err);
        res.status(500).send({ message: "Server error fetching crop" });
      }
    });

    // Create new crop
    app.post("/allcrops", async (req, res) => {
      try {
        const data = req.body || {};

        // Validation
        if (!data.name || !data.pricePerUnit || !data.quantity) {
          return res.status(400).send({ message: "Missing required fields" });
        }

        // Convert numbers
        data.pricePerUnit = Number(data.pricePerUnit);
        data.quantity = Number(data.quantity);

        if (isNaN(data.pricePerUnit) || isNaN(data.quantity)) {
          return res.status(400).send({ message: "Invalid number format" });
        }

        data.createdAt = new Date();
        data.updatedAt = new Date();

        const result = await cropsCol.insertOne(data);
        res.send({
          success: true,
          insertedId: result.insertedId,
          message: "Crop added successfully",
        });
      } catch (err) {
        console.error("POST /allcrops error:", err);
        res.status(500).send({ message: "Server error creating crop" });
      }
    });

    // Update crop
    app.put("/myposts/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid crop ID" });
        }

        const data = req.body || {};
        const objId = new ObjectId(id);

        // Convert numbers if present
        if (data.pricePerUnit) data.pricePerUnit = Number(data.pricePerUnit);
        if (data.quantity) data.quantity = Number(data.quantity);

        data.updatedAt = new Date();

        const result = await cropsCol.updateOne({ _id: objId }, { $set: data });

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Crop not found" });
        }

        res.send({
          success: true,
          message: "Crop updated successfully",
        });
      } catch (err) {
        console.error("PUT /myposts/:id error:", err);
        res.status(500).send({ message: "Server error updating crop" });
      }
    });

    // Delete crop
    app.delete("/myposts/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid crop ID" });
        }

        const objId = new ObjectId(id);
        const result = await cropsCol.deleteOne({ _id: objId });

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Crop not found" });
        }

        res.send({
          success: true,
          message: "Crop deleted successfully",
        });
      } catch (err) {
        console.error("DELETE /myposts/:id error:", err);
        res.status(500).send({ message: "Server error deleting crop" });
      }
    });

    // Get my posts (owner's crops)
    app.get("/myposts", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res
            .status(400)
            .send({ message: "Email query parameter required" });
        }

        const rows = await cropsCol
          .find({ "owner.ownerEmail": email })
          .sort({ createdAt: -1 })
          .toArray();
        res.send(rows);
      } catch (err) {
        console.error("GET /myposts error:", err);
        res.status(500).send({ message: "Server error fetching posts" });
      }
    });

    // -------------------- INTEREST ROUTES --------------------

    // Get user's interests
    app.get("/myinterest", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res
            .status(400)
            .send({ message: "Email query parameter required" });
        }

        const sortParam = req.query.sort || "createdAt_desc";
        let sort = { createdAt: -1 };

        if (sortParam === "createdAt_asc") sort = { createdAt: 1 };
        else if (sortParam === "createdAt_desc") sort = { createdAt: -1 };
        else if (sortParam === "qty_desc") sort = { quantity: -1 };
        else if (sortParam === "qty_asc") sort = { quantity: 1 };
        else if (sortParam === "status") sort = { status: 1 };

        const list = await interestCol
          .find({ userEmail: email })
          .sort(sort)
          .toArray();
        res.send(list);
      } catch (err) {
        console.error("GET /myinterest error:", err);
        res.status(500).send({ message: "Server error fetching interests" });
      }
    });

    // Create interest
    app.post("/myinterest", async (req, res) => {
      try {
        const data = req.body || {};

        // Validation
        if (!data.cropId || !data.userEmail || !data.quantity) {
          return res.status(400).send({
            message: "cropId, userEmail and quantity are required",
          });
        }

        data.cropId = String(data.cropId);
        data.quantity = Number(data.quantity);

        if (isNaN(data.quantity) || data.quantity <= 0) {
          return res.status(400).send({ message: "Invalid quantity" });
        }

        // Check for existing interest
        const existing = await interestCol.findOne({
          cropId: data.cropId,
          userEmail: data.userEmail,
        });

        if (existing) {
          return res.status(400).send({
            message: "You have already shown interest in this crop",
          });
        }

        data.status = "pending";
        data.createdAt = new Date();
        data.updatedAt = new Date();

        const result = await interestCol.insertOne(data);
        res.send({
          success: true,
          insertedId: result.insertedId,
          message: "Interest submitted successfully",
        });
      } catch (err) {
        console.error("POST /myinterest error:", err);
        res.status(500).send({ message: "Server error creating interest" });
      }
    });

    // Get all requests for a crop (owner view)
    app.get("/requestproducts/:id", async (req, res) => {
      try {
        const cropId = req.params.id;
        if (!cropId) {
          return res.status(400).send({ message: "Crop ID is required" });
        }

        const list = await interestCol
          .find({ cropId: String(cropId) })
          .sort({ createdAt: -1 })
          .toArray();
        res.send(list);
      } catch (err) {
        console.error("GET /requestproducts/:id error:", err);
        res.status(500).send({ message: "Server error fetching requests" });
      }
    });

    console.log("✅ All routes registered successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
}

// Start the database connection
run().catch(console.dir);
