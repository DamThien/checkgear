import axios from 'axios';
import Product from '../models/Product.js';
import PriceHistory from '../models/PriceHistory.js';
import Shop from '../models/Shop.js';

// Base URL for GearVN
const GEARVN_BASE_URL = 'https://gearvn.com';

// List of all category URLs to crawl
const CATEGORIES = [
  { path: '/collections/laptop', category: 'Laptop', name: 'Laptop' },
  { path: '/pages/pc-gvn', category: 'PC', name: 'PC Gaming' },
  { path: '/collections/man-hinh', category: 'Monitor', name: 'Màn hình' },
  { path: '/collections/mainboard-bo-mach-chu', category: 'Motherboard', name: 'Mainboard - Bo mạch chủ' },
  { path: '/collections/cpu-bo-vi-xu-ly', category: 'CPU', name: 'CPU - Bộ vi xử lý' },
  { path: '/collections/vga-card-man-hinh', category: 'VGA', name: 'VGA - Card màn hình' },
  { path: '/collections/ram-pc', category: 'RAM', name: 'RAM PC' },
  { path: '/collections/ssd-o-cung-the-ran', category: 'SSD', name: 'SSD - Ổ cứng SSD' },
  { path: '/collections/case-thung-may-tinh', category: 'Case', name: 'Case - Thùng máy tính' },
  { path: '/collections/fan-rgb-tan-nhiet-pc', category: 'Fan', name: 'Fan RGB - Tản nhiệt PC' },
  { path: '/collections/psu-nguon-may-tinh', category: 'PSU', name: 'PSU - Nguồn máy tính' },
  { path: '/collections/ban-phim-may-tinh', category: 'Keyboard', name: 'Bàn phím máy tính' },
  { path: '/pages/chuot-may-tinh', category: 'Mouse', name: 'Chuột máy tính' },
  { path: '/pages/ghe-gaming-gia-re-gearvn', category: 'Chair', name: 'Ghế gaming' },
  { path: '/pages/tai-nghe-may-tinh', category: 'Headphone', name: 'Tai nghe máy tính' },
  { path: '/collections/loa', category: 'Speaker', name: 'Loa' },
  { path: '/collections/may-choi-game-cam-tay-asus', category: ' handheld', name: 'Máy chơi game cầm tay' },
  { path: '/collections/phu-kien', category: 'Accessory', name: 'Phụ kiện' },
  { path: '/collections/thiet-bi-van-phong', category: 'Office', name: 'Thiết bị văn phòng' },
  { path: '/collections/sac-du-phong', category: 'PowerBank', name: 'Sạc dự phòng' },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Crawl a single collection/category from GearVN
 * @param {Object} category - Category object with path, category, and name
 * @param {Object} shop - Shop document
 * @returns {number} - Number of products updated
 */
const crawlCategory = async (category, shop) => {
  const { path, category: categoryName, name: categoryDisplayName } = category;
  
  const collectionUrl = `${GEARVN_BASE_URL}${path}`;
  const apiUrl = `${GEARVN_BASE_URL}${path}/products.json`;
  
  console.log(`\n[Crawler] Starting: ${categoryDisplayName} (${collectionUrl})`);
  
  let crawledCount = 0;
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const pageApiUrl = `${apiUrl}?page=${page}&limit=48`;
      console.log(`  Fetching page ${page}...`);
      
      const response = await axios.get(pageApiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Referer': collectionUrl,
        },
        timeout: 15000,
      });
      
      const products = response.data.products || [];
      
      if (products.length === 0) {
        console.log(`  No more products. Stopping.`);
        hasMore = false;
        break;
      }
      
      console.log(`  Found ${products.length} products on page ${page}`);
      
      for (const item of products) {
        const name = item.title?.trim();
        if (!name) continue;
        
        const priceText = item.variants?.[0]?.price;
        if (!priceText) continue;
        
        const price = Number(priceText.replace(/\D/g, ''));
        if (isNaN(price) || price <= 0) continue;
        
        const handle = item.handle;
        const productUrl = `https://gearvn.com/products/${handle}`;
        
        // Get image URL
        let imageUrl = item.image?.src || null;
        if (!imageUrl && item.images?.length > 0) {
          imageUrl = item.images[0].src;
        }
        
        // Find or create product
        let product = await Product.findOne({ name, category: categoryName });
        
        if (!product) {
          product = await Product.create({
            name,
            category: categoryName,
            specs: {},
            imageUrl: imageUrl,
          });
          console.log(`    Created: ${name}`);
        } else {
          // Update image if missing
          if (!product.imageUrl && imageUrl) {
            product.imageUrl = imageUrl;
            await product.save();
          }
        }
        
        // Save price history
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
            imageUrl,
          });
          
          const status = existingToday ? '(updated)' : '(new)';
          console.log(`    ✓ ${name} - ${price.toLocaleString('vi-VN')}₫ ${status}`);
          crawledCount++;
        }
      }
      
      page++;
      await delay(1000);
      
    } catch (error) {
      console.error(`  Error on page ${page}:`, error.message);
      hasMore = false;
    }
  }
  
  console.log(`[Crawler] Finished: ${categoryDisplayName} - Updated ${crawledCount} prices`);
  return crawledCount;
};

/**
 * Main crawler function - crawls all GearVN categories
 */
export const crawlGearVN = async () => {
  console.log('='.repeat(60));
  console.log('[Crawler] GearVN All Categories Crawler Started');
  console.log('='.repeat(60));
  
  // Find or create shop
  let shop = await Shop.findOne({ name: 'GearVN' });
  if (!shop) {
    shop = await Shop.create({
      name: 'GearVN',
      baseUrl: GEARVN_BASE_URL,
    });
    console.log('[Crawler] Created new shop: GearVN');
  }
  
  let totalUpdated = 0;
  let categoryCount = 0;
  
  for (const category of CATEGORIES) {
    try {
      const updated = await crawlCategory(category, shop);
      totalUpdated += updated;
      categoryCount++;
      
      // Delay between categories to avoid rate limiting
      await delay(2000);
    } catch (error) {
      console.error(`[Crawler] Error crawling ${category.name}:`, error.message);
    }
  }
  
  console.log('='.repeat(60));
  console.log(`[Crawler] Finished - Total: ${categoryCount} categories, ${totalUpdated} prices updated`);
  console.log('='.repeat(60));
  
  return totalUpdated;
};

/**
 * Crawl a single category by path (for manual triggering)
 * @param {string} path - Category path (e.g., '/collections/cpu-bo-vi-xu-ly')
 * @returns {number} - Number of products updated
 */
export const crawlGearVNCategory = async (path) => {
  const category = CATEGORIES.find((c) => c.path === path);
  if (!category) {
    throw new Error(`Category not found: ${path}`);
  }
  
  let shop = await Shop.findOne({ name: 'GearVN' });
  if (!shop) {
    shop = await Shop.create({
      name: 'GearVN',
      baseUrl: GEARVN_BASE_URL,
    });
  }
  
  return crawlCategory(category, shop);
};

/**
 * Get list of supported categories
 * @returns {Array} - List of categories
 */
export const getCategories = () => {
  return CATEGORIES.map(({ path, category, name }) => ({
    path,
    category,
    name,
  }));
};

export default crawlGearVN;