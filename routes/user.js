const router = require("express").Router();
const Campaign = require("../models/campaign");
const Funding = require("../models/funding");
const auth = require("../middleware/auth");

// To get campaigns of the current user
router.get("/campaigns", auth, async (req, res) => {
  try {
    let campaigns = await Campaign.find({ userId: req.user._id });
    res.status(200).send(campaigns);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// To get user portfolio of campaigns funded
router.get("/portfolio", auth, async (req, res) => {
  try {
    let funding = await Funding.find({ fundingUserId: req.user._id });
    // let portfolio = []
    console.log(funding);

    //  funding.map(async (f) => {
    //   let camp = await Campaign.findById(f.campaignId);
    //  camp.fundingAmount = f.amount;
    //  console.log('Camp', camp);
    //    portfolio.push(camp);
    //    console.log('portfolio', portfolio);
    //  });
    
    // console.log('Portfolio outside');
    
    return res.status(200).send(funding);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
