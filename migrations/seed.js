require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'barna_db',
    multipleStatements: true,
  });

  // Base seed data (ethnic groups, tags, settings, pages)
  const baseSql = fs.readFileSync(path.join(__dirname, '002_seed.sql'), 'utf8');
  await conn.query(baseSql);
  console.log('Base seed complete');

  // Test users
  const adminHash = await bcrypt.hash('admin123', 12);
  const userHash = await bcrypt.hash('user123', 12);

  await conn.execute(
    'INSERT IGNORE INTO users (name, email, password_hash, phone, role) VALUES (?,?,?,?,?)',
    ['مدیر سیستم', 'admin@barna.ir', adminHash, '09100000000', 'admin']
  );
  await conn.execute(
    'INSERT IGNORE INTO users (name, email, password_hash, phone, role) VALUES (?,?,?,?,?)',
    ['کاربر تست', 'user@barna.ir', userHash, '09200000000', 'user']
  );
  console.log('Test users created: admin@barna.ir / admin123 | user@barna.ir / user123');

  // Sample clothing
  const sampleClothing = [
    {
      name: 'لباس سنتی آذربایجانی زنانه',
      slug: 'azerbaijani-women-traditional-1',
      description: 'لباس زیبای سنتی آذربایجان با گلدوزی دستی و رنگ‌های شاد. این لباس از ابریشم اصیل دوخته شده و مناسب مراسم عروسی و جشن‌هاست.',
      ethnic_group_slug: 'turkish',
      category: 'traditional',
      gender: 'female',
      size: 'M',
      color: 'قرمز و طلایی',
      material: 'ابریشم',
      era: '۱۳۵۰-۱۳۶۰',
      condition_status: 'excellent',
      sale_price: 8500000,
      rental_price_per_day: 350000,
      deposit_amount: 2000000,
      is_for_sale: 1,
      is_for_rent: 1,
      is_featured: 1
    },
    {
      name: 'لباس لری مردانه',
      slug: 'lori-men-traditional-1',
      description: 'لباس سنتی مردانه لرستان با کت بلند و شلوار گشاد. مناسب برای مراسم و جشن‌های محلی.',
      ethnic_group_slug: 'lori',
      category: 'traditional',
      gender: 'male',
      size: 'L',
      color: 'قهوه‌ای و کرم',
      material: 'پشم و نخ',
      era: '۱۳۴۰-۱۳۵۰',
      condition_status: 'good',
      sale_price: 6000000,
      rental_price_per_day: 250000,
      deposit_amount: 1500000,
      is_for_sale: 0,
      is_for_rent: 1,
      is_featured: 1
    },
    {
      name: 'لباس بوشهری زنانه',
      slug: 'bushehri-women-1',
      description: 'لباس جمی بوشهر با تزئینات آینه‌کاری و گلدوزی رنگارنگ. این لباس نمادی از فرهنگ دریایی جنوب ایران است.',
      ethnic_group_slug: 'jami',
      category: 'traditional',
      gender: 'female',
      size: 'S',
      color: 'آبی و نقره‌ای',
      material: 'نخ و آینه',
      era: '۱۳۶۰-۱۳۷۰',
      condition_status: 'excellent',
      sale_price: 7500000,
      rental_price_per_day: 300000,
      deposit_amount: 1800000,
      is_for_sale: 1,
      is_for_rent: 1,
      is_featured: 0
    },
    {
      name: 'لباس ترکمن زنانه',
      slug: 'turkmen-women-1',
      description: 'لباس سنتی ترکمن با گلدوزی‌های باریک و رنگارنگ. تزئینات نقره‌ای اصیل.',
      ethnic_group_slug: 'turkmen',
      category: 'traditional',
      gender: 'female',
      size: 'M',
      color: 'سبز و قرمز',
      material: 'ابریشم و نقره',
      era: '۱۳۵۵-۱۳۶۵',
      condition_status: 'good',
      sale_price: 9000000,
      rental_price_per_day: 400000,
      deposit_amount: 2500000,
      is_for_sale: 1,
      is_for_rent: 1,
      is_featured: 1
    },
    {
      name: 'لباس بندری زنانه',
      slug: 'bandari-women-1',
      description: 'لباس رنگارنگ بندرعباس با نقوش هندسی و رنگ‌های شاد. برق و درخشندگی خاص جنوب.',
      ethnic_group_slug: 'bandari',
      category: 'traditional',
      gender: 'female',
      size: 'M',
      color: 'بنفش و طلایی',
      material: 'نخ و اکریلیک',
      era: '۱۳۷۰-۱۳۸۰',
      condition_status: 'excellent',
      sale_price: 5500000,
      rental_price_per_day: 200000,
      deposit_amount: 1200000,
      is_for_sale: 1,
      is_for_rent: 1,
      is_featured: 0
    },
    {
      name: 'لباس کردی زنانه',
      slug: 'kurdish-women-1',
      description: 'لباس سنتی کردستان با دامن بلند و کمربند رنگارنگ. یکی از زیباترین لباس‌های ایران.',
      ethnic_group_slug: 'kurdish',
      category: 'traditional',
      gender: 'female',
      size: 'M',
      color: 'نارنجی و سبز',
      material: 'نخ دست‌باف',
      era: '۱۳۴۵-۱۳۵۵',
      condition_status: 'good',
      sale_price: 7000000,
      rental_price_per_day: 280000,
      deposit_amount: 1600000,
      is_for_sale: 0,
      is_for_rent: 1,
      is_featured: 1
    },
    {
      name: 'لباس عربی خوزستانی زنانه',
      slug: 'arabic-khuzestani-women-1',
      description: 'لباس سنتی عرب‌های خوزستان با طراحی سفید و نقره‌ای. ظرافت و شکوه خاص.',
      ethnic_group_slug: 'arabic',
      category: 'traditional',
      gender: 'female',
      size: 'L',
      color: 'سفید و نقره‌ای',
      material: 'نخ و حریر',
      era: '۱۳۶۰-۱۳۷۰',
      condition_status: 'excellent',
      sale_price: 6500000,
      rental_price_per_day: 250000,
      deposit_amount: 1500000,
      is_for_sale: 1,
      is_for_rent: 1,
      is_featured: 0
    },
    {
      name: 'طرح تلفیقی برنا - آذری مدرن',
      slug: 'barna-fusion-azerbaijani-modern-1',
      description: 'ترکیب زیبای طرح‌های سنتی آذری با برش‌های مدرن. طراحی اختصاصی مزون برنا.',
      ethnic_group_slug: 'fusion',
      category: 'fusion',
      gender: 'female',
      size: 'M',
      color: 'طلایی و سرمه‌ای',
      material: 'کرپ و ابریشم',
      era: '۱۴۰۰-۱۴۰۲',
      condition_status: 'excellent',
      sale_price: 12000000,
      rental_price_per_day: 500000,
      deposit_amount: 3000000,
      is_for_sale: 1,
      is_for_rent: 1,
      is_featured: 1
    },
    {
      name: 'طرح برنا - کمد لباس کردی',
      slug: 'barna-wardrobe-kurdish-1',
      description: 'لباس کردی قدیمی که با طراحی و دوخت مجدد برنا به روز شده. عکس قبل و بعد موجود است.',
      ethnic_group_slug: 'barna-design',
      category: 'wardrobe',
      gender: 'female',
      size: 'S',
      color: 'زرد و آبی',
      material: 'نخ اصیل',
      era: 'بازطراحی ۱۴۰۱',
      condition_status: 'excellent',
      sale_price: 4500000,
      rental_price_per_day: 180000,
      deposit_amount: 1000000,
      is_for_sale: 1,
      is_for_rent: 0,
      is_featured: 1
    },
    {
      name: 'لباس مدرن ایرانی - طرح برنا',
      slug: 'barna-modern-1',
      description: 'لباس مدرن با نقوش اقوام ایرانی. مناسب مجالس رسمی و نیمه‌رسمی.',
      ethnic_group_slug: 'modern',
      category: 'modern',
      gender: 'female',
      size: 'M',
      color: 'کرم و طلایی',
      material: 'کرپ شیک',
      era: '۱۴۰۲',
      condition_status: 'excellent',
      sale_price: 9500000,
      rental_price_per_day: 380000,
      deposit_amount: 2200000,
      is_for_sale: 1,
      is_for_rent: 1,
      is_featured: 1
    }
  ];

  for (const item of sampleClothing) {
    const [eg] = await conn.execute('SELECT id FROM ethnic_groups WHERE slug = ?', [item.ethnic_group_slug]);
    const egId = eg.length ? eg[0].id : null;
    await conn.execute(
      `INSERT IGNORE INTO clothing (name, slug, description, ethnic_group_id, category, gender, size, color, material, era, condition_status, sale_price, rental_price_per_day, deposit_amount, is_for_sale, is_for_rent, is_featured, images) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [item.name, item.slug, item.description, egId, item.category, item.gender, item.size, item.color, item.material, item.era, item.condition_status, item.sale_price, item.rental_price_per_day, item.deposit_amount, item.is_for_sale, item.is_for_rent, item.is_featured, JSON.stringify([])]
    );
  }
  console.log(`${sampleClothing.length} sample clothing items created`);

  // Sample community post
  await conn.execute(
    'INSERT IGNORE INTO community_posts (title, content, ethnic_group_id, status) VALUES (?,?,(SELECT id FROM ethnic_groups WHERE slug="kurdish" LIMIT 1),?)',
    ['لباس کردی در جشن نوروز', 'در روستای زیبای اورامان، مردم با لباس‌های سنتی کردی نوروز را جشن گرفتند...', 'approved']
  );

  console.log('\n=== TEST CREDENTIALS ===');
  console.log('Admin: admin@barna.ir / admin123');
  console.log('User:  user@barna.ir  / user123');
  console.log('========================');

  await conn.end();
}

seed().catch(console.error);
