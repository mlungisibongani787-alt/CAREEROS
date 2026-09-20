# Elevate360 — Firebase + AI deployment

This package contains the complete website, Firebase configuration, Firestore/Storage rules and the secure Gemini Cloud Function.

## IMPORTANT: deploy the Function, not only Hosting

The browser errors shown in DevTools (`/api/elevate360AI 404` and the direct `cloudfunctions.net/elevate360AI` CORS failure) mean the Hosting page is live but the `elevate360AI` Cloud Function endpoint is not currently live at the URL the website is calling. The CORS handler in `functions/index.js` is now written to finish `OPTIONS` preflight with HTTP 204 before processing POST.

From this folder:

```bash
firebase login
firebase use elevate360-6206c
cd functions
npm install
cd ..
```

Set the Gemini key as a Firebase Secret (do not put it in `index.html`):

```bash
firebase functions:secrets:set GEMINI_API_KEY --project elevate360-6206c
```

Then deploy **all required pieces together**:

```bash
firebase deploy --only functions:elevate360AI,hosting,firestore:rules,storage --project elevate360-6206c
```

If you want to deploy the function first, use:

```bash
firebase deploy --only functions:elevate360AI --project elevate360-6206c
```

Then deploy Hosting/rules:

```bash
firebase deploy --only hosting,firestore:rules,storage --project elevate360-6206c
```

## Firebase Authentication

In Firebase Console, enable **Authentication → Sign-in method → Email/Password**. The member registration code uses Firebase Authentication and then creates the member profile in Firestore.

## Test the AI

After deployment, open:

`https://elevate360-6206c.web.app`

Ask:

`How can I improve my CV for a software developer role?`

In DevTools → Network, the request should now show:

- `OPTIONS /api/elevate360AI` → **204**
- `POST /api/elevate360AI` → **200** when the Gemini secret is configured

The direct Cloud Function fallback should also answer OPTIONS with CORS headers.

## Database

The package includes Firestore rules. Anonymous users may create booking/enquiry records; authenticated members can read their own profile and AI history. Private aggregate site/member state is restricted to authenticated Firebase users.

The existing visible administrator login (`Elevate360 / 360`) remains the website's legacy UI login. It is not a Firebase Admin credential and should not be treated as production server authentication.
