-- Create members table
CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('founding', 'premium')),
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending_payment')),
    joined_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    qr_code_url TEXT,
    total_saved INTEGER NOT NULL DEFAULT 0,
    address TEXT,
    birth_date DATE,
    profession TEXT,
    profile_picture_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    verification_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('hospital', 'diagnostic', 'pharmacy')),
    address TEXT NOT NULL,
    discount TEXT NOT NULL,
    phone TEXT NOT NULL,
    logo_text TEXT NOT NULL,
    map_link TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    partner_id TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    partner_name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    saved INTEGER NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create partner requests table
CREATE TABLE IF NOT EXISTS partner_requests (
    id TEXT PRIMARY KEY,
    org_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('hospital', 'diagnostic', 'pharmacy')),
    address TEXT NOT NULL,
    discount TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_transactions_partner_id ON transactions(partner_id);

-- Insert Seed Data (Partners)
INSERT INTO partners (id, name, category, address, discount, phone, logo_text)
VALUES 
('p1', 'পপুলার ডায়াগনস্টিক সেন্টার', 'diagnostic', 'এসএসকে রোড, ফেনী', '১০-৩০% ডিসকাউন্ট', '০৯৬১৩৭৮৭৮০১', 'Popular'),
('p2', 'ল্যাবএইড স্পেশালাইজড হাসপাতাল', 'hospital', 'মিজান রোড, ফেনী', '১০-৩০% ডিসকাউন্ট', '১০৬০৬', 'Labaid'),
('p3', 'লাজ ফার্মা লিমিটেড', 'pharmacy', 'ট্রাঙ্ক রোড, ফেনী', '১০-৩০% ডিসকাউন্ট', '০২-৯৩৪৩৫১৬', 'Lazz'),
('p5', 'ইবনে সিনা ডায়াগনস্টিক সেন্টার', 'diagnostic', 'মহিপাল, ফেনী', '১০-৩০% ডিসকাউন্ট', '০৯৬১০০০৯৬১০', 'Ibn Sina'),
('p6', 'স্কয়ার হাসপাতাল (সিলেক্টেড সুবিধা)', 'hospital', 'গ্র্যান্ড ট্রাঙ্ক রোড, ফেনী', '১০-৩০% ডিসকাউন্ট', '১০৬১৬', 'Square')
ON CONFLICT (id) DO NOTHING;

-- Insert Seed Data (Members)
-- Passwords are hashed representation of "123456" for demo members
INSERT INTO members (id, name, phone, email, password, tier, status, joined_date, expiry_date, total_saved, email_verified)
VALUES
('HC-1001', 'মোঃ আব্দুর রহমান', '01711112222', 'arahman@gmail.com', 'salt:hash1', 'founding', 'active', '2026-01-10', '2027-01-10', 2000, true),
('HC-1002', 'নুসরাত জাহান', '01811112222', 'nusrat@gmail.com', 'salt:hash2', 'premium', 'active', '2026-03-15', '2027-03-15', 300, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Seed Data (Transactions)
INSERT INTO transactions (id, member_id, member_name, partner_id, partner_name, amount, saved, date)
VALUES
('tx1', 'HC-1001', 'মোঃ আব্দুর রহমান', 'p1', 'পপুলার ডায়াগনস্টিক সেন্টার', 5000, 500, '2026-06-12 10:30:00+06'),
('tx3', 'HC-1002', 'নুসরাত জাহান', 'p3', 'লাজ ফার্মা লিমিটেড', 3000, 300, '2026-07-02 13:20:00+06'),
('tx4', 'HC-1001', 'মোঃ আব্দুর রহমান', 'p2', 'ল্যাবএইড স্পেশালাইজড হাসপাতাল', 15000, 1500, '2026-07-10 11:45:00+06')
ON CONFLICT (id) DO NOTHING;

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access to partners directory
CREATE POLICY "Public partners directory is readable by everyone" 
ON partners FOR SELECT USING (true);

-- RLS Policies: Allow public creation of partner requests and contact messages
CREATE POLICY "Anyone can submit partner requests" 
ON partner_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can send contact messages" 
ON contact_messages FOR INSERT WITH CHECK (true);


