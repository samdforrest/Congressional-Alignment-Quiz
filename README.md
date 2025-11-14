This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Setup Guide

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API docs available at `http://localhost:8000/docs`

## Frontend Setup

1. Install dependencies (from project root):
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root (optional):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   If you don't create this file, it will default to `http://localhost:8000`

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Running Both Servers

You'll need to run both servers simultaneously:

1. **Terminal 1** - Backend:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. **Terminal 2** - Frontend:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /questions` - Returns all quiz questions and answer scale
- `POST /score` - Submits answers and returns coalition scores

## Troubleshooting

- **CORS errors**: Make sure the backend is running and CORS is configured (already set up in `main.py`)
- **Connection refused**: Ensure the backend is running on port 8000
- **Questions not loading**: Check that the backend server is running and accessible at `http://localhost:8000`

