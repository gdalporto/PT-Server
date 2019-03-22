'use strict';

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const allowableConditions = ["Shoulder", "Upper Back", "Lower Back"]
const allowableTreatments = ["Shoulder Rolls", "Crunches", "Leg Lifts"]

// Schema for User
const userSchema = mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  condition: {type: String, required: true},
  treatments: [{type: String, enum: allowableTreatments}],
  log: {type: Array, required: false}
  });

// const logSchema = mongoose.Schema({
//   user: { type: Schema.Types.ObjectId, ref: 'User' },
//   date: {type:Date, required: true},
//   complete: [{type:String, enum: allowableTreatments}],
//   incomplete: [{type:String, enum: allowableTreatments}]
// })

// Schema for Treatments
const treatmentSchema = mongoose.Schema({
})

// Schema for Conditions

const conditionSchema = mongoose.Schema({
})

userSchema.methods.serialize = function() {

  return {
    id: this._id,
    username: this.username,
    condition: this.condition,
    treatments: this.treatments,
    log: this.log
  };
};


userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};



const User = mongoose.model('User', userSchema);
const Treatment = mongoose.model('Treatment', treatmentSchema);
const Condition = mongoose.model('Condition', conditionSchema);
module.exports = {User, Treatment, Condition};
