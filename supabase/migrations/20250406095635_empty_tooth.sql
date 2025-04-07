/*
  # Create notes and categories tables

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
    - `notes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `category_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create categories table first
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create notes table with foreign key to categories
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  category_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can create their own categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for notes
CREATE POLICY "Users can create their own notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);