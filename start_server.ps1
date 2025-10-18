& "$PSScriptRoot\.venv\Scripts\Activate.ps1"
& "$PSScriptRoot\.venv\Scripts\python.exe" -m uvicorn server.app:app --reload --port 8000
