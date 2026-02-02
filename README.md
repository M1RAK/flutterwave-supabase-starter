# 🚀 Flutterwave × Supabase SaaS Starter

A **production-oriented** SaaS starter template with subscription billing, authentication, and database management.
Built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, Supabase, and Flutterwave.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Flutterwave](https://img.shields.io/badge/Flutterwave-Payments-orange)
---

## 📖 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#️-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [1. Clone Repository](#1-clone-the-repository)
  - [2. Supabase Setup](#2-supabase-setup)
  - [3. Flutterwave Setup](#3-flutterwave-setup)
  - [4. Environment Configuration](#4-environment-configuration)
  - [5. Run Development Server](#5-run-development-server)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Payment & Subscription Flow](#-payment--subscription-flow)
- [Webhook Implementation](#-webhook-implementation)
- [Testing](#-testing)
- [Production Deployment](#-production-deployment)
- [Troubleshooting](#-troubleshooting)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 **Authentication (Supabase Auth)**
- ✅ Email/Password authentication with verification
- ✅ OAuth providers (Google, GitHub - easily extensible)
- ✅ Session management via Supabase Auth
- ✅ Client-side sessions with optional server-side handling via middleware
- ✅ Row-level security (RLS) for data access control
- ✅ Automatic user profile creation via database triggers

### 💳 **Subscription Billing (Flutterwave)**
- ✅ Recurring payment plans (monthly/yearly)
- ✅ Multiple payment methods (cards, bank transfer, USSD, mobile money — configurable)
- ✅ Automatic subscription renewal
- ✅ Webhook-driven subscription lifecycle management
- ✅ Sandbox mode for testing + Production mode for live payments
- ✅ Transaction history and receipt management

### 📊 **User Dashboard**
- ✅ Subscription management (view, upgrade, cancel)
- ✅ Payment history with transaction details
- ✅ Account information and settings
- ✅ Real-time subscription status updates

### 🎨 **Modern UI/UX**
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states and error handling
- ✅ Mobile-first approach

### 🛡️ **Security & Best Practices**
- ✅ Type-safe with TypeScript
- ✅ Environment-based configuration
- ✅ Webhook signature verification
- ✅ CSRF risk minimized via same-site cookies and server-side validation
- ✅ SQL injection prevention with parameterized queries
- ✅ XSS protection with React's built-in escaping

---

## 🎬 Demo

**Live Demo:** [https://flutterwave-supabase-starter.vercel.app](https://flutterwave-supabase-starter.vercel.app)

**Demo Credentials:**
- Test mode is enabled by default
- Use test card: `5531886652142950`, CVV: `564`, Expiry: `09/32`, PIN: `3310`

---

## 🛠️ Tech Stack

| Category             | Technology              | Purpose                                   |
| -------------------- | ----------------------- | ----------------------------------------- |
| **Framework**        | Next.js 16 (App Router) | React framework with SSR & Server Actions |
| **Language**         | TypeScript 5            | Type safety and developer experience      |
| **Styling**          | Tailwind CSS 4          | Utility-first CSS framework               |
| **Authentication**   | Supabase Auth           | Auth, OAuth, session management           |
| **Database**         | PostgreSQL (Supabase)   | Relational database with RLS              |
| **Payments**         | Flutterwave             | Recurring payments & subscriptions        |
| **Deployment**       | Vercel                  | Serverless hosting                        |
| **State Management** | React Hooks             | Client-side state                         |

---

## 🏗️ Architecture Overview

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
├─────────────────────────────────────────────────────────────┤
│                    Next.js Frontend (React)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth Pages │  │ Subscription │  │   Dashboard  │      │
│  │              │  │    Pages     │  │    Pages     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  /api/plans  │  │/api/subscription│ │ /api/webhook │     │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
         ↓ ↑                    ↓ ↑                ↑
┌──────────────────────┐  ┌──────────────────────┐  │
│   Supabase Auth      │  │    Flutterwave API   │  │
│   ┌──────────────┐   │  │   ┌──────────────┐   │  │
│   │ User Sessions│   │  │   │ Payment Plans│   │  │
│   └──────────────┘   │  │   └──────────────┘   │  │
│                      │  │   ┌──────────────┐   │  │
│   Supabase Database  │  │   │ Transactions │   │  │
│   ┌──────────────┐   │  │   └──────────────┘   │  │
│   │    users     │   │  │                      │  │
│   │subscriptions │   │  │   Webhook Events ────┘  │
│   └──────────────┘   │  └──────────────────────┘
└──────────────────────┘
```

### **Data Flow**

1. **User signs up** → Supabase Auth creates account
2. **Database trigger** → Auto-creates user profile in `users` table
3. **User subscribes** → Flutterwave processes payment
4. **Webhook fires** → Updates subscription status in database
5. **User accesses dashboard** → Fetches subscription from database

### **Key Design Decisions**

- **Webhook-First Architecture:** Flutterwave webhooks are the source of truth for subscription state
- **Minimal Database Schema:** Only store essential data; fetch transient data from APIs
- **Automatic Email Handling:** Extracts real emails from Flutterwave sandbox prefixes
- **Environment-Driven Config:** Same codebase works in test and production

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org))
- ✅ **npm** or **yarn** package manager
- ✅ **Git** for version control
- ✅ **Flutterwave account** ([Sign up](https://flutterwave.com/signup))
- ✅ **Supabase account** ([Sign up](https://supabase.com/dashboard/sign-up))
- ✅ **Vercel account** for deployment (optional, [Sign up](https://vercel.com/signup))

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/m1rak/flutterwave-supabase-starter.git
cd flutterwave-supabase-starter
npm install
```

---

### 2. Supabase Setup

#### **Step 2.1: Create a Supabase Project**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in details:
   - **Name:** `flutterwave-saas`
   - **Database Password:** (generate a strong password)
   - **Region:** Choose closest to your users
4. Click **"Create new project"** (takes ~2 minutes)

#### **Step 2.2: Get API Keys**

In your project dashboard, go to **Settings → API** and copy:

- **Project URL**
- **Publishable key** (`sb_publishable_...`)
  → Safe for browser usage
- **Secret key** (`sb_secret_...`)
  → Server-side only, never exposed to the client


#### **Step 2.3: Create Database Schema**

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste this schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table (minimal, webhook-driven)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User relationship (nullable - webhook might fire first)
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Customer identification
  customer_email TEXT NOT NULL,

  -- Flutterwave identifiers
  flutterwave_transaction_id TEXT UNIQUE NOT NULL,
  flutterwave_plan_id TEXT NOT NULL,
  flutterwave_customer_id TEXT,

  -- Subscription state
  status TEXT NOT NULL, -- pending | active | cancelled | expired | failed
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,

  -- Cancellation handling
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_transaction_id ON public.subscriptions(flutterwave_transaction_id);
CREATE INDEX idx_subscriptions_customer_email ON public.subscriptions(customer_email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users read own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. Click **"Run"** to execute the schema

#### **Step 2.4: Configure Authentication Providers**

##### **Email/Password (Already Enabled)**
- Default configuration works out of the box
- Users receive email confirmation links

##### **Google OAuth (Optional)**

1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Get credentials from [Google Cloud Console](https://console.cloud.google.com):
   - Create a project
   - Go to **APIs & Services** → **Credentials**
   - Create **OAuth 2.0 Client ID**
   - Add authorized redirect URI:
     ```
     https://YOUR_PROJECT.supabase.co/auth/v1/callback
     ```
4. Copy **Client ID** and **Client Secret** to Supabase
5. Click **Save**

#### **Step 2.5: Configure Email Templates (Optional)**

1. Go to **Authentication** → **Email Templates**
2. Customize:
   - **Confirm Signup** - Welcome email
   - **Magic Link** - Passwordless login
   - **Reset Password** - Password reset email
3. Add your logo and brand colors

---

### 3. Flutterwave Setup

#### **Step 3.1: Create Flutterwave Account**

1. Go to [Flutterwave Sign Up](https://flutterwave.com/signup)
2. Choose account type:
   - **Individual** (for personal projects)
   - **Business** (for companies)
3. Complete registration and email verification

#### **Step 3.2: Get Test API Keys**

1. Log into [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Ensure you're in **Test Mode** (toggle at top-right)
3. Go to **Settings** → **API Keys**
4. Copy these keys:
   - **Public Key (Test):** `FLWPUBK_TEST-xxxxxxxxxxxxx`
   - **Secret Key (Test):** `FLWSECK_TEST-xxxxxxxxxxxxx`
   - **Encryption Key:** `FLWSECK_TESTxxxxxxxxxxxxx`

#### **Step 3.3: Create Payment Plans**

Payment plans define your subscription tiers (pricing, billing frequency).

1. In Flutterwave Dashboard, go to **Payments** → **Payment Plans**
2. Click **"Create Payment Plan"**
3. Fill in details:

   **Example: Basic Plan**
   ```
   Plan Name: Basic Plan
   Amount: 2000
   Currency: NGN (or USD)
   Interval: monthly
   Duration: 0 (unlimited billing cycles)
   ```

   **Example: Premium Plan**
   ```
   Plan Name: Premium Plan
   Amount: 5000
   Currency: NGN
   Interval: monthly
   Duration: 0
   ```

4. Click **"Create Plan"**
5. **Copy the Plan ID** (e.g., `228925`) - you'll need this

**Repeat** for each subscription tier you want to offer.

#### **Step 3.4: Configure Webhook (Later)**

We'll set up webhooks after deployment. For now, note that you'll need:
- A webhook URL: `https://yourdomain.com/api/webhook`
- A secret hash (random string you generate)

---

### 4. Environment Configuration

#### **Step 4.1: Create Environment File**

```bash
cp .env.example .env.local
```

#### **Step 4.2: Add Your Credentials**

Edit `.env.local` with your actual keys:

```bash
# ============================================
# SUPABASE CONFIGURATION
# ============================================
# Get these from: Supabase Dashboard → Settings → API

# Project URL (e.g., https://xxxxx.supabase.co)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

# Publishable/Anon Key (safe to expose in browser)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key

# Service Role Key (NEVER expose to client - server-side only)
SUPABASE_SECRET_KEY=your_supabase_service_role_key

# ============================================
# FLUTTERWAVE CONFIGURATION (TEST MODE)
# ============================================
# Get these from: Flutterwave Dashboard → Settings → API Keys
# NOTE: Use TEST keys for development

# Public Key (safe to expose in browser)
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_TEST-your_test_public_key

# Secret Key (NEVER expose to client - server-side only)
FLW_SECRET_KEY=FLWSECK_TEST-your_test_secret_key

# Encryption Key (for additional security)
FLW_ENCRYPTION_KEY=FLWSECK_TEST-your_encryption_key

# Webhook Secret (random string - generate your own)
# Used to verify webhook signatures
FLW_SECRET_HASH=your_random_secret_string_here_min_32_chars
```

#### **Step 4.3: Generate Webhook Secret**

Generate a secure random string for `FLW_SECRET_HASH`:

```bash
# On Mac/Linux:
openssl rand -hex 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `FLW_SECRET_HASH`.

---

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**You should see:**
- ✅ Homepage with "Demo Mode" banner
- ✅ Navigation with "Sign In" button
- ✅ Subscription plans page

---

## 🗄️ Database Schema

### **Tables Overview**

| Table           | Purpose                   | Records                             |
| --------------- | ------------------------- | ----------------------------------- |
| `users`         | User profiles             | One per authenticated user          |
| `subscriptions` | Active subscription state | One per user (current subscription) |

### **`users` Table**

Stores user profile information, synced with Supabase Auth.

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY,              -- Links to auth.users(id)
  email TEXT NOT NULL UNIQUE,       -- User's email
  full_name TEXT,                   -- Optional display name
  created_at TIMESTAMPTZ,           -- Account creation date
  updated_at TIMESTAMPTZ            -- Last profile update
);
```

**Automatically created** when a user signs up via the `on_auth_user_created` trigger.

### **`subscriptions` Table**

Stores the current subscription state for each user.

```sql
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY,                       -- Unique subscription ID
  user_id UUID,                              -- Links to users(id) - nullable
  customer_email TEXT NOT NULL,              -- Customer email (for matching)

  -- Flutterwave identifiers
  flutterwave_transaction_id TEXT UNIQUE,    -- Transaction ID (first payment)
  flutterwave_plan_id TEXT,                  -- Plan ID from Flutterwave
  flutterwave_customer_id TEXT,              -- Customer ID in Flutterwave

  -- Subscription lifecycle
  status TEXT,                               -- pending|active|cancelled|expired|failed
  current_period_start TIMESTAMPTZ,          -- Billing period start
  current_period_end TIMESTAMPTZ,            -- Billing period end (next charge date)

  -- Cancellation
  cancel_at_period_end BOOLEAN,              -- Cancel after current period?
  cancelled_at TIMESTAMPTZ,                  -- When cancellation was requested

  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Key Points:**
- **One subscription per user** (active at a time)
- **Webhook-driven updates** - Flutterwave webhooks modify this table
- **User ID nullable** - Webhooks might fire before user lookup completes

### **Subscription Status Flow**

```
pending → active → cancelled
   ↓         ↓         ↓
 failed   expired   expired
```

- **pending:** Payment initiated, awaiting confirmation
- **active:** Subscription active, recurring charges enabled
- **cancelled:** User cancelled, remains active until period ends
- **expired:** Billing period ended, no renewal
- **failed:** Payment failed after retries

---

## 🔐 Authentication Flow

### **Email/Password Sign Up**

```
1. User enters email + password
   ↓
2. Supabase Auth creates account
   ↓
3. Confirmation email sent
   ↓
4. User clicks link
   ↓
5. Database trigger creates user profile
   ↓
6. User can sign in
```

**Code:** `app/auth/signin/page.tsx`

```tsx
const { data, error } = await supabase.auth.signUp({
  email,
  password
})
```

### **Google OAuth**

```
1. User clicks "Sign in with Google"
   ↓
2. Redirected to Google login
   ↓
3. User authorizes app
   ↓
4. Redirected to /auth/callback
   ↓
5. Supabase exchanges code for session
   ↓
6. Database trigger creates user profile
   ↓
7. Redirected to /subscription
```

**Code:** `app/auth/signin/page.tsx`

```tsx
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

### **Session Management**

- **Client-side:** Sessions stored in `localStorage` (managed by Supabase)
- **Server-side:** Sessions verified via HTTP-only cookies
- **Middleware:** Auto-refreshes expired sessions on every request

**Code:** `middleware.ts`

```tsx
export async function middleware(request: NextRequest) {
  return await updateSession(request) // Refreshes session
}
```

---

## 💳 Payment & Subscription Flow

### **Complete Subscription Flow**

```
1. User selects a plan
   ↓
2. Flutterwave payment modal opens
   ↓
3. User enters card details
   ↓
4. 3D Secure authentication (OTP)
   ↓
5. Payment processed by Flutterwave
   ↓
6. Flutterwave fires webhook → /api/webhook
   ↓
7. Webhook creates/updates subscription in database
   ↓
8. User's /api/subscription/verify confirms payment
   ↓
9. User redirected to dashboard
   ↓
10. Dashboard shows active subscription
```

### **Code Walkthrough**

#### **Step 1-4: Frontend Payment Initiation**

**File:** `app/subscription/page.tsx`

```tsx
const handleSubscribe = async (plan: FlutterwavePlan) => {
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
    tx_ref: `SUB-${Date.now()}`, // Unique transaction reference
    amount: plan.amount,
    currency: plan.currency,
    payment_options: 'card,banktransfer,account',
    payment_plan: plan.id, // Flutterwave plan ID
    customer: {
      email: user?.email,
      name: user?.user_metadata?.full_name
    }
  }

  const handleFlutterPayment = useFlutterwave(config)
  handleFlutterPayment({
    callback: async (response) => {
      // Payment successful
      await verifyPayment(response.transaction_id)
    }
  })
}
```

#### **Step 5-7: Webhook Processing**

**File:** `app/api/webhook/route.ts`

```tsx
export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get('verif-hash')

		// Verify webhook signature
		if (!signature || signature !== process.env.FLW_SECRET_HASH) {
			console.error('❌ Invalid webhook signature')
			return NextResponse.json(
				{ error: 'Invalid signature' },
				{ status: 401 }
			)
		}


    // Extract real email (removes sandbox prefix)
  const realEmail = extractRealEmail(event.data.customer.email)

  const event = JSON.parse(payload)

  if (event.event === 'charge.completed') {
    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', realEmail)
      .maybeSingle()

    // Upsert subscription
    await supabase.from('subscriptions').upsert({
      flutterwave_transaction_id: event.data.id,
      flutterwave_plan_id: event.data.plan,
      customer_email: realEmail,
      user_id: user?.id,
      status: 'active',
      current_period_start: new Date(),
      current_period_end: calculateNextBillingDate(event.data)
    }, { onConflict: 'flutterwave_transaction_id' })
  }
}
```

#### **Step 8: Client-Side Verification**

**File:** `app/api/subscription/verify/route.ts`

```tsx
export async function POST(request: Request) {
  const { transactionId } = await request.json()

  // Verify with Flutterwave
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    {
      headers: {
        'Authorization': `Bearer ${FLW_SECRET_KEY}`
      }
    }
  )

  const data = await response.json()

  if (data.status === 'success') {
    // Payment verified!
    return NextResponse.json({ success: true })
  }
}
```

---

## 🔔 Webhook Implementation

### **Why Webhooks?**

Webhooks are **essential** for subscriptions because:
- ✅ Recurring payments happen automatically (user not on your site)
- ✅ Failed payments need to update subscription status
- ✅ Cancellations from Flutterwave dashboard need to sync

### **Webhook Events**

| Event                    | Trigger                | Action                                                 |
| ------------------------ | ---------------------- | ------------------------------------------------------ |
| `charge.completed`       | Successful payment     | Update subscription to `active`, extend billing period |
| `subscription.cancelled` | Subscription cancelled | Update subscription to `cancelled`                     |
| `charge.failed`          | Payment failed         | Update subscription to `failed` (after retries)        |

### **Security: Signature Verification**

**Every webhook request is verified:**

```tsx
		const signature = request.headers.get('verif-hash')

		// Verify webhook signature
		if (!signature || signature !== process.env.FLW_SECRET_HASH) {
			console.error('❌ Invalid webhook signature')
			return NextResponse.json(
				{ error: 'Invalid signature' },
				{ status: 401 }
			)
		}
```

This prevents malicious requests from updating your database.

### **Setup Webhook URL**

**After deploying to production:**

1. Go to Flutterwave Dashboard → **Settings** → **Webhooks**
2. Click **"Add Webhook URL"**
3. Enter: `https://yourdomain.com/api/webhook`
4. Copy the **Secret Hash** and add to your `.env`:
   ```bash
   FLW_SECRET_HASH=the_hash_from_flutterwave_dashboard
   ```
5. Click **"Save"**

---

## 🧪 Testing

### **Test Mode (Sandbox)**

The app comes configured for test mode by default.

#### **Test Cards**

| Card Number      | CVV | Expiry | PIN  | Result     |
| ---------------- | --- | ------ | ---- | ---------- |
| 5531886652142950 | 564 | 09/32  | 3310 | ✅ Success  |
| 5399830851841317 | 883 | 09/32  | 3310 | ❌ Declined |

#### **Testing Flow**

1. **Sign up** with any email (real email not required)
2. **Choose a plan** on `/subscription`
3. **Enter test card** details
4. **Complete 3DS** (simulated OTP in test mode)
5. **View subscription** in dashboard

#### **Verify in Dashboards**

**Supabase:**
- Go to **Table Editor** → `subscriptions`
- Verify subscription record exists with `status: 'active'`

**Flutterwave:**
- Go to **Transactions** tab
- Find your test transaction
- Status should be "Successful"

### ⚠️ Demo Mode Limitation

#### Email Handling in Test Mode

**In test/sandbox mode**, Flutterwave replaces customer emails with your account email. This is normal Flutterwave behavior.

**Example:**
```
You sign up with: user@example.com
Flutterwave returns: ravesb_xxx_your_flutterwave_account@gmail.com
```

**Impact:**
- Subscriptions may not automatically link to the correct user
- Transaction history might not appear in dashboard

**Workaround for Demo:**
When testing the demo:
1. Sign up with the email from your Flutterwave account: `joeschmoe15@gmail.com`
2. OR manually link subscriptions in Supabase after payment

**In Production (Live Mode):**
✅ This limitation does NOT exist
✅ Real customer emails are used
✅ Everything works perfectly

---

## 🚀 Production Deployment

### **Pre-Deployment Checklist**

- [ ] KYC completed in Flutterwave Dashboard
- [ ] Live API keys obtained from Flutterwave
- [ ] Production payment plans created in Flutterwave
- [ ] Terms of Service customized
- [ ] Privacy Policy customized
- [ ] Environment variables set in deployment platform
- [ ] Domain configured with HTTPS

### **Step 1: Complete Flutterwave KYC**

1. Go to **Settings** → **KYC/Business Details**
2. Upload required documents:
   - Business registration (CAC for Nigeria)
   - Director/Owner ID
   - Utility bill / Proof of address
3. Wait for approval (1-3 business days)
4. You'll receive email confirmation

### **Step 2: Get Live API Keys**

1. In Flutterwave Dashboard, **toggle to LIVE mode** (top-right)
2. Go to **Settings** → **API Keys**
3. Copy **Live Public Key** and **Live Secret Key**

### **Step 3: Create Live Payment Plans**

1. While in **LIVE mode**, go to **Payments** → **Payment Plans**
2. Recreate all your test plans (test plan IDs won't work in live mode)
3. Copy the new live plan IDs

### **Step 4: Deploy to Vercel**

#### **Via GitHub (Recommended)**

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

6. Add Environment Variables:
   ```bash
   # Supabase (same as dev)
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Flutterwave (LIVE KEYS)
   NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxx  # NO -TEST
   FLW_SECRET_KEY=FLWSECK-xxxxxxxxxxxxx             # NO -TEST
   FLW_ENCRYPTION_KEY=FLWSECK-xxxxxxxxxxxxx
   FLW_SECRET_HASH=your_webhook_secret
   ```

7. Click **"Deploy"**
8. Wait for build to complete (~2 minutes)
9. Your app is live at `https://your-project.vercel.app`

### **Step 5: Configure Production Webhook**

1. In Flutterwave Dashboard (**LIVE mode**), go to **Settings** → **Webhooks**
2. Add webhook URL:
   ```
   https://your-project.vercel.app/api/webhook
   ```
3. Ensure `FLW_SECRET_HASH` in Vercel matches the webhook secret
4. Click **"Save"**

### **Step 6: Test Production Payment**

**⚠️ Use Real Money - Test with Small Amount!**

1. Visit your production URL
2. Sign up with **real email address**
3. Subscribe to a plan
4. Use **real credit/debit card**
5. **Test with smallest amount** (e.g., ₦500 or $5)
6. Complete 3D Secure (real OTP from bank)
7. Verify:
   - ✅ Payment successful in Flutterwave Dashboard
   - ✅ Subscription appears in your Supabase database
   - ✅ Dashboard shows active subscription
   - ✅ Webhook fired (check Vercel logs)

### **Step 7: Monitor Production**

**Vercel Logs:**
```bash
# View real-time logs
vercel logs your-project --follow
```

**Flutterwave Dashboard:**
- Monitor **Transactions** tab
- Check **Webhook Logs** for delivery status

**Supabase Dashboard:**
- Monitor **Logs** tab for errors
- Check **Table Editor** for subscription records

---

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. "Cardholder Authentication Failed" in Live Mode**

**Cause:** Card not enrolled for 3D Secure, or account not verified.

**Solutions:**
- ✅ Ensure Flutterwave account KYC is **approved**
- ✅ Use card with 3D Secure enabled (call your bank)
- ✅ Try amount ≥ ₦500 (avoid very small amounts)
- ✅ Check transaction error in Flutterwave Dashboard

**Verify Account Status:**
```bash
curl -X GET "https://api.flutterwave.com/v3/payment-plans" \
  -H "Authorization: Bearer YOUR_LIVE_SECRET_KEY"
```

If you get `"Unauthorized"` → Account not approved yet.

---

#### **2. Webhook Not Firing**

**Symptoms:** Payment succeeds but subscription not created in database.

**Debug Steps:**

1. **Check webhook URL is correct:**
   - Flutterwave Dashboard → Settings → Webhooks
   - Should be: `https://yourdomain.com/api/webhook`
   - Must be **HTTPS** (not HTTP)

2. **Verify webhook secret:**
   - `FLW_SECRET_HASH` in `.env` must match Flutterwave dashboard

3. **Check Vercel logs:**
   ```bash
   vercel logs --follow
   ```
   Look for webhook POST requests

4. **Test webhook manually:**
   ```bash
   curl -X POST https://yourdomain.com/api/webhook \
     -H "Content-Type: application/json" \
     -H "verif-hash: test" \
     -d '{"event":"charge.completed","data":{}}'
   ```

5. **Check Flutterwave webhook logs:**
   - Settings → Webhooks → Click on your webhook
   - See delivery attempts and responses

---

#### **3. Email Mismatch (User Not Found)**

**Symptom:** Webhook can't find user, subscription not linked to account.

**Cause:** Email in Flutterwave payment differs from Supabase Auth email.

**Solutions:**
- ✅ Ensure user signs up with **same email** they'll use for payment
- ✅ Check `extractRealEmail()` function is working (removes sandbox prefix)
- ✅ Manually link subscription in database if needed:
   ```sql
   UPDATE subscriptions
   SET user_id = 'user-uuid-here'
   WHERE customer_email = 'user@example.com';
   ```

---

#### **4. Subscription Not Showing in Dashboard**

**Debug:**

1. **Check Supabase database:**
   ```sql
   SELECT * FROM subscriptions WHERE user_id = 'your-user-id';
   ```

2. **Check subscription status:**
   - Should be `'active'` not `'pending'`

3. **Check RLS policies:**
   - User might not have permission to read subscription
   - Verify `user_id` matches `auth.uid()`

4. **Check component logic:**
   - `app/dashboard/subscription/page.tsx`
   - Look for errors in browser console

---

#### **5. "Window is not defined" Error**

**Cause:** Using client-side code in server components.

**Solution:**
- Add `'use client'` directive at top of component
- Ensure `flutterwave-react-v3` only used in client components

```tsx
'use client' // ✅ Add this

import { useFlutterwave } from 'flutterwave-react-v3'
```

---

#### **6. Payment Plans Not Loading**

**Symptoms:** Empty subscription page, no plans displayed.

**Debug:**

1. **Check API route:**
   ```bash
   curl http://localhost:3000/api/plans
   ```

2. **Verify Flutterwave API keys:**
   - Wrong keys = empty response
   - Test vs Live mode mismatch

3. **Check browser console:**
   - Look for fetch errors
   - Network tab → Check `/api/plans` response

4. **Verify plans exist in Flutterwave:**
   - Dashboard → Payments → Payment Plans
   - Must have at least one active plan

---

#### **7. Environment Variables Not Loading**

**Symptoms:** `undefined` errors for `process.env.XXX`

**Solutions:**

1. **Restart dev server** after changing `.env.local`:
   ```bash
   # Stop (Ctrl+C), then restart:
   npm run dev
   ```

2. **Check variable names:**
   - Must start with `NEXT_PUBLIC_` for client-side access
   - Server-side variables don't need prefix

3. **Vercel deployment:**
   - Add variables in Vercel Dashboard → Settings → Environment Variables
   - Redeploy after adding variables

---

## 📚 API Reference

### **Internal API Routes**

| Route                      | Method | Purpose                                  |
| -------------------------- | ------ | ---------------------------------------- |
| `/api/plans`               | GET    | Fetch all payment plans from Flutterwave |
| `/api/plans/[planId]`      | GET    | Fetch single plan details                |
| `/api/subscription/verify` | POST   | Verify payment after user checkout       |
| `/api/subscription/cancel` | POST   | Cancel user's subscription               |
| `/api/transactions`        | GET    | Fetch user's transaction history         |
| `/api/webhook`             | POST   | Receive Flutterwave webhook events       |

### **Flutterwave API Endpoints Used**

| Endpoint                                | Purpose                   |
| --------------------------------------- | ------------------------- |
| `GET /v3/payment-plans`                 | List all payment plans    |
| `GET /v3/payment-plans/:id`             | Get plan details          |
| `GET /v3/transactions/:id/verify`       | Verify transaction        |
| `GET /v3/transactions?customer_email=X` | Get customer transactions |
| `PUT /v3/subscriptions/:id/cancel`      | Cancel subscription       |

**Full Flutterwave API Docs:** [https://developer.flutterwave.com](https://developer.flutterwave.com)

### **Supabase Client Methods**

```tsx
// Authentication
supabase.auth.signUp({ email, password })
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signInWithOAuth({ provider: 'google' })
supabase.auth.signOut()
supabase.auth.getUser()
supabase.auth.getSession()

// Database
supabase.from('users').select('*')
supabase.from('subscriptions').insert({ ... })
supabase.from('subscriptions').update({ ... }).eq('id', id)
```

**Full Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)

---

## 🔒 Security Best Practices

### **Implemented Security Measures**

✅ **Environment Variables**
- Secrets never committed to git
- Server-side keys never exposed to client
- `.env.local` in `.gitignore`

✅ **Webhook Signature Verification**
- HMAC SHA-256 signature validation
- Prevents unauthorized database modifications

✅ **Row-Level Security (RLS)**
- Users can only access their own data
- Database-level security enforcement

✅ **HTTPS Only**
- All production traffic encrypted
- Webhooks require HTTPS

✅ **SQL Injection Prevention**
- Parameterized queries via Supabase client
- No raw SQL from user input

✅ **XSS Protection**
- React's built-in escaping
- No `dangerouslySetInnerHTML`

### **Additional Recommendations**

🔐 **Add Rate Limiting**
```bash
npm install @upstash/ratelimit @upstash/redis
```

🔐 **Add CSRF Protection**
- Use Next.js built-in CSRF tokens for forms

🔐 **Monitor Logs**
- Set up Sentry or LogRocket for error tracking

🔐 **Regular Updates**
```bash
npm audit fix
npm update
```

---

## 📖 Learn More

### **Documentation**

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Flutterwave API Docs](https://developer.flutterwave.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### **Guides**

- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Flutterwave Payment Plans](https://developer.flutterwave.com/docs/recurring-payments)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with descriptive message:**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### **Development Guidelines**

- ✅ Follow TypeScript strict mode
- ✅ Use meaningful variable names
- ✅ Add comments for complex logic
- ✅ Test in both test and live mode
- ✅ Update documentation if needed

---

## 💬 Support & Contact

- **Email:** [abdullahiismail1105@gmail.com](mailto:abdullahiismail1105@gmail.com)
- **GitHub Issues:** [Create an issue](https://github.com/m1rak/flutterwave-supabase-starter/issues)
- **Discussions:** [GitHub Discussions](https://github.com/m1rak/flutterwave-supabase-starter/discussions)

---

## 🙏 Acknowledgments

- **Flutterwave** for payment infrastructure
- **Supabase** for authentication and database
- **Vercel** for hosting platform
- **Next.js** team for the amazing framework
- **Community** for feedback and contributions

---

## 🗺️ Roadmap

### **v1.0 (Current)**
- ✅ Basic authentication
- ✅ Subscription billing
- ✅ User dashboard
- ✅ Webhook integration

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [M1RAK](https://github.com/m1rak)

[Report Bug](https://github.com/m1rak/flutterwave-supabase-starter/issues) • [Request Feature](https://github.com/m1rak/flutterwave-supabase-starter/issues) • [Documentation](https://github.com/m1rak/flutterwave-supabase-starter/wiki)

</div>
