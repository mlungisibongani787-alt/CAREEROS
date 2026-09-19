# Elevate360 AI deployment

This package keeps the AI credential server-side. Do not place the API key in index.html.

## 1. Install

```bash
firebase login
cd Elevate360_AI_WORKING_DEPLOYMENT
cd functions
npm install
cd ..
```

## 2. Store the AI key as a Firebase Secret

```bash
firebase functions:secrets:set GEMINI_API_KEY --project elevate360-6206c
```

Paste a NEW Gemini API key when prompted. The key previously pasted in chat should be revoked/rotated.

## 3. Deploy

```bash
firebase deploy --only functions:elevate360AI,hosting --project elevate360-6206c
```

The website first calls `/api/elevate360AI` and also has a direct Cloud Function fallback.

## 4. Test

Open the site and ask: `How can I improve my CV for a software developer role?`

If the secret is missing, the website will now show a specific configuration message instead of the generic failure.
