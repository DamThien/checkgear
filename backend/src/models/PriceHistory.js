import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  shopId: mongoose.Schema.Types.ObjectId,
  price: Number,
  productUrl: String,
  crawledAt: { type: Date, default: Date.now }
});

export default mongoose.model('PriceHistory', priceHistorySchema);
