-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Friendships table
CREATE TABLE friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  friend_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, friend_id)
);

-- Referrals table
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  brand_name TEXT NOT NULL,
  website_url TEXT,
  referral_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their friends' profiles" ON profiles
  FOR SELECT USING (
    id = auth.uid() OR 
    id IN (SELECT friend_id FROM friendships WHERE user_id = auth.uid()) OR
    id IN (SELECT user_id FROM friendships WHERE friend_id = auth.uid())
  );
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for friendships
CREATE POLICY "Users can view their friendships" ON friendships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can insert friendships" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for referrals
CREATE POLICY "Users can view their own and friends' referrals" ON referrals
  FOR SELECT USING (
    user_id = auth.uid() OR
    user_id IN (SELECT friend_id FROM friendships WHERE user_id = auth.uid() AND status = 'accepted') OR
    user_id IN (SELECT user_id FROM friendships WHERE friend_id = auth.uid() AND status = 'accepted')
  );
CREATE POLICY "Users can insert their own referrals" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own referrals" ON referrals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own referrals" ON referrals
  FOR DELETE USING (auth.uid() = user_id);
