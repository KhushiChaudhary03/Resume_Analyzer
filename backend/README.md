# ResumeIQ — Backend

Flask API with authentication, resume analysis, and history tracking.

## Setup

```bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt
python app.py
```

The server starts at **http://127.0.0.1:5000**

## API Endpoints

### Auth
| Method | Route | Body | Auth |
|--------|-------|------|------|
| POST | `/api/register` | `{name, email, password}` | No |
| POST | `/api/login` | `{email, password}` | No |
| POST | `/api/logout` | — | Bearer token |
| GET | `/api/me` | — | Bearer token |

### Analysis
| Method | Route | Body | Auth |
|--------|-------|------|------|
| POST | `/api/analyze` | multipart: `resume` (PDF), `jd` (text), `job_title` (text) | Bearer token |

### History
| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/history` | Bearer token |
| GET | `/api/history/:id` | Bearer token |
| DELETE | `/api/history/:id` | Bearer token |

## Project Structure

```
backend/
├── app.py              # Flask app, routes, auth
├── requirements.txt
├── data/               # Created automatically
│   ├── users.json      # User accounts
│   └── history.json    # Analysis history
├── uploads/            # Temp PDF uploads (auto-deleted)
└── ml/
    ├── __init__.py
    └── matcher.py      # Core analysis engine
```

## Analysis Engine

`ml/matcher.py` performs:
1. **PDF text extraction** via pdfplumber
2. **Role detection** — auto-detects Backend / Frontend / Data Science / DevOps / General from JD keywords
3. **Skill matching** — checks resume for skills from role-specific pack
4. **TF-IDF text similarity** — cosine similarity between resume and JD
5. **ATS score** — weighted formula: skill match (40%) + similarity (30%) + keyword density (20%) + section structure (10%)
6. **Improvement tips** — context-aware suggestions based on gaps

## Production Notes

- Replace file-based user/history store with a proper DB (SQLite → PostgreSQL)
- Use JWT (e.g. `PyJWT`) instead of in-memory token dict
- Add rate limiting with `flask-limiter`
- Store uploads in S3, not local filesystem
- Use `python-dotenv` for secrets
