import Gear from '../models/Gear.js';

export const getDashboard = async (req, res) => {
  const userId = req.user._id;

  const [summary, byCategory] = await Promise.all([
    Gear.aggregate([
      { $match: { userId, deletedAt: null } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalValue: { $sum: '$price' },
        },
      },
    ]),
    Gear.aggregate([
      { $match: { userId, deletedAt: null } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          value: { $sum: '$price' },
        },
      },
      { $sort: { value: -1 } },
    ]),
  ]);

  res.json({
    totalItems: summary[0]?.totalItems || 0,
    totalValue: summary[0]?.totalValue || 0,
    itemsByCategory: byCategory.map((x) => ({
      category: x._id,
      count: x.count,
      value: x.value,
    })),
  });
};

