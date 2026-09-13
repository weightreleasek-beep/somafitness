#!/bin/bash
# SOMA Fitness Studio — Start Script

echo "=== SOMA Fitness Studio ==="

# Start backend
echo "Starting backend on port 8001..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
uvicorn main:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting frontend on port 3001..."
cd frontend
PORT=3001 npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "Backend:  http://localhost:8001"
echo "Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
