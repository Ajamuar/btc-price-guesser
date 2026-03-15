# BTC Price Guesser

Guess if Bitcoin (BTC/USD) goes **up** or **down** after one minute. Sign in to play and track your score.

**Live app:** [https://btc-price-guesser.vercel.app/](https://btc-price-guesser.vercel.app/)

---

## About the game

BTC Price Guesser is a web app where signed-in users guess whether the market price of Bitcoin will be higher or lower one minute after placing their guess. You see your current score and the latest BTC price at all times. After each guess, you wait for it to resolve before making another; your score updates and persists so you can close the browser and return later.

**Flow:** Land on the home page (rules + Play) → sign in with Google or email/password → open the Play page with live price, chart, score, and **Up** / **Down** buttons. Submit one guess at a time; when it resolves, you get feedback (win/loss/tie) and can guess again. Leaderboard and History tabs on the play screen let you see top players and your past guesses.

---

## Rules

- **Guess:** Choose **up** or **down** — you're predicting whether the price will be higher or lower **after 1 minute**.
- **Resolution:**
  - If **at least 60 seconds** have passed **and** the price has **changed** from the price at guess time → the guess is resolved as **win** or **loss**.
  - If the price has **not** changed by **2 minutes** → the guess is resolved as a **tie**.
- **Scoring:** Correct guess **+1**, wrong guess **-1**, tie **0**. New players start at 0. Score is saved per account.
- **One guess at a time:** You cannot submit a new guess until the current one is resolved.
- **Sign in required** to play; score and history are tied to your account.

---

## Demo

A short walkthrough of the game: home page, sign-in, play screen with live price and chart, placing a guess, and resolution.

**Demo video**

<!-- Replace the link below with your demo video URL (e.g. Loom, YouTube, Vimeo) -->
*Add your demo video link or embed here.*

---

## Tech stack

| Area | Technologies |
|------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4, Radix UI, Recharts |
| **Backend / API** | Next.js API routes, NextAuth (Google + Credentials) |
| **Data** | AWS DynamoDB (profiles, scores, pending guesses, leaderboard, guess history); AWS SDK v3 |
| **Price data** | Binance Spot (BTCUSDT) for live and historical price; optional Lambda proxy when Binance blocks server IPs |
| **Testing** | Jest (unit), Playwright (E2E) |
| **Deploy** | Vercel; see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full checklist |

---

## Run locally

### Prerequisites

- **Node.js** 18+ (or the version your project supports)
- **npm** or **yarn**
- **AWS DynamoDB** table created (see [docs/phase-1/PHASE_1_DYNAMODB.md](docs/phase-1/PHASE_1_DYNAMODB.md) for schema and GSI)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd btc-price-guesser
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values (never commit `.env.local`):

| Variable | Description |
|----------|-------------|
| `AWS_REGION` | AWS region of your DynamoDB table (e.g. `ap-south-1`, `us-east-1`) |
| `AWS_ACCESS_KEY_ID` | IAM access key for DynamoDB |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `DYNAMODB_TABLE_NAME` | Table name (e.g. `btc-guesser`) |
| `NEXTAUTH_URL` | App URL for local: `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random secret, 32+ characters (e.g. `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional for local; required for “Sign in with Google” |
| `E2E_TEST_USER_EMAIL` / `E2E_TEST_USER_PASSWORD` | Optional; for Playwright authenticated E2E tests |
| `BINANCE_KLINES_PROXY_URL` | Optional; Lambda proxy URL if Binance blocks direct requests |

### 3. Run the app

**Development:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Production build:**

```bash
npm run build
npm run start
```

**Lint:**

```bash
npm run lint
```

**Tests:**

```bash
npm test              # unit tests (Jest)
npm run e2e           # E2E (Playwright; uses .env.local, optional E2E credentials)
```

---

## Deployment

For deploying to Vercel and configuring AWS (DynamoDB, IAM), Google OAuth, and environment variables, see **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.
