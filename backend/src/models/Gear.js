import mongoose from 'mongoose';

const externalSourceSchema = new mongoose.Schema(
  {
    site: { type: String, trim: true },
    url: { type: String, trim: true },
    lastPrice: { type: Number },
    lastCheckedAt: { type: Date },
  },
  { _id: false }
);

const gearSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Laptop',
        'PC',
        'Monitor',
        'Motherboard',
        'CPU',
        'VGA',
        'RAM',
        'SSD',
        'HDD',
        'Case',
        'Fan',
        'PSU',
        'Keyboard',
        'Mouse',
        'Chair',
        'Headphone',
        'Speaker',
        'Handheld',
        'Accessory',
        'Office',
        'PowerBank',
      ],
    },
    brand: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 1 },
    purchaseDate: { type: Date },
    condition: {
      type: String,
      enum: ['new', 'like_new', 'good', 'fair', 'poor'],
      default: 'good',
    },
    notes: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    externalSource: { type: externalSourceSchema, default: {} },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Gear', gearSchema);

