CREATE TABLE If NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,  
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(100),
    city VARCHAR(100),
    phone_number VARCHAR(20),
    profile TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_created_at ON users (created_at);


CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    address_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    street_address TEXT NOT NULL,
    apartment VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

CREATE TABLE If NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    popular BOOLEAN DEFAULT FALSE,
    category_id INTEGER REFERENCES categories(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    price_unit VARCHAR(50),
    weights VARCHAR(10)[],
    features TEXT[],
    origin VARCHAR(100),
    instructions TEXT,
    ingredients TEXT[],
    images TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX  idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_ingredients ON products USING GIN(ingredients);
CREATE INDEX idx_products_created_at ON products(created_at);


CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    rating INTEGER NOT NULL CHECK (rating IN (1, 2, 3, 4, 5)),
    comment TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id)
);


CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);


CREATE TABLE IF NOT EXISTS viewed_products (
	id SERIAL NOT NULL,
	user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	product_id INTEGER NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id, product_id)
);

CREATE INDEX idx_viewed_products_product_id_user_id ON viewed_products(product_id, user_id);
