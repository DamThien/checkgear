import mongoose from 'mongoose';

const gearPriceHistorySchema = new mongoose.Schema(
  {
    gearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gear',
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('GearPriceHistory', gearPriceHistorySchema);

