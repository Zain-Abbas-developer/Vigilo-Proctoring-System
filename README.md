# Vigilo Proctoring System

AI-powered online proctoring platform for secure remote examinations. Vigilo combines a React frontend, Express/MongoDB backend, and Django-based AI service to support exam delivery, identity verification, live monitoring, and post-exam analytics.

![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/API-Express%205-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Django](https://img.shields.io/badge/AI_Service-Django-092E20?logo=django&logoColor=white)

## Core Capabilities

- Exam creation, scheduling, and attempt management
- Role-based experiences for **students**, **teachers**, and **admins**
- Face verification and AI-assisted identity checks
- Webcam and screen monitoring during exam sessions
- Suspicious activity and violation event detection/tracking
- Real-time proctoring updates via Socket.IO
- Analytics dashboards and reporting workflows
- PDF report export support in frontend (`jspdf` + `jspdf-autotable`)

## Architecture & Technology Stack

### Client (`client/`)
- React 19 + Vite + Tailwind CSS
- Route-based role dashboards (student/teacher/admin)
- Real-time integrations using `socket.io-client`

### Server (`server/`)
- Express 5 REST API + Socket.IO gateway
- MongoDB + Mongoose for core exam/user/attempt/violation data
- Authentication, role enforcement, analytics, and reporting endpoints

### AI Service (`AIService/`)
- Python + Django REST service
- Face detection/recognition pipeline (`opencv-python`, `mediapipe`, `insightface`)
- Verification and proctoring assistance endpoints consumed by backend/frontend

## Project Structure

```text
Vigilo-Proctoring-System/
├─ client/        # React + Vite frontend
├─ server/        # Express API + Socket.IO + MongoDB integration
├─ AIService/     # Django AI service for face/proctoring operations
├─ web-photo/     # Existing screenshot artifacts
├─ package.json   # Root scripts (orchestrates full-stack dev)
└─ README.md
```

## Prerequisites

Install the following before setup:

- **Node.js** 18+ and **npm**
- **Python** 3.10+ and **pip**
- **MongoDB** (local instance or hosted cluster)

> Never commit secrets (API keys, JWT secrets, DB credentials) to source control.

## Environment Configuration

### 1) Backend (`server/.env`)

Copy the template and edit values:

```bash
cp server/.env.example server/.env
```

Variables confirmed from the repository:

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `AI_SERVICE_URL`
- `AI_SERVICE_KEY`
- `FACE_MATCH_THRESHOLD`

Also referenced in backend code:

- `FACE_EMBEDDING_ENCRYPTION_KEY` (recommended to set for biometric embedding protection)

### 2) Frontend (`client/.env`)

`client/src/services/api.js` reads:

- `VITE_API_URL` (e.g., `http://localhost:5000/api`)

### 3) AI Service (`AIService/.env`)

Likely variables based on Django settings and AI views (set as needed):

- `DJANGO_SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `MAX_IMAGE_SIZE_MB`
- `AI_SERVICE_KEY`
- `FACE_MATCH_THRESHOLD`

> If names/values differ for your deployment, treat these as placeholders and align with your runtime configuration.

## Installation

From the repository root:

```bash
npm install
npm --prefix client install
npm --prefix server install
```

For AI service:

```bash
cd AIService
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

## Running the Platform

### Start full stack (recommended)

```bash
npm run dev
```

This root command starts:
- Express server (`server`)
- React client (`client`)
- Django AI service (`AIService`)

### Run services individually

```bash
# Terminal 1: Backend API
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev

# Terminal 3: AI service
cd AIService && python manage.py runserver
```

## Build, Lint, and Preview

Frontend scripts:

```bash
cd client
npm run lint
npm run build
npm run preview
```

Backend production start:

```bash
cd server
npm start
```

## Screenshots

Place or replace dashboard screenshots under `docs/images/` using the filenames below.

### Student Dashboard

![Student dashboard showing upcoming exams, status, and system checks](docs/images/student-dashboard.png)

### Teacher Dashboard

![Teacher dashboard showing exam management, attempts, and reports](docs/images/teacher-dashboard.png)

### Admin Analytics

![Admin analytics dashboard showing violations, trends, and monitoring insights](docs/images/admin-analytics.png)

## Security & Privacy Notes

- Webcam/screen capture and face verification involve sensitive personal data.
- Enforce explicit user consent and lawful processing policies in your deployment jurisdiction.
- Keep encryption/signing secrets (`JWT_SECRET`, biometric encryption keys, API keys) in environment variables only.
- Restrict data retention for proctoring events, face embeddings, and exam artifacts.
- Use HTTPS in production and lock down CORS/host settings to trusted origins only.

## Troubleshooting

- **`Missing env vars` on server start**: verify `server/.env` exists and includes required keys (`MONGODB_URI`, `JWT_SECRET`, etc.).
- **Frontend cannot reach API**: confirm `VITE_API_URL` points to the backend API URL.
- **Mongo connection issues**: ensure MongoDB is running and `MONGODB_URI` is correct.
- **AI verification errors**: confirm Python dependencies are installed and AI service is running on the configured URL.
- **CORS/auth socket issues**: align `CLIENT_URL`, backend CORS, and AI `CORS_ALLOWED_ORIGINS` values.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make focused changes and test locally
4. Open a pull request with clear description and verification steps

## License

No open-source license file is currently declared in this repository. If you plan to distribute or reuse this project, add an explicit license file first.
