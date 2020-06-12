const router = require("express").Router();
const Campaign = require("../models/campaign");
const Funding = require("../models/funding");
// const NonProfitBucket = require("../models/nonProfitBucket");
const _ = require("lodash");
const auth = require("../middleware/auth");
const { addDays } = require("../utils/generalFunctions");

// To create a campaign
router.post("/create", auth, async (req, res) => {
  try {
    let campaign = await new Campaign(
      _.pick(req.body, [
        "type",
        "title",
        "description",
        "mediaUrl",
        "goalAmount",
        "perks",
        "duration",
      ])
    );
    let startDate = Date.now();
    campaign.startDate = startDate;
    campaign.endDate = addDays(campaign.startDate, campaign.duration);
    campaign.type = campaign.type.toLowerCase();
    campaign.userId = req.user._id;
    campaign = await campaign.save();
    res.status(201).send(campaign);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// To fund a campaign
router.post("/fund", auth, async (req, res) => {
  try {
    const campaignId = req.body.campaignId;
    const amount = req.body.amount;

    let funding = await new Funding();
    funding.amount = amount;
    funding.fundingUserId = req.user._id;
    funding.campaignId = campaignId;
    funding = await funding.save();

    let campaign = await Campaign.findById(campaignId);
    campaign.fundRaised += funding.amount;
    await campaign.save();

    // implement logic of successfully funded or not check to put in non profit bucket
    //   if (campaign.fundRaised > campaign.goalAmount) {
    //       let fund = campaign.fundRaised - campaign.goalAmount;
    //       let bucket = await new NonProfitBucket();
    //       bucket.campaignId = campaignId;
    //       bucket.amount = 0.02 * fund;
    // }
    res.status(201).send(funding);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// To fetch all campaigns
router.get("/", async (req, res) => {
  try {
    // const { pageLimit } = req.query;
    let allCampaigns = await Campaign.find({
      status: {
        $in: ["active", "funded"],
      },
    })
      .sort({ startDate: -1 });
    
    allCampaigns = allCampaigns.filter(campaign => new Date().getTime() <= new Date(campaign.endDate).getTime())
    
    res.status(200).send(allCampaigns);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// To fetch all for profit campaigns
router.get("/forProfit", async (req, res) => {
  try {
    let campaigns = await Campaign.find({
      type: "p",
      status: { $in: ["active", "funded"] },
    });
    res.status(200).send(campaigns);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// To fetch all for profit campaigns
router.get("/forNonProfit", async (req, res) => {
  try {
    let campaigns = await Campaign.find({
      type: "np",
      status: { $in: ["active", "funded"] },
    });
    res.status(200).send(campaigns);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// To fetch a particular campaign using campaign id
router.get("/:campaignId", async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.campaignId);
    res.status(200).send(campaign);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// // To fetch a particular campaign using campaign title
// router.get("/:campaignTitle", async (req, res) => {
//   try {
//     let campaign = await Campaign.find({title: req.params.campaignTitle});
//     res.status(200).send(campaign);
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// });
module.exports = router;
