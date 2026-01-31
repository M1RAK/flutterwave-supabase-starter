# 🚀 Flutterwave × Supabase SaaS Starter

A production-ready SaaS starter template with subscription billing powered by Flutterwave and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## 🧪 Quick Start: Demo Mode vs Production Mode

This starter works in **both** test and production environments automatically.

### Demo Mode (Current Setup)

The repository comes pre-configured with **test mode** enabled, so you can:

✅ Clone and run immediately
✅ Test subscriptions with test cards (no real money)
✅ See the full workflow without Flutterwave account
✅ Explore all features safely

**Test Card Details:**
- **Card Number:** 5531886652142950
- **CVV:** 564
- **Expiry:** 09/32
- **PIN:** 3310

**Note:** In test mode, Flutterwave adds a prefix to emails (e.g., `ravesb_xxxx_email@gmail.com`). This is handled automatically by our code.

---

### 🚀 Switching to Production

When you're ready to accept real payments:

#### Step 1: Get Live API Keys

1. Complete KYC verification in your [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Go to **Settings** → **API Keys**
3. Switch to **Live** mode (toggle at top)
4. Copy your **Live Public Key** and **Live Secret Key**

#### Step 2: Update Environment Variables

Replace test keys in `.env.local`:

```bash
# Change from TEST to LIVE keys
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxx
FLW_SECRET_KEY=FLWSECK-xxxxxxxxxxxxxxxxxx

# Everything else stays the same
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_key
SUPABASE_SECRET_KEY=your_secret
FLUTTERWAVE_SECRET_HASH=your_webhook_secret
```

#### Step 3: Update Webhook URL

1. In Flutterwave Dashboard → **Settings** → **Webhooks**
2. Change webhook URL from `localhost` to your production domain:
   ```
   https://yourdomain.com/api/webhook
   ```

#### Step 4: Update Payment Plans

Create production payment plans (test plans won't work in live mode):

1. Switch to **Live** mode in Flutterwave Dashboard
2. Go to **Payments** → **Payment Plans**
3. Recreate your plans (Basic, Premium, etc.)
4. Copy the new plan IDs

#### Step 5: Deploy

```bash
git push origin main
# Vercel/Netlify will auto-deploy
```

**That's it!** No code changes needed. The app automatically:
- ✅ Detects live mode from API keys
- ✅ Removes the "Demo Mode" banner
- ✅ Handles real emails (no sandbox prefix)
- ✅ Processes actual payments

---

### 🔍 Verification Checklist

After switching to production:

- [ ] Live mode badge is gone from navigation
- [ ] Real card test successful (use small amount!)
- [ ] Webhook receives real payment notifications
- [ ] Subscription appears in Supabase database
- [ ] User dashboard shows correct plan
- [ ] Emails sent without sandbox prefix

---

### ⚠️ Important Production Notes

1. **Webhook Security**: Ensure `FLUTTERWAVE_SECRET_HASH` is set correctly
2. **SSL Required**: Production must use HTTPS (automatic on Vercel/Netlify)
3. **Test Thoroughly**: Test with small amounts before launching
4. **Compliance**: Ensure Terms of Service and Privacy Policy are customized
5. **Monitoring**: Set up error tracking (Sentry, LogRocket, etc.)

---

### 🆘 Troubleshooting

**Problem:** Payments fail in production
**Solution:** Verify your Flutterwave account is KYC-approved and live mode is enabled

**Problem:** Webhook not firing
**Solution:** Check webhook URL is HTTPS and matches your production domain

**Problem:** Emails don't match
**Solution:** Ensure users sign up with the same email they use for payment

For more help, see [Troubleshooting Guide](docs/troubleshooting.md)

## ✨ Features

- 🔐 **Authentication** - Email/password + OAuth (Google) via Supabase
- 💳 **Subscription Billing** - Flutterwave payment plans with automatic recurring charges
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📊 **User Dashboard** - Subscription management and billing history
- 🔔 **Webhooks** - Real-time payment notifications
- 🛡️ **Type Safe** - Full TypeScript support
- 🚀 **Next.js 15** - App Router, Server Components, API Routes

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **Payments**: Flutterwave
- **Deployment**: Vercel (recommended)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ installed
- Flutterwave account ([Sign up](https://flutterwave.com))
- Supabase account ([Sign up](https://supabase.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/m1rak/flutterwave-supabase-starter.git
cd flutterwave-supabase-starter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

# Flutterwave
NEXT_PUBLIC_FLW_PUBLIC_KEY=your_test_public_key
FLW_SECRET_KEY=your_test_secret_key
FLW_ENCRYPTION_KEY=your_test_encryption_key
FLW_SECRET_HASH=your_webhook_secret
```

4. Set up the database:
Run the SQL migrations in `database/schema.sql` in your Supabase SQL Editor.

The starter uses a minimal, webhook-first architecture:

- `users` - User profiles synced with Supabase Auth
- `subscriptions` - Active subscription state (source of truth: webhooks)

5. Create payment plans:
Go to your Flutterwave Dashboard → Payments → Payment Plans and create your subscription tiers.

6. Run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

### Webhook Setup

1. Deploy your app to production
2. In Flutterwave Dashboard, go to Settings → Webhooks
3. Add your webhook URL: `https://yourdomain.com/api/webhook`
4. Copy the webhook secret to `FLW_SECRET_HASH`

### Testing

Use Flutterwave test cards:
- **Success**: 5531886652142950, CVV: 564, Expiry: 09/32, PIN: 3310
- **Decline**: 5399830851841317, CVV: 883, Expiry: 09/32, PIN: 3310

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 💬 Support

- [Mail](abdullahiismail1105@gmail.com)

```
Made with ❤️ by M1RAK
