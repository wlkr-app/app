const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dogSchema = new Schema({
  name: String,
  gender: { type: String, enum: ['male', 'female'] },
  breed: String,
  age: Number,
  description: String,
  owner: Schema.Types.ObjectId,
  
  imgName: String,
  imgPath: String,
  imgPublicId: String
});

const Dog = mongoose.model("Dog", dogSchema);

module.exports = Dog;