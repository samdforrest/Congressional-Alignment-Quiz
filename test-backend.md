# Quick Backend Test

To verify your backend is working, follow these steps:

## Step 1: Start the Backend

Open a terminal and run:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## Step 2: Test in Browser

Open these URLs in your browser:

1. **Health check**: http://localhost:8000/
   - Should show: `{"status":"ok","message":"Caucus Compass API is running"}`

2. **Questions endpoint**: http://localhost:8000/questions
   - Should show JSON with questions and answer_scale

3. **API docs**: http://localhost:8000/docs
   - Should show FastAPI interactive documentation

## Step 3: If Backend Won't Start

Check for errors:
- Missing dependencies? Run: `pip install -r requirements.txt`
- Python errors? Check the terminal output
- Port 8000 in use? Change port: `uvicorn main:app --reload --port 8001`
  (Then update `lib/api.ts` to use port 8001)

## Step 4: Test Frontend Connection

Once backend is running, start frontend:
```bash
npm run dev
```

Then check browser console (F12) for any errors.


