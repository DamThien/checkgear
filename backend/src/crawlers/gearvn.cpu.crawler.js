import axios from 'axios';
import Product from '../models/Product.js';
import PriceHistory from '../models/PriceHistory.js';
import Shop from '../models/Shop.js';

const GEARVN_CPU_COLLECTION_URL = 'https://gearvn.com/collections/cpu-bo-vi-xu-ly';
const GEARVN_API_BASE = 'https://gearvn.com/collections/cpu-bo-vi-xu-ly/products.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const crawlGearVNCpu = async () => {
  console.log('[Crawler] GearVN CPU started (using products.json API)');

  let shop = await Shop.findOne({ name: 'GearVN' });
  if (!shop) {
    shop = await Shop.create({
      name: 'GearVN',
      baseUrl: 'https://gearvn.com',
    });
  }

  let page = 1;
  let crawledCount = 0;
  let hasMore = true;

  while (hasMore) {
    try {
      const apiUrl = `${GEARVN_API_BASE}?page=${page}&limit=48`;
      console.log(`Fetching page ${page}...`);

      const response = await axios.get(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Referer': GEARVN_CPU_COLLECTION_URL,
        },
        timeout: 10000,
      });

      const products = response.data.products || [];

      if (products.length === 0) {
        console.log('No more products. Stopping.');
        hasMore = false;
        break;
      }

      console.log(`Found ${products.length} products on page ${page}`);

      for (const item of products) {
        const name = item.title?.trim();
        if (!name) continue;

        const priceText = item.variants?.[0]?.price;
        if (!priceText) continue;

        const price = Number(priceText.replace(/\D/g, ''));
        if (isNaN(price) || price <= 0) continue;

        const handle = item.handle;
        const productUrl = `https://gearvn.com/products/${handle}`;

        // ===== LẤY LINK ẢNH =====
        // Ưu tiên ảnh chính (featured image)
        let imageUrl = item.image?.src || null;

        // Fallback: lấy ảnh đầu tiên trong mảng images nếu không có image
        if (!imageUrl && item.images?.length > 0) {
          imageUrl = item.images[0].src;
        }

        // Nếu muốn lấy tất cả ảnh (mảng):
        // const allImages = item.images?.map(img => img.src) || [];

        // ===== Upsert Product (thêm imageUrl nếu muốn lưu vào Product) =====
        let product = await Product.findOne({ name, category: 'CPU' });

        if (!product) {
          product = await Product.create({
            name,
            category: 'CPU',
            specs: {},
            imageUrl: imageUrl, // Thêm trường này vào model Product nếu muốn lưu cố định
          });
          console.log(`Created new product: ${name}`);
        } else {
          // Optional: cập nhật ảnh nếu product cũ chưa có
          if (!product.imageUrl && imageUrl) {
            product.imageUrl = imageUrl;
            await product.save();
          }
        }

        // ===== Lưu lịch sử giá (luôn lưu ảnh mới nhất) =====
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingToday = await PriceHistory.findOne({
          productId: product._id,
          shopId: shop._id,
          crawledAt: { $gte: today },
        });

        if (!existingToday || existingToday.price !== price) {
          await PriceHistory.create({
            productId: product._id,
            shopId: shop._id,
            price,
            productUrl,
            imageUrl, // Thêm link ảnh vào lịch sử giá
          });

          const status = existingToday ? '(updated)' : '(new)';
          console.log(`✔ ${name} - ${price.toLocaleString('vi-VN')}₫ ${status}`);
          crawledCount++;
        }
      }

      page++;
      await delay(1000);

    } catch (error) {
      console.error(`Error on page ${page}:`, error.message);
      hasMore = false;
    }
  }

  console.log(`[Crawler] Finished - Updated ${crawledCount} prices`);
};