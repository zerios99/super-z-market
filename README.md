🛒 Super Z Market
Super Z Market is a modern e-commerce platform built with Next.js 15, Payload CMS, and MongoDB.
It features a clean UI, real-time data fetching, authentication, and an admin panel for managing products, categories, and orders.

---

📦 Tech Stack
Frontend
Next.js 15 – App Router & Server Components

React 19 + TypeScript

Tailwind CSS 4 + tailwind-merge

Radix UI – Accessible UI primitives

Lucide Icons – SVG icons

Embla Carousel – Interactive product sliders

Backend & API
Payload CMS – Headless CMS & Admin Dashboard

MongoDB – Database

TRPC – Type-safe API communication

Zod – Schema validation

React Query – Data fetching & caching

Utilities
date-fns – Date formatting

clsx – Conditional class handling

SuperJSON – Enhanced JSON serialization

---

🚀 Getting Started
1️⃣ Clone the Repository
bash


git clone https://github.com/yourusername/super-z-market.git
cd super-z-market
2️⃣ Install Dependencies
bash


npm install
# or
yarn install
# or
pnpm install
# or
bun install
3️⃣ Set Up Environment Variables
Create a .env file in the root directory and configure:

env


DATABASE_URI=mongodb+srv://your-connection-string
PAYLOAD_SECRET=your-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
4️⃣ Run the Development Server
bash


npm run dev
# or
yarn dev
# or
bun dev
Visit http://localhost:3000.

🛠 Available Commands
Command	Description
npm run dev	Start the development server
npm run build	Build the app for production
npm start	Start the production server
npm run lint	Run ESLint for code quality
npm run generate:types	Generate Payload CMS TypeScript types
npm run db:fresh	Reset and migrate database
npm run db:seed	Seed database with initial data

---

## 📂 Project Structure

```
.
├── app/                # Next.js App Router pages & layouts
├── payload/            # Payload CMS configuration
├── public/              # Static assets
├── styles/              # TailwindCSS styles
├── src/seed.ts          # Database seed script
└── README.md            # Documentation

```

---

## ✏ Editing

You can start editing the UI by modifying:

```
app/page.tsx
```

Changes are automatically reflected in the browser.

---

## 📚 Learn More

* 📄 [Next.js Documentation](https://nextjs.org/docs) – Learn about features and APIs.
* 🎓 [Interactive Next.js Tutorial](https://nextjs.org/learn) – Step-by-step guide to building with Next.js.
* 💻 [Next.js GitHub](https://github.com/vercel/next.js) – Contribute to the project.

---

## ☁ Deployment

Deploy your app instantly with **[Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)** – creators of Next.js.

📖 [Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 🏆 Author

Made with ❤️ using Next.js and TypeScript.

---
