# CareerOS / Elevate360 — Firebase AI Logic Edition

This package uses **Firebase AI Logic + Gemini Developer API** for the AI Career Hub and keeps **Firebase Authentication, Cloud Firestore and Firebase Storage** for cloud data.

## Important: no Cloud Functions are required

The previous `/api/elevate360AI` Cloud Function has been removed from this package. The project no longer contains a `functions` directory and `firebase.json` no longer declares Cloud Functions.

This means deploying this package will deploy **Firebase Hosting only** from this project configuration. It does not require the Firebase Blaze plan just to deploy the site or use Firestore's no-cost quotas.

Firebase AI Logic itself is free. The Gemini Developer API currently provides a free tier for Gemini 3.8 Flash, subject to Google's current free-tier rate limits. Paid Gemini tiers require billing; do not enable billing unless you intentionally want paid usage.

## One-time Firebase Console setup

1. Open Firebase Console and select project `elevate360-6206c`.
2. Go to **AI Services → AI Logic**.
3. Click **Get started**.
4. Select **Gemini Developer API** as the provider.
5. Complete the guided setup.
6. Configure **Firebase App Check** for the web app before public production use. Firebase's current AI Logic setup uses App Check to protect direct client access to Gemini.
7. If Firebase gives you a web App Check site key, place it in `index.html` at:

```js
const AI_APPCHECK_SITE_KEY = "";
```

The value is intentionally blank in this package because the site key is project/app-specific and was not available from the source package.

## Firebase project configuration

The existing Firebase Web App configuration for `elevate360-6206c` is retained in `index.html`.

Cloud data continues to use:

- Firebase Authentication
- Cloud Firestore
- Firebase Storage

The existing website's cloud-state and AI-history Firestore calls were not removed.

## Deploy

From the project root:

```bat
firebase use elevate360-6206c
firebase deploy --only hosting
```

Do **not** run `firebase deploy --only functions` — there is no Cloud Function in this edition.

## AI model

The package uses:

```text
gemini-3.8-flash
```

The model supports text, image and PDF inputs. DOCX/XLS/XLSX/PPTX/TXT/CSV/JSON/MD/RTF attachments are still handled by the website's existing browser-side text extraction and then sent to AI as text.

## What changed

- Removed the Cloud Function AI endpoint.
- Removed the Gemini API secret requirement.
- Added Firebase AI Logic Web SDK.
- Added Gemini Developer API backend initialization.
- Replaced `/api/elevate360AI` calls with direct Firebase AI Logic model calls.
- Kept Firestore/Auth/Storage functionality.
- Kept the existing AI Career Hub UI and attachment workflow.
- Kept AI history saving to Firestore for signed-in users.
- Removed the Hosting rewrite to the old Cloud Function.

## Billing note

This package is designed to let you remain on the Firebase Spark plan for the no-cost setup. Gemini's free tier is subject to Google's model-specific quotas. If you later choose a paid Gemini tier or another Firebase/Google Cloud feature that requires billing, billing can be enabled separately.
