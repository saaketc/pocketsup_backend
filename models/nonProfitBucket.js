const mongoose = require("mongoose");

const nonProfitBucketSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId },
  amount: { type: Number, default: 0 },
  date: { type: Date, default: new Date().toUTCString() }
});

const NonProfitBucket = mongoose.model("FundnonProfitBucket", nonProfitBucketSchema);
module.exports = NonProfitBucket;
