const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  grade: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = { Student };