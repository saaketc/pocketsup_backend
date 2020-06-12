const router = require('express').Router();
const Campaign = require('../models/campaign');
const Funding = require('../models/funding');
const NonProfitBucket = require('../models/nonProfitBucket');

router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find({});
        let ngoBucket = [];
        let refundBucket = [];
        let exact = []
        campaigns.map( async campaign => {
            if (new Date().getTime() > new Date(campaign.endDate).getTime()) {
                if (campaign.fundRaised > campaign.goalAmount) {
                    ngoBucket.push(campaign);
                   let nf =  await new NonProfitBucket({
                        campaignId: campaign._id,
                        amount: 0.01 * campaign.fundRaised,
                        date: new Date()
                   });
                    await nf.save();
                }

                else if (campaign.fundRaised < campaign.goalAmount) {
                    refundBucket.push(campaign);
                    let refCamps = await Funding.find({ campaignId: campaign._id });
                    for (let c of refCamps) {
                        c.status = 'refund';
                        c.save();
                    }
            }
           
                else {
                    exact.push(campaign);
                    let exCamps = await Funding.find({ campaignId: campaign._id });
                    for (let c of exCamps) {
                        c.status = 'success';
                        c.save();
                    }
                }
            }
            return 1
        })
        return res.status(200).send({ngoBucket, refundBucket, exact});
    }
    catch (e) {
        return res.status(500).send(e.message);
    }

});

module.exports = router;
