import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  category: String, // CPU | GPU | RAM | SSD
  imageUrl: String,
  specs: Object
});

export default mongoose.model('Product', productSchema);
