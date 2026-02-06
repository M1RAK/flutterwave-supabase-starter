-- ============================================
-- Flutterwave Subscription Database Schema
-- ============================================
-- This script creates the necessary tables for managing
-- user subscriptions with Flutterwave payment integration.
--
-- Prerequisites:
-- - Supabase project with auth.users table
-- - uuid-ossp extension (usually enabled by default)
--
-- Usage:
-- 1. Copy this entire script
-- 2. Run it in your Supabase SQL Editor
-- 3. Verify tables are created successfully
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores user profile information
-- Links to Supabase auth.users table

CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
-- Stores subscription information linked to Flutterwave

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  flutterwave_transaction_id text NOT NULL,
  flutterwave_plan_id text NOT NULL,
  flutterwave_subscription_id text,
  flutterwave_customer_id text,
  customer_email text,
  status text NOT NULL,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_key UNIQUE (user_id),
  CONSTRAINT subscriptions_flutterwave_transaction_id_key UNIQUE (flutterwave_transaction_id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_flutterwave_plan_id_idx ON public.subscriptions(flutterwave_plan_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- These policies ensure users can only access their own data

-- Enable RLS on both tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Subscriptions table policies
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for subscriptions table
DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- OPTIONAL: Service role policies for API routes
-- ============================================
-- These allow your API routes to manage subscriptions
-- Only enable if you're using service role key in API routes

-- CREATE POLICY "Service role can manage all users"
--   ON public.users
--   FOR ALL
--   USING (auth.jwt()->>'role' = 'service_role');

-- CREATE POLICY "Service role can manage all subscriptions"
--   ON public.subscriptions
--   FOR ALL
--   USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything was created correctly

-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'subscriptions');

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'subscriptions');

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Set up your environment variables (FLW_SECRET_KEY, etc.)
-- 2. Create your Flutterwave plans
-- 3. Configure your API routes
-- 4. Test the subscription flow
-- ============================================
