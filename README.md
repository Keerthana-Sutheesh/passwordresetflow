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
- Reset link is delivered through SMTP email.
- Reset page validates token before allowing password update.
- Password is updated as bcrypt hash.
- Token data is cleared after successful reset.
- Expired/invalid token returns proper error.

## User Setup

- Create at least one user document in MongoDB before testing forgot-password flow.


## Testing MailID
 
 - MailID   : mailboxfortesting2026@gmail.com 
 - Password : test@12345


