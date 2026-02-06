# Flutterwave X Supabase Subscription Setup Guide

## Prerequisites
- Supabase account and project
- Flutterwave account
- Node.js project with Next.js

## Step 1: Database Setup
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the entire migration script
4. Click "Run"
5. Verify tables were created successfully

## Step 2: Flutterwave Setup
1. Log in to Flutterwave dashboard
2. Create your payment plans (e.g., Basic, Premium)
3. Note down the plan IDs
4. Generate your API keys (public and secret)
5. Set up webhook URL: `https://yourdomain.com/api/webhook`
6. Generate a webhook secret hash

## Step 3: Environment Variables
Create `.env.local` with your keys (see template above)

## Step 4: Test
1. Run your Next.js app
2. Sign up as a test user
3. Subscribe to a plan
4. Verify subscription appears in database

## Troubleshooting
- **Webhook not firing**: Check your secret hash matches
- **Database errors**: Ensure RLS policies are correct
- **Payment fails**: Verify API keys are correct
