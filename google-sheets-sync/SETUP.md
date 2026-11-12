# Chai × Care wishlist — Google Sheets sync setup

The home page lives at `index.html`. The complete trip plan lives at `plan.html`.
The website currently saves wishlist/reminder changes **only in the current browser**.
A shared Google Sheet called **Fukuoka 2026 — Chai & Care Wishlist** has been created. It is private by default. The web app endpoint has **not** been deployed or connected yet.

## Deploy the Apps Script service

1. Open your Fukuoka Wishlist Google Sheet in your Google account.
2. Select **Extensions → Apps Script**.
3. Replace the editor contents with [Code.gs](./Code.gs).
4. In **Project Settings → Script Properties**, set:
   - `SHEET_ID` — spreadsheet ID from your Google Sheet URL.
   - `WISHLIST_KEY` — a newly generated strong passphrase of at least 12 characters; share this privately with Care. **Do not put it in GitHub, screenshots or chat.**
5. **Deploy → New deployment → Web app**, execute as **Me**, access **Anyone**. Authorize the Sheet permissions.
6. Copy the endpoint URL ending in `/exec`. This URL is needed to connect the website.
7. The website frontend does not yet send or receive shared Sheet data. Hookup and cross-device testing must be completed before claiming sync is active.

## How the API works

A browser must provide `key` from the private passphrase on each call.

- `GET /exec?key=...&callback=foo` → JSONP with `{ok:true,items:[...]}`.
- `POST /exec` with form fields `key,action=add,id,type,text,author,category,day`.
- `POST /exec` with `action=done,id,done=true|false`.
- `POST /exec` with `action=delete,id`.

The POST endpoint responds with JSON but cross-origin requests from GitHub Pages might be opaque. To confirm a mutation the frontend should fetch the list again after the POST, not assume it saved.

### Security

This is appropriate only for casual, non-sensitive travel notes. An Apps Script deployment with **Anyone** access is a public endpoint, and a shared passphrase is weaker than Google account sign-in. The access key on a JSONP GET appears in the HTTPS URL, and anyone who knows it can read/edit the list. Do not store passports, booking codes, payment information, private addresses, or personal information there. For stronger security, use authenticated backend hosting with per-user accounts instead.

The Google Sheet should remain private. The source code intentionally contains no spreadsheet ID or secret. Do not merge browser-local checkboxes with shared data without planning a one-time migration.
