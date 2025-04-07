-- Enable Row Level Security for all tables
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Add owner_id column if not exists
ALTER TABLE notes ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE categories ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Notes table policies
CREATE POLICY "Users can only view their own notes"
  ON notes FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can only insert their own notes"
  ON notes FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can only update their own notes"
  ON notes FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can only delete their own notes"
  ON notes FOR DELETE
  USING (owner_id = auth.uid());

-- Categories table policies  
CREATE POLICY "Users can only view their own categories"
  ON categories FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can only insert their own categories"
  ON categories FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can only update their own categories"
  ON categories FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can only delete their own categories"
  ON categories FOR DELETE
  USING (owner_id = auth.uid());
