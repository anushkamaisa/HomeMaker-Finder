const mongoose = require('mongoose');
const Food = require('./models/Food');

mongoose.connect('mongodb://127.0.0.1:27017/food', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');

  const testFood = new Food({ name: 'Paneer Butter Masala', price: 180 });

  return testFood.save();
})
.then(() => {
  console.log('🍽️ Sample food item saved');
  mongoose.disconnect(); // Close connection after saving
})
.catch(err => {
  console.error('❌ Error:', err);
});
