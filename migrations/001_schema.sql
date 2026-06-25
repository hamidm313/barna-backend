CREATE DATABASE IF NOT EXISTS barna_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barna_db;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin','user') DEFAULT 'user',
  avatar VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ethnic_groups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clothing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  ethnic_group_id INT,
  category ENUM('traditional','modern','fusion','barna_design','wardrobe') DEFAULT 'traditional',
  gender ENUM('female','male','unisex','child') DEFAULT 'female',
  size VARCHAR(100),
  color VARCHAR(100),
  material VARCHAR(255),
  era VARCHAR(100),
  condition_status ENUM('excellent','good','fair') DEFAULT 'good',
  status ENUM('available','rented','sold','reserved','maintenance') DEFAULT 'available',
  sale_price DECIMAL(12,0),
  rental_price_per_day DECIMAL(12,0),
  deposit_amount DECIMAL(12,0),
  is_for_sale TINYINT(1) DEFAULT 0,
  is_for_rent TINYINT(1) DEFAULT 1,
  is_featured TINYINT(1) DEFAULT 0,
  images JSON,
  before_image VARCHAR(500),
  after_image VARCHAR(500),
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ethnic_group_id) REFERENCES ethnic_groups(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clothing_tags (
  clothing_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (clothing_id, tag_id),
  FOREIGN KEY (clothing_id) REFERENCES clothing(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reservations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  clothing_id INT NOT NULL,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('pending','confirmed','active','returned','cancelled') DEFAULT 'pending',
  deposit_amount DECIMAL(12,0) NOT NULL,
  rental_fee DECIMAL(12,0),
  cleaning_fee DECIMAL(12,0) DEFAULT 0,
  shipping_fee DECIMAL(12,0) DEFAULT 0,
  total_refund DECIMAL(12,0),
  payment_status ENUM('unpaid','deposit_paid','paid','refunded') DEFAULT 'unpaid',
  payment_ref VARCHAR(255),
  tracking_number VARCHAR(255),
  shipping_address TEXT,
  notes TEXT,
  rules_accepted TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (clothing_id) REFERENCES clothing(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT,
  clothing_id INT,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  status ENUM('pending','processing','shipped','delivered','cancelled','returned') DEFAULT 'pending',
  amount DECIMAL(12,0) NOT NULL,
  payment_status ENUM('unpaid','paid','refunded') DEFAULT 'unpaid',
  payment_ref VARCHAR(255),
  shipping_address TEXT,
  tracking_number VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (clothing_id) REFERENCES clothing(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  clothing_id INT,
  content TEXT NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  parent_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (clothing_id) REFERENCES clothing(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(500) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  type ENUM('image','video','document') NOT NULL,
  mime_type VARCHAR(100),
  size INT,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media_tags (
  media_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (media_id, tag_id),
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_published TINYINT(1) DEFAULT 1,
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value LONGTEXT,
  setting_type ENUM('string','number','boolean','json','color') DEFAULT 'string',
  label VARCHAR(255),
  group_name VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS theme_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value VARCHAR(500) NOT NULL,
  label VARCHAR(255),
  group_name VARCHAR(100)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  type ENUM('custom_design','collaboration','information','other') NOT NULL,
  clothing_id INT,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('pending','in_review','responded','closed') DEFAULT 'pending',
  admin_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (clothing_id) REFERENCES clothing(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS community_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(255),
  content TEXT,
  images JSON,
  ethnic_group_id INT,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (ethnic_group_id) REFERENCES ethnic_groups(id) ON DELETE SET NULL
) ENGINE=InnoDB;
