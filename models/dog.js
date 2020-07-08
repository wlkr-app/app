const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dogSchema = new Schema({
    name: String,
    breed: String,
    age: Number,
    owner: String,
    gender: {
      type: String,
      enum: ['female', 'male']
    },
    description: String,
    timeslots: [String],
    address: {
      street: String,
      city: String,
      zip: Number,
      houseNumber: Number
    },
    requests: [{
      walkerId: String,
      status: String
    }],
    imgName: String,
    imgPath: String,
    imgPublicId: String
  });

const Dog = mongoose.model('Dog', dogSchema);
module.exports = Dog;