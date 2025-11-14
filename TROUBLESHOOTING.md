# Troubleshooting NetworkError

If you're getting a `NetworkError when attempting to fetch resource`, follow these steps:

## 1. Check if Backend is Running

The most common cause is that the FastAPI backend server isn't running.

**Start the backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

You should see output like:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## 2. Test Backend Directly

Open your browser and go to:
- `http://localhost:8000/docs` - Should show FastAPI documentation
- `http://localhost:8000/questions` - Should return JSON with questions

If these don't work, the backend isn't running or there's a Python error.

## 3. Check Backend Dependencies

Make sure all Python packages are installed:
```bash
cd backend
pip install -r requirements.txt
```

## 4. Check for Python Errors

Look at the terminal where you're running `uvicorn`. If there are import errors or other Python errors, fix those first.

Common issues:
- Missing `quiz_data.py` or `scoring.py` files
- Missing Python packages
- Syntax errors in Python files

## 5. Check CORS Configuration

The backend should have CORS configured in `main.py`. Make sure it includes:
```python
allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
],
```

## 6. Check Browser Console

Open your browser's Developer Tools (F12) and check:
- **Console tab**: Look for detailed error messages
- **Network tab**: See if the request is being made and what the response is

## 7. Verify Ports

- Backend should be on port **8000**
- Frontend should be on port **3000**

If you're using different ports, update:
- `lib/api.ts` - Change `API_BASE_URL` or set `NEXT_PUBLIC_API_URL` environment variable
- `backend/main.py` - Update CORS `allow_origins` to match your frontend URL

## 8. Check Environment Variables

Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then restart the Next.js dev server.

## Quick Checklist

- [ ] Backend server is running (`uvicorn main:app --reload --port 8000`)
- [ ] Backend is accessible at `http://localhost:8000/docs`
- [ ] Frontend is running (`npm run dev`)
- [ ] No Python errors in backend terminal
- [ ] No TypeScript/React errors in frontend terminal
- [ ] Browser console shows helpful error messages


