# TrackHire

Track every job application from applied to offer.

Built for the [#BuildQuik Challenge](https://luma.com/cnk0mtop) on QuikDB.

## What it does

TrackHire is a job application tracker that gives you a visual board for every role you apply to. Move applications through five stages:

1. **Applied** — jobs you submitted
2. **Screening** — recruiter screens and first responses
3. **Interview** — calls, tasks, and rounds
4. **Offer** — offers and negotiations
5. **Rejected** — closed opportunities

### Features

- **Visual board** with drag-and-drop between stages
- **Follow-up reminders** for applications stuck for more than 7 days
- **Response rate** and **offer rate** metrics
- **Notes, salary, and job URL** per application
- **AI follow-up writer** powered by DeepSeek
- **Mobile-friendly** stage tabs

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma + Neon Postgres
- Clerk (authentication)
- DeepSeek (AI follow-up generation)
- dnd-kit (drag and drop)

## Run locally

```bash
npm install
cp .env.example .env.local
# fill in CLERK keys, DATABASE_URL, DIRECT_URL, DEEPSEEK_API_KEY
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

DATABASE_URL=
DIRECT_URL=

DEEPSEEK_API_KEY=
```

## Deploy

Deployed on QuikDB Compute. Connect this repo at [compute.quikdb.com](https://compute.quikdb.com), add the env vars above, hit deploy.
