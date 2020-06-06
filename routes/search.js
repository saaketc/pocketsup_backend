const router = require('express').Router();
const Campaign = require('../models/campaign');


// To search a term
router.get('/:searchTerm', async (req, res) => {
    
    try {
        let results = [];
        let searchTerm = req.params.searchTerm;
        searchTerm = searchTerm.trim();

        if (!searchTerm)
            return res.status(200).send(results);
        
      results = await Campaign.find({
        $text:
        {
            $search: searchTerm,
            $caseSensitive: false,
            $diacriticSensitive: true
        }
    },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.status(200).send(results);   
    }   
    catch (e) {
        res.status(500).send(e.message);
        console.log(e.message);
  }  
});

module.exports = router;