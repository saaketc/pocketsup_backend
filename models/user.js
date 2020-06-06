const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  password: String,
  moderator: { type: Boolean, default: false }
});
// user access token generation
// set key using config & env variable 

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id, firstName: this.firstName, lastName: this.lastName }, "jwtKeyForHive");
  return token;
}    
const User = mongoose.model("User", userSchema);
module.exports = User;
