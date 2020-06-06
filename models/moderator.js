const mongoose = require("mongoose");

const moderatorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  campaignId: { type: mongoose.Schema.Types.ObjectId },
  amount: { type: Number, default: 0 },
  date: { type: Date, default: new Date().toDateString() },
});

const Moderator = mongoose.model("Moderator", moderatorSchema);
module.exports = Moderator;
