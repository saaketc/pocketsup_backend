const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const  User  = require('../models/user');

// to login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user)
        return res.status(404).send(`User doesn't exists`);
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
        return res.status(400).send('Invalid credentials');
    const token = user.generateToken();
    res.status(200).send(token);
})

// to signup a user
router.post('/signup', async (req, res) => {
    try {
        
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send('User already exists! Login in instead');
        
        user = new User(_.pick(req.body, ['email', 'password', 'firstName', 'lastName']));
        // password hashing
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();
         
        const token = user.generateToken();
        res.header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")

            // to whitelist this header in browser and to get that at client end
            .status(201).send(user);
       
    }
    catch (e) {
        res.status(500).send(e.message);
        console.log(e);
    }
   
})
module.exports = router;