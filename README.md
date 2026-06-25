# Barna Backend

REST API for Barna Mezon Iran — traditional Iranian clothing platform.

## Tech Stack
- Node.js + Express.js
- MySQL (mysql2)
- JWT Authentication

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and configure
3. `npm run migrate` to create DB schema
4. `npm run seed` to insert seed data
5. `npm run dev` to start development server

## API Base URL
`http://localhost:4000/api`

## Authentication
Include `Authorization: Bearer <token>` header for protected routes.

## Main Endpoints
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/clothing` — List clothing
- `GET /api/ethnic-groups` — List ethnic groups
- `POST /api/reservations` — Create reservation
- `POST /api/orders` — Create order
- `GET /api/pages/:slug` — Get CMS page
- `GET /api/settings` — Get public settings
- `GET /api/theme` — Get theme settings
