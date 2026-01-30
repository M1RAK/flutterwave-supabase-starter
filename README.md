# 🚀 Flutterwave × Supabase SaaS Starter

A production-ready SaaS starter template with subscription billing powered by Flutterwave and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ Features

- 🔐 **Authentication** - Email/password + OAuth (Google) via Supabase
- 💳 **Subscription Billing** - Flutterwave payment plans with automatic recurring charges
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📊 **User Dashboard** - Subscription management and billing history
- 🔔 **Webhooks** - Real-time payment notifications
- 🛡️ **Type Safe** - Full TypeScript support
- 🚀 **Next.js 15** - App Router, Server Components, API Routes

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
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
git clone https://github.com/yourusername/flutterwave-supabase-starter.git
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

- [Mail]()


---

Made with ❤️ by M1RAK
