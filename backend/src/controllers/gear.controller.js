import Gear from '../models/Gear.js';
import GearPriceHistory from '../models/GearPriceHistory.js';

const buildFilters = (query) => {
  const filters = { deletedAt: null };

  if (query.search) {
    filters.name = { $regex: query.search, $options: 'i' };
  }

  if (query.brand) {
    filters.brand = { $regex: query.brand, $options: 'i' };
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.condition) {
    filters.condition = query.condition;
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }

  return filters;
};

const resolveSort = (sort) => {
  switch (sort) {
    case 'price':
      return { price: 1 };
    case '-price':
      return { price: -1 };
    case 'name':
      return { name: 1 };
    case '-name':
      return { name: -1 };
    case 'createdAt':
      return { createdAt: 1 };
    default:
      return { createdAt: -1 };
  }
};

export const createGear = async (req, res) => {
  const { name, category, price } = req.body;
  if (!name || !category || !price || Number(price) <= 0) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const gear = await Gear.create({
    userId: req.user._id,
    name,
    category,
    brand: req.body.brand || '',
    price: Number(price),
    purchaseDate: req.body.purchaseDate || null,
    condition: req.body.condition || 'good',
    notes: req.body.notes || '',
    imageUrl: req.body.imageUrl || '',
    externalSource: req.body.externalSource || {},
  });

  await GearPriceHistory.create({ gearId: gear._id, price: gear.price });
  return res.status(201).json(gear);
};

export const listGears = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 50);
  const skip = (page - 1) * limit;

  const filters = {
    userId: req.user._id,
    ...buildFilters(req.query),
  };

  const [items, total] = await Promise.all([
    Gear.find(filters).sort(resolveSort(req.query.sort)).skip(skip).limit(limit),
    Gear.countDocuments(filters),
  ]);

  res.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const updateGear = async (req, res) => {
  const gear = await Gear.findOne({
    _id: req.params.id,
    userId: req.user._id,
    deletedAt: null,
  });

  if (!gear) {
    return res.status(404).json({ message: 'Gear not found' });
  }

  const prevPrice = gear.price;
  Object.assign(gear, req.body);
  if (req.body.price !== undefined) {
    gear.price = Number(req.body.price);
  }

  await gear.save();

  if (gear.price !== prevPrice) {
    await GearPriceHistory.create({ gearId: gear._id, price: gear.price });
  }

  return res.json(gear);
};

export const deleteGear = async (req, res) => {
  const gear = await Gear.findOne({
    _id: req.params.id,
    userId: req.user._id,
    deletedAt: null,
  });

  if (!gear) {
    return res.status(404).json({ message: 'Gear not found' });
  }

  gear.deletedAt = new Date();
  await gear.save();
  return res.json({ message: 'Deleted successfully' });
};

export const getGearPriceHistory = async (req, res) => {
  const gear = await Gear.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!gear) {
    return res.status(404).json({ message: 'Gear not found' });
  }

  const history = await GearPriceHistory.find({ gearId: gear._id }).sort({ recordedAt: -1 });
  return res.json(history);
};

