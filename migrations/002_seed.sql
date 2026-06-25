USE barna_db;

-- Ethnic groups with sample CDN image URLs (Unsplash)
INSERT IGNORE INTO ethnic_groups (name, slug, description, image, display_order) VALUES
('ترکی آذربایجانی', 'turkish', 'لباس سنتی اقوام ترک آذربایجان با طراحی‌های زیبا و رنگ‌های شاد', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 1),
('لری', 'lori', 'لباس سنتی لرستان با بافت‌های دستی و رنگ‌های طبیعی', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 2),
('جمی (بوشهری)', 'jami', 'لباس سنتی مردم بوشهر با طراحی‌های منحصر به فرد جنوبی', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800', 3),
('ترکمن', 'turkmen', 'لباس‌های زیبای ترکمن با گلدوزی‌های خاص و رنگ‌های درخشان', 'https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=800', 4),
('بندری', 'bandari', 'لباس سنتی بندرعباس با رنگ‌های شاد و طراحی‌های جنوبی', 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800', 5),
('کردی', 'kurdish', 'لباس سنتی کردستان با طراحی‌های زیبا و کمربندهای رنگارنگ', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 6),
('عربی (خوزستانی)', 'arabic', 'لباس سنتی عرب‌های خوزستان با رنگ‌های سفید و طلایی', 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800', 7),
('مدرن', 'modern', 'طراحی‌های مدرن الهام گرفته از لباس‌های سنتی ایرانی', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800', 8),
('تلفیقی', 'fusion', 'ترکیب زیبای لباس‌های سنتی با مدرنیته', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', 9),
('طرح‌های برنا', 'barna-design', 'طراحی‌های اختصاصی مزون برنا با الهام از فرهنگ ایرانی', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', 10);

-- Tags
INSERT IGNORE INTO tags (name, slug) VALUES
('گلدوزی', 'embroidery'),
('دستباف', 'handmade'),
('ابریشم', 'silk'),
('پشم', 'wool'),
('نخ', 'cotton'),
('جشن عروسی', 'wedding'),
('مراسم', 'ceremony'),
('روزانه', 'casual'),
('رنگارنگ', 'colorful'),
('تک‌رنگ', 'monochrome');

-- Clothing with sample images from Unsplash
INSERT IGNORE INTO clothing (name, slug, description, ethnic_group_id, category, gender, size, color, material, era, condition_status, sale_price, rental_price_per_day, deposit_amount, is_for_sale, is_for_rent, is_featured, images) VALUES
(
  'لباس سنتی آذربایجانی زنانه',
  'azerbaijani-women-traditional-1',
  'لباس زیبای سنتی آذربایجان با گلدوزی دستی و رنگ‌های شاد. این لباس از ابریشم اصیل دوخته شده و مناسب مراسم عروسی و جشن‌هاست.',
  (SELECT id FROM ethnic_groups WHERE slug='turkish'),
  'traditional', 'female', 'M', 'قرمز و طلایی', 'ابریشم', '۱۳۵۰-۱۳۶۰', 'excellent',
  8500000, 350000, 2000000, 1, 1, 1,
  '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"]'
),
(
  'لباس لری مردانه',
  'lori-men-traditional-1',
  'لباس سنتی مردانه لرستان با کت بلند و شلوار گشاد. مناسب برای مراسم و جشن‌های محلی.',
  (SELECT id FROM ethnic_groups WHERE slug='lori'),
  'traditional', 'male', 'L', 'قهوه‌ای و کرم', 'پشم و نخ', '۱۳۴۰-۱۳۵۰', 'good',
  6000000, 250000, 1500000, 0, 1, 1,
  '["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"]'
),
(
  'لباس بوشهری زنانه',
  'bushehri-women-1',
  'لباس جمی بوشهر با تزئینات آینه‌کاری و گلدوزی رنگارنگ. این لباس نمادی از فرهنگ دریایی جنوب ایران است.',
  (SELECT id FROM ethnic_groups WHERE slug='jami'),
  'traditional', 'female', 'S', 'آبی و نقره‌ای', 'نخ و آینه', '۱۳۶۰-۱۳۷۰', 'excellent',
  7500000, 300000, 1800000, 1, 1, 0,
  '["https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600"]'
),
(
  'لباس ترکمن زنانه',
  'turkmen-women-1',
  'لباس سنتی ترکمن با گلدوزی‌های باریک و رنگارنگ. تزئینات نقره‌ای اصیل.',
  (SELECT id FROM ethnic_groups WHERE slug='turkmen'),
  'traditional', 'female', 'M', 'سبز و قرمز', 'ابریشم و نقره', '۱۳۵۵-۱۳۶۵', 'good',
  9000000, 400000, 2500000, 1, 1, 1,
  '["https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=600"]'
),
(
  'لباس بندری زنانه',
  'bandari-women-1',
  'لباس رنگارنگ بندرعباس با نقوش هندسی و رنگ‌های شاد. برق و درخشندگی خاص جنوب.',
  (SELECT id FROM ethnic_groups WHERE slug='bandari'),
  'traditional', 'female', 'M', 'بنفش و طلایی', 'نخ و اکریلیک', '۱۳۷۰-۱۳۸۰', 'excellent',
  5500000, 200000, 1200000, 1, 1, 0,
  '["https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600"]'
),
(
  'لباس کردی زنانه',
  'kurdish-women-1',
  'لباس سنتی کردستان با دامن بلند و کمربند رنگارنگ. یکی از زیباترین لباس‌های ایران.',
  (SELECT id FROM ethnic_groups WHERE slug='kurdish'),
  'traditional', 'female', 'M', 'نارنجی و سبز', 'نخ دست‌باف', '۱۳۴۵-۱۳۵۵', 'good',
  7000000, 280000, 1600000, 0, 1, 1,
  '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600","https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600"]'
),
(
  'لباس عربی خوزستانی زنانه',
  'arabic-khuzestani-women-1',
  'لباس سنتی عرب‌های خوزستان با طراحی سفید و نقره‌ای. ظرافت و شکوه خاص.',
  (SELECT id FROM ethnic_groups WHERE slug='arabic'),
  'traditional', 'female', 'L', 'سفید و نقره‌ای', 'نخ و حریر', '۱۳۶۰-۱۳۷۰', 'excellent',
  6500000, 250000, 1500000, 1, 1, 0,
  '["https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600"]'
),
(
  'طرح تلفیقی برنا - آذری مدرن',
  'barna-fusion-azerbaijani-modern-1',
  'ترکیب زیبای طرح‌های سنتی آذری با برش‌های مدرن. طراحی اختصاصی مزون برنا.',
  (SELECT id FROM ethnic_groups WHERE slug='fusion'),
  'fusion', 'female', 'M', 'طلایی و سرمه‌ای', 'کرپ و ابریشم', '۱۴۰۰-۱۴۰۲', 'excellent',
  12000000, 500000, 3000000, 1, 1, 1,
  '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600","https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600"]'
),
(
  'طرح برنا - کمد لباس کردی',
  'barna-wardrobe-kurdish-1',
  'لباس کردی قدیمی که با طراحی و دوخت مجدد برنا به روز شده. عکس قبل و بعد موجود است.',
  (SELECT id FROM ethnic_groups WHERE slug='barna-design'),
  'wardrobe', 'female', 'S', 'زرد و آبی', 'نخ اصیل', 'بازطراحی ۱۴۰۱', 'excellent',
  4500000, 180000, 1000000, 1, 0, 1,
  '["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"]'
),
(
  'لباس مدرن ایرانی - طرح برنا',
  'barna-modern-1',
  'لباس مدرن با نقوش اقوام ایرانی. مناسب مجالس رسمی و نیمه‌رسمی.',
  (SELECT id FROM ethnic_groups WHERE slug='modern'),
  'modern', 'female', 'M', 'کرم و طلایی', 'کرپ شیک', '۱۴۰۲', 'excellent',
  9500000, 380000, 2200000, 1, 1, 1,
  '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600","https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"]'
);

-- Site settings
INSERT IGNORE INTO settings (setting_key, setting_value, setting_type, label, group_name) VALUES
('site_name', 'مزون برنا ایران', 'string', 'نام سایت', 'general'),
('site_description', 'لباس محلی اقوام ایران | طراحی، فروش، امانت', 'string', 'توضیحات سایت', 'general'),
('contact_phone', '09100000000', 'string', 'شماره تماس', 'contact'),
('contact_email', 'info@barna.ir', 'string', 'ایمیل تماس', 'contact'),
('contact_address', 'ایران', 'string', 'آدرس', 'contact'),
('instagram', 'barna_mezon', 'string', 'اینستاگرام', 'social'),
('cleaning_fee_default', '50000', 'number', 'هزینه خشکشویی پیش‌فرض', 'reservation'),
('shipping_fee_default', '30000', 'number', 'هزینه ارسال پیش‌فرض', 'reservation'),
('reservation_rules', 'لباس باید سالم و تمیز بازگردانده شود. هزینه خشکشویی از ودیعه کسر می‌شود. در صورت آسیب به لباس، هزینه تعمیر از ودیعه کسر خواهد شد.', 'string', 'قوانین رزرو', 'reservation');

-- Theme
INSERT IGNORE INTO theme_settings (setting_key, setting_value, label, group_name) VALUES
('color_primary', '#C9A84C', 'رنگ اصلی (طلایی)', 'colors'),
('color_primary_dark', '#A8872A', 'رنگ اصلی تیره', 'colors'),
('color_primary_light', '#E8C97A', 'رنگ اصلی روشن', 'colors'),
('color_accent', '#8B1A2F', 'رنگ تاکیدی (قرمز شرابی)', 'colors'),
('color_accent_dark', '#6B1224', 'رنگ تاکیدی تیره', 'colors'),
('color_gray', '#6B7280', 'خاکستری', 'colors'),
('color_dark', '#1E2A4A', 'تیره (سورمه‌ای)', 'colors'),
('color_background', '#FAF7F2', 'رنگ پس‌زمینه', 'colors'),
('font_fa', 'Vazirmatn', 'فونت فارسی', 'typography'),
('font_en', 'Playfair Display', 'فونت انگلیسی', 'typography');

-- CMS Pages
INSERT IGNORE INTO pages (slug, title, content, meta_title, meta_description) VALUES
('home', 'صفحه اصلی', '{"hero":{"title":"مزون برنا","subtitle":"لباس محلی اقوام ایران"},"featured_title":"لباس‌های ویژه"}', 'مزون برنا | لباس محلی اقوام ایران', 'مزون برنا - فروش، اجاره و طراحی لباس سنتی اقوام ایران'),
('about', 'درباره برنا', '<p>مزون برنا با هدف حفظ و معرفی لباس‌های سنتی اقوام ایران تأسیس شده است. ما با سفر به نقاط مختلف ایران، تحقیق درباره لباس‌های بومی، و همکاری با صنعتگران محلی، این میراث فرهنگی را به نسل جدید معرفی می‌کنیم.</p>', 'درباره مزون برنا', 'آشنایی با مزون برنا و اهداف آن'),
('story', 'داستان برنا', '<p>همه چیز از یک سفر شروع شد. در روستاهای کردستان، لباسی دیدم که نه فقط پارچه بود - بلکه روایتی از نسل‌ها بود. از آن روز تصمیم گرفتم این روایت‌ها را زنده نگه دارم.</p>', 'داستان برنا - از کجا شروع شد', 'سرگذشت مزون برنا'),
('reservation-rules', 'قوانین رزرو', '<h2>قوانین امانت لباس در مزون برنا</h2><ul><li>لباس باید سالم و تمیز بازگردانده شود</li><li>هزینه خشکشویی از ودیعه کسر می‌شود</li><li>در صورت آسیب به لباس، هزینه تعمیر از ودیعه کسر خواهد شد</li><li>مابقی ودیعه ظرف ۷۲ ساعت پس از دریافت لباس بازگردانده می‌شود</li></ul>', 'قوانین رزرو - برنا', 'قوانین و شرایط امانت لباس');

-- Sample comments
INSERT IGNORE INTO comments (clothing_id, guest_name, guest_email, content, status) VALUES
((SELECT id FROM clothing WHERE slug='azerbaijani-women-traditional-1'), 'سارا احمدی', 'sara@example.com', 'لباس بسیار زیبا بود. برای عروسی خواهرم امانت گرفتم و همه تعریف کردند.', 'approved'),
((SELECT id FROM clothing WHERE slug='kurdish-women-1'), 'مریم حسینی', 'maryam@example.com', 'کیفیت عالی و ارسال سریع. ممنون از مزون برنا.', 'approved'),
((SELECT id FROM clothing WHERE slug='barna-fusion-azerbaijani-modern-1'), 'نیلوفر رضایی', 'niloofar@example.com', 'طراحی تلفیقی فوق‌العاده‌ست. دقیقاً همان چیزی بود که می‌خواستم.', 'approved');

-- Sample community post
INSERT IGNORE INTO community_posts (title, content, ethnic_group_id, status) VALUES
('لباس کردی در جشن نوروز', 'در روستای زیبای اورامان، مردم با لباس‌های سنتی کردی نوروز را جشن گرفتند...', (SELECT id FROM ethnic_groups WHERE slug='kurdish'), 'approved'),
('سفر به بندرعباس', 'در سفر به بندرعباس با لباس‌های رنگارنگ و زیبای بندری آشنا شدیم...', (SELECT id FROM ethnic_groups WHERE slug='bandari'), 'approved');
