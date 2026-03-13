# Password Reset Flow

This project implements a full password reset flow with email verification token handling and expiry.

## Stack

- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB

## Features

- User submits email on forgot password screen.
- API checks whether user exists.
- Server generates secure random reset token.
- Token hash and expiry are stored in database storage.
- Reset link is delivered through Nodemailer via SMTP.
- Reset page validates token before allowing password update.
- Password is updated as bcrypt hash.
- Token data is cleared after successful reset.
- Expired/invalid token returns proper error.

## User Setup

- Create at least one user document in MongoDB before testing forgot-password flow.

## Netlify (Functions Only)

- Netlify does not run long-lived Node servers. Do not rely on `app.listen()` when deploying on Netlify.
- Use the Netlify Function at `server/netlify/functions/send-reset-email.js` for email sending.
- Keep `server/netlify.toml` in place so `/api/send-reset-email` maps to `/.netlify/functions/send-reset-email`.
- The Nodemailer call is awaited (`await sendResetEmail(...)` and `await transporter.sendMail(...)`) so the function does not exit early.


## Testing MailID
 
 - MailID   : mailboxfortesting2026@gmail.com 
 - Password : test@12345


