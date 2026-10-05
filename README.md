# MashMac Social Media App

This ZIP contains the combined React frontend and Express/MongoDB backend from the provided code.

## GitHub
Upload the `backend` and `frontend` folders plus this README to your MashMac repository.

## Backend
Copy `backend/.env.example` to `backend/.env`, then add your real MongoDB connection string and JWT secret. Do not upload `.env` with real secrets to GitHub.

Inside `backend` run:

```bash
npm install
npm start
```

## Frontend
Inside `frontend` run:

```bash
npm install
npm start
```

The frontend uses React Router v5 because the supplied App.js uses `Switch`.

Routes: `/`, `/register`, `/login`, `/upload`.
