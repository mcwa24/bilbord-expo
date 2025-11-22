ALTER TABLE banners ADD COLUMN IF NOT EXISTS position INTEGER;

UPDATE banners SET position = id WHERE position IS NULL;
