USE barna_db;

INSERT INTO ethnic_groups (name, slug, description, display_order) VALUES
('ترکی آذربایجانی', 'turkish', 'لباس سنتی اقوام ترک آذربایجان با طراحی‌های زیبا و رنگ‌های شاد', 1),
('لری', 'lori', 'لباس سنتی لرستان با بافت‌های دستی و رنگ‌های طبیعی', 2),
('جمی (بوشهری)', 'jami', 'لباس سنتی مردم بوشهر با طراحی‌های منحصر به فرد جنوبی', 3),
('ترکمن', 'turkmen', 'لباس‌های زیبای ترکمن با گلدوزی‌های خاص و رنگ‌های درخشان', 4),
('بندری', 'bandari', 'لباس سنتی بندرعباس با رنگ‌های شاد و طراحی‌های جنوبی', 5),
('کردی', 'kurdish', 'لباس سنتی کردستان با طراحی‌های زیبا و کمربندهای رنگارنگ', 6),
('عربی (خوزستانی)', 'arabic', 'لباس سنتی عرب‌های خوزستان با رنگ‌های سفید و طلایی', 7),
('مدرن', 'modern', 'طراحی‌های مدرن الهام گرفته از لباس‌های سنتی ایرانی', 8),
('تلفیقی', 'fusion', 'ترکیب زیبای لباس‌های سنتی با مدرنیته', 9),
('طرح‌های برنا', 'barna-design', 'طراحی‌های اختصاصی مزون برنا با الهام از فرهنگ ایرانی', 10);

INSERT INTO tags (name, slug) VALUES
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

INSERT INTO settings (setting_key, setting_value, setting_type, label, group_name) VALUES
('site_name', 'مزون برنا ایران', 'string', 'نام سایت', 'general'),
('site_description', 'لباس محلی اقوام ایران | طراحی، فروش، امانت', 'string', 'توضیحات سایت', 'general'),
('contact_phone', '09000000000', 'string', 'شماره تماس', 'contact'),
('contact_email', 'info@barna.ir', 'string', 'ایمیل تماس', 'contact'),
('contact_address', 'ایران', 'string', 'آدرس', 'contact'),
('instagram', 'barna_mezon', 'string', 'اینستاگرام', 'social'),
('cleaning_fee_default', '50000', 'number', 'هزینه خشکشویی پیش‌فرض', 'reservation'),
('shipping_fee_default', '30000', 'number', 'هزینه ارسال پیش‌فرض', 'reservation'),
('reservation_rules', 'لباس باید سالم بازگردانده شود. هزینه خشکشویی از ودیعه کسر می‌شود.', 'string', 'قوانین رزرو', 'reservation');

INSERT INTO theme_settings (setting_key, setting_value, label, group_name) VALUES
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

INSERT INTO pages (slug, title, content, meta_title, meta_description) VALUES
('home', 'صفحه اصلی', '{}', 'مزون برنا | لباس محلی اقوام ایران', 'مزون برنا - فروش، اجاره و طراحی لباس سنتی اقوام ایران'),
('about', 'درباره برنا', '<p>مزون برنا با هدف حفظ و معرفی لباس‌های سنتی اقوام ایران تاسیس شده است.</p>', 'درباره مزون برنا', 'آشنایی با مزون برنا و اهداف آن'),
('story', 'داستان برنا', '<p>همه چیز از یک سفر شروع شد...</p>', 'داستان برنا', 'از کجا شروع شد'),
('reservation-rules', 'قوانین رزرو', '<p>قوانین امانت لباس در مزون برنا</p>', 'قوانین رزرو - برنا', 'قوانین و شرایط امانت لباس');
