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
    walkers: [String],
    description: String,
    timeslots: [String],
    requests: {
      walkerId: String,
      walkerPic: String,
      timeslot: String,
      status: String
    },
    imgName: String,
    imgPath: String,
    imgPublicId: String
  });

const Dog = mongoose.model('Dog', dogSchema);
module.exports = Dog;

    // dog page; shown only for the owner
    // need a pic of a walker, time when it is booked

    // bookings page for the owner to deny requests;
    // bookings page for the walker to check requests send;
    // id of the walker, pic, timeslot