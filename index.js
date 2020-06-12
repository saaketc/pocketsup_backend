const express = require("express");
// const crossDomain = require("./middleware/crossDomain");
const mongoose = require("mongoose");
const cors = require('cors');
// Routes
const authRoute = require("./routes/auth");
const campaignRoute = require("./routes/campaign");
const userRoute = require("./routes/user");
const searchRoute = require("./routes/search");
const moderatorRoute = require("./routes/moderator");

const app = express();
const PORT = process.env.PORT || 5000;
// const dbConnect = "mongodb://localhost:27017/hive";
const dbConnect = process.env.MONGODB_URI ||
  'mongodb+srv://saaket777:mongodb123@cluster0-ogtyx.mongodb.net/pocketsup?retryWrites=true&w=majority'

// Database connection
const startDb = async () => {
  try {
    await mongoose.connect(dbConnect, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connected to db");
  } catch (e) {
    console.log(e.message);
  }
};
startDb();

app.use(cors());
app.get('/', (req, res) => res.status(200).send("Heya! it's PocketsUp."));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/campaign", campaignRoute);
app.use("/api/user", userRoute);
app.use("/api/search", searchRoute);
app.use("/api/moderator", moderatorRoute);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
