import axios from 'axios';
import Gear from '../models/Gear.js';
import GearPriceHistory from '../models/GearPriceHistory.js';
import Product from '../models/Product.js';
import PriceHistory from '../models/PriceHistory.js';

const GEARVN_API_BASE = 'https://gearvn.com/search/suggest.json';

export const listCrawledProducts = async (_req, res) => {
  const products = await Product.find({}).sort({ _id: -1 }).lean();

  const items = await Promise.all(
    products.map(async (product) => {
      const latestHistory = await PriceHistory.findOne({ productId: product._id }).sort({ crawledAt: -1 }).lean();
      return {
        _id: product._id,
        name: product.name,
        category: product.category,
        imageUrl: product.imageUrl || latestHistory?.imageUrl || null,
        latestPrice: latestHistory?.price || null,
        productUrl: latestHistory?.productUrl || null,
        crawledAt: latestHistory?.crawledAt || null,
      };
    })
  );

  return res.json(items);
};

export const searchGearVN = async (req, res) => {
  const keyword = (req.query.keyword || '').trim();
  if (!keyword) {
    return res.status(400).json({ message: 'keyword is required' });
  }

  const response = await axios.get(GEARVN_API_BASE, {
    params: {
      q: keyword,
      resources: 'product',
      'resources[type]': 'product',
      section_id: 'predictive-search',
    },
    timeout: 10000,
  });

  const products = response.data?.resources?.results?.products || [];
  const items = products.slice(0, 20).map((item) => ({
    name: item.title,
    price: Number(item.price || 0),
    category: 'CPU',
    source: 'GearVN',
    url: `https://gearvn.com${item.url}`,
    image: item.image,
  }));

  return res.json(items);
};

export const syncExternalPrices = async () => {
  const gears = await Gear.find({
    deletedAt: null,
    'externalSource.site': 'gearvn',
    'externalSource.url': { $exists: true, $ne: '' },
  });

  for (const gear of gears) {
    try {
      const titleKeyword = gear.name.split(' ').slice(0, 6).join(' ');
      const result = await axios.get(GEARVN_API_BASE, {
        params: {
          q: titleKeyword,
          resources: 'product',
          'resources[type]': 'product',
          section_id: 'predictive-search',
        },
        timeout: 10000,
      });

      const products = result.data?.resources?.results?.products || [];
      const found = products.find((p) => `https://gearvn.com${p.url}` === gear.externalSource.url);
      if (!found) continue;

      const latestPrice = Number(found.price || 0);
      if (!latestPrice || latestPrice <= 0) continue;

      if (gear.price !== latestPrice) {
        gear.price = latestPrice;
        gear.externalSource.lastPrice = latestPrice;
        gear.externalSource.lastCheckedAt = new Date();
        await gear.save();
        await GearPriceHistory.create({ gearId: gear._id, price: latestPrice });
      } else {
        gear.externalSource.lastCheckedAt = new Date();
        await gear.save();
      }
    } catch (_error) {
      // ignore single item sync error
    }
  }
};

