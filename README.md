# Promo Studio

A white + mint-green promotional video editor for **Web (Next.js)** and **Android (Flutter)**.

Repository: https://github.com/shanpalia/Promo-Studio

## Project structure

- `website/` — Next.js App Router starter with responsive dashboard, feature cards and template discovery.
- `android/` — Flutter starter with a native home dashboard, workspace shortcuts, template cards and bottom navigation.

## Run the website

```bash
cd website
npm install
npm run dev
```

Open http://localhost:3000.

## Run the Android app

Install Flutter and Android SDK, then:

```bash
cd android
flutter pub get
flutter run
```

## Current milestone

**UI-first starter.** The home screens and navigation foundation are in place. The professional timeline editor, actual media import/render/export, authentication, project persistence, subscription billing, and ad integrations are not implemented yet.

## Planned backend

- Supabase Auth + Postgres for accounts, projects, plans and entitlements.
- Cloudflare R2 for user media and generated exports.
- Website monetization: Monetag only in formats and placements approved for the site.
- Android monetization: AdMob; rewarded duration unlocks must use AdMob Rewarded Ads and server-side verification.

## Environment and security

Copy `.env.example` to a local environment file and fill in public client configuration as needed. Never commit credentials.

- Supabase service-role keys must remain server-side.
- Cloudflare R2 access keys must remain server-side.
- Do not place secrets in the Flutter client or public GitHub repository.
