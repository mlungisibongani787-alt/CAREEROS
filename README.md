# Elevate360 – Complete Production Build

This package preserves the existing Elevate360 website assets and adds the requested functionality without removing the working AI architecture.

## Included
- Existing `index.html` with Firebase AI Logic integration and AI streaming.
- Existing `logo.png`, `CNAME`, and Google verification file preserved.
- Registration with password + confirm password.
- Secure password recovery through the member login.
- Cloud-backed member profiles and administrator approval.
- Up to two cloud administrator email addresses in Owner Settings.
- Secure cloud administrator account setup/sign-in for either configured address.
- Ten distinct professional website themes. A selected theme changes the public website, AI Career Hub, member login/dashboard and administrator centre while keeping application logic unchanged.
- Public theme preference stored in `elevate360/publicTheme` so the selected theme can be loaded across devices when the cloud administrator account is connected.
- Updated Firestore rules: the public theme document is readable by visitors; protected site/member administration data remains administrator-only.
- Elevate360-branded user-facing errors.
- AI loading animation and streaming responses.

## Important cloud setup
1. Deploy the included Firestore rules before testing the multi-device theme sync.
2. In Administration → Owner Settings, enter one or two cloud administrator emails.
3. Use **Set Up / Sign In Cloud Account** for each address when needed. The first use can create the secure administrator Auth account.
4. The two emails authorize administrator access to the same Firestore cloud data; they are not two separate databases.
5. The existing App Check/reCAPTCHA configuration must remain correctly registered for the production domain.

## Deploy
```bash
firebase deploy --only hosting,firestore,storage
```

Keep the original `CNAME`, logo and Google verification files in the project root.
