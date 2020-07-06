const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  district: String,
  city: String,
  dogs: [{
    type: Schema.Types.ObjectId,
    ref: 'Dog'
  }],

  imgName: String,
  imgPath: String,
  imgPublicId: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;