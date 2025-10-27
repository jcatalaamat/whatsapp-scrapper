-- Run this query in Supabase SQL Editor to get your complete table structure
-- Copy the entire output and share it

-- ============================================
-- 1. LIST ALL TABLES
-- ============================================
SELECT
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename;

-- ============================================
-- 2. DETAILED TABLE STRUCTURE
-- ============================================
SELECT
  t.table_schema,
  t.table_name,
  c.column_name,
  c.ordinal_position,
  c.data_type,
  c.character_maximum_length,
  c.is_nullable,
  c.column_default,
  CASE
    WHEN pk.column_name IS NOT NULL THEN 'PRIMARY KEY'
    WHEN fk.column_name IS NOT NULL THEN 'FOREIGN KEY → ' || fk.foreign_table_name || '(' || fk.foreign_column_name || ')'
    ELSE ''
  END as key_info
FROM information_schema.tables t
LEFT JOIN information_schema.columns c
  ON t.table_schema = c.table_schema
  AND t.table_name = c.table_name
LEFT JOIN (
  SELECT
    kcu.table_schema,
    kcu.table_name,
    kcu.column_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  WHERE tc.constraint_type = 'PRIMARY KEY'
) pk
  ON c.table_schema = pk.table_schema
  AND c.table_name = pk.table_name
  AND c.column_name = pk.column_name
LEFT JOIN (
  SELECT
    kcu.table_schema,
    kcu.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
) fk
  ON c.table_schema = fk.table_schema
  AND c.table_name = fk.table_name
  AND c.column_name = fk.column_name
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
ORDER BY
  t.table_name,
  c.ordinal_position;

-- ============================================
-- 3. INDEXES
-- ============================================
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- 4. TABLE ROW COUNTS
-- ============================================
SELECT
  schemaname,
  relname as table_name,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
