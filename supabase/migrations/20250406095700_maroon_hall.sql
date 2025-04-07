/*
  # Create notes table

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text)
      - `category_id` (uuid, foreign key to categories)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key to users)

  2. Security
    - Enable RLS on `notes` table
    - Add policies for authenticated users to:
      - Create their own notes
      - Read their own notes
      - Update their own notes
      - Delete their own notes
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  category_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create their own notes
CREATE POLICY "Users can create their own notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own notes
CREATE POLICY "Users can view their own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notes
CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own notes
CREATE POLICY "Users can delete their own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);