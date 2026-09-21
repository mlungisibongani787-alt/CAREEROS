# Elevate360 – Complete Updated Website Build

This package is the complete merged project build.

## Preserved original website files
- CNAME – custom domain configuration
- logo.png – original Elevate360 logo
- google102f3e3feb76e6db.html – Google verification file

## Updated application files
- index.html – latest application build with password confirmation, password recovery, improved AI loading/streaming, readable AI text, sanitized user-facing errors, and cloud administrator approval writes
- firebase.json – Hosting + Firestore + Storage deployment configuration
- firestore.rules – updated authenticated member/admin security rules
- storage.rules – authenticated user upload rules

## Important
The old Cloud Functions folder is intentionally NOT included. The current application uses the Firebase AI Logic client integration.

Do not delete CNAME, logo.png, or the Google verification file when copying this update into an existing project.

## Deploy
From the project folder, run:

firebase use elevate360-6206c
firebase deploy --only hosting,firestore,storage

## Verification note
Static source checks were run on this package. Live browser/network verification is separate; the previously observed App Check 401 must be retested after the reCAPTCHA Enterprise key includes every domain from which the site is served (including the custom domain).
