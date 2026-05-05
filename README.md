# Payout Management MVP Backend

Node.js + Express + MongoDB backend with JWT authentication, RBAC, payout workflow rules, and audit trail.

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)
- JWT authentication

## Project Structure
```
backend/
  src/
    app.js
    server.js
    config/
    constants/
    middlewares/
    models/
    routes/
    services/
    scripts/
    utils/
```

## Setup
1. Install dependencies:
   - `npm install`
2. Create env file:
   - `cp .env.example .env`
3. Update `.env` with your MongoDB Atlas URI and JWT secret.
4. Seed users:
   - `npm run seed`
5. Start server:
   - `npm run dev`

## Seeded Users
- OPS: `ops@demo.com` / `ops123`
- FINANCE: `finance@demo.com` / `fin123`

## API Endpoints
- `POST /auth/login`
- `GET /vendors`
- `POST /vendors`
- `GET /payouts` (filters: `status`, `vendor`)
- `POST /payouts` (OPS only, creates Draft)
- `GET /payouts/:id` (includes payout + audit history)
- `POST /payouts/:id/submit` (OPS only, Draft -> Submitted)
- `POST /payouts/:id/approve` (FINANCE only, Submitted -> Approved)
- `POST /payouts/:id/reject` (FINANCE only, Submitted -> Rejected, `decision_reason` required)

## Notes
- Role checks are enforced on backend via middleware.
- Status transitions are validated server-side.
- Audit trail is stored in `payout_audits` collection.
- Error response format is consistent:
  - `{ "success": false, "error": { "message": "..." } }`
