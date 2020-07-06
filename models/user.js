const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Dog = require('./Dog');
// const Address = require('./Address');


const userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    // name: {
      // type: String,
      // required: true
    // },
    password: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      // required: true
    },
    // address: [ { type : Schema.Types.ObjectId, ref: Address } ],
    // phoneNumber: String,
    type: {
      type: String,
      enum: ['dog-walker', 'dog-owner']
    }
    // dog: [ { type : Schema.Types.ObjectId, ref: 'Dog' } ],
    // imgName: String,
    // imgPath: String,
    // imgPublicId: String,
    // timeslots: [String]
});

const User = mongoose.model('User', userSchema);
module.exports = User;