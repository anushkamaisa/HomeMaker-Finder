const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  homemakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Homemaker', required: true },  // Assuming Homemaker is another model
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
