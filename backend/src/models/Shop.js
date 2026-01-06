import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: String,
  baseUrl: String
});

export default mongoose.model('Shop', shopSchema);