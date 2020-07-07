const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dogSchema = new Schema({
    name: String,
    breed: String,
    age: Number,
    gender: {
      type: String,
      enum: ['female', 'male']
    },
    description: String,
    timeslots: [String],
    imgName: String,
    imgPath: String,
    imgPublicId: String
  });

const Dog = mongoose.model('Dog', dogSchema);
module.exports = Dog;