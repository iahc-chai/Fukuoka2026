# Fukuoka shared Wishlist — deployment and maintenance

## Current status

Implementation is prepared locally. The owner supplied a production Apps Script `/exec` URL, now configured in `sync.js`. **Test release authorized by the owner: publish the frontend for testing with their private key. Production synchronization remains unverified until both devices and actual Sheet rows are checked.**

The live probe was blocked by the managed environment outbound proxy (CONNECT 403 to `script.google.com`), before reaching Google. Enable outbound access to `script.google.com`, `*.googleusercontent.com`, `www.gstatic.com`, and `iahc-chai.github.io` for browser verification. Supply `WISHLIST_KEY` only through private environment secret settings, never chat or source control.
The existing Sheet has the exact `Wishlist!A1:I1` headers and no data rows as inspected
on 12 November 2026. Do not create another repository or spreadsheet.

## Required owner action: Apps Script authorization and deployment

This session has no browser-control tool or Apps Script deployment API. The Drive
connector can inspect Sheets but cannot create/authorize/deploy a bound script.
The owner must perform this step in their own signed-in browser, or provide a
browser-enabled session so the agent can prepare it and hand over authorization.

1. Open the [existing Sheet](https://docs.google.com/spreadsheets/d/1_hfp4kV867WPWxEDSDY2t3Wrsmbd2v0BxtUp8v9rvPw/edit), then **Extensions → Apps Script**. Reuse the existing project if present.
2. Replace `Code.gs` with [Code.gs](Code.gs). This single file includes the HTML bridge. Save it; no separate HTML file is required.
3. **Project Settings → Script Properties**:
   - `SHEET_ID`: `1_hfp4kV867WPWxEDSDY2t3Wrsmbd2v0BxtUp8v9rvPw`
   - `WISHLIST_KEY`: select `setupWishlistKey` in the Apps Script editor and Run it once to generate and privately save a 64-character key. Existing keys are preserved. View/copy it only in Script Properties, and save it in your password manager. Never paste it in chat or source code. Alternatively, enter a password-manager-generated random secret of at least 32 characters.
   - Optional `PARENT_ORIGIN`: defaults to `https://iahc-chai.github.io`. Keep the exact HTTPS origin, with no path or trailing slash.
4. **Deploy → New deployment → Web app → Execute as Me → Who has access: Anyone**. The backend authenticates every read/write with the key. Keep the Sheet's sharing private.
5. Complete Google authorization yourself after reviewing the requested spreadsheet permissions. Do not share passwords or authorization codes.
6. Copy the production URL ending in **`/exec`**. This URL is public configuration and can be shared with the agent. Never share the key in chat.
7. After production testing, put that URL in `WISHLIST_ENDPOINT` in `sync.js` (no key), commit/push the reviewed changes, wait for successful Pages deployment, and repeat the tests on the live site.

Do not claim completion before verifying the real deployed `/exec` bridge from
GitHub Pages and inspecting actual Sheet rows after writes. `/dev` is insufficient.

## Architecture

The homepage and trip data remain static GitHub Pages files. `sync.js` loads an
invisible Apps Script HTML-service iframe. The embedded bridge uses Google's supported
`google.script.run` RPC to call `api` in `Code.gs`. Parent/frame communication uses
`postMessage` with an exact parent origin, a fresh 256-bit bridge nonce, a pinned
Google sandbox origin/source, and per-request correlation IDs.

The access key travels in RPC message bodies, never a JSONP URL, query string or
public file. JSONP is removed; GET requests cannot read the list or mutate data.
This avoids relying on opaque cross-origin fetch POST responses. The real Google
iframe redirect/sandbox behavior **still needs production verification**.

Each API operation validates the key before opening the Sheet, then takes a script
lock. Adds use stable item IDs (retries return the existing item); Done sets an
explicit boolean; deletes of absent IDs succeed. Every successful mutation flushes
Sheets and returns the current list. Literal item text is protected against Sheets
formula interpretation. Last accepted Done write wins; polling is every 20 seconds
while the page is visible, plus refresh, tab activation and network reconnection.

## Using two iPhones

Open the homepage, expand **Google Sheets**, and enter the same `/exec` URL and key
on each phone. Share the key privately. Credentials stay in tab-scoped sessionStorage
so refresh works; closing the browser session may require entry again. Safari and
LINE use separate storage. The key is never in exported list data. Disconnect clears
the active key. Use only non-sensitive travel notes: anyone with this shared key can
read/edit/delete all rows. This is not per-user Google authentication. Same-origin
scripts and browser extensions can access the key; keep the website free of
untrusted scripts. Apps Script quotas and internet availability still apply.

## Local data and import

- `our-fukuoka-trip-2026-v2`: original wishes, selected trip day, Aso plan and booking checks.
- `fukuoka-our-list-meta-v1`: original wish metadata and reminders.
- These keys are retained. Connecting displays the central list without overwriting them.
- **Import local notes once** explicitly adds original IDs and Done values. Existing
  IDs are retained on the server. An import ledger records each confirmed item,
  allowing a partially completed import to resume. A completion marker is per endpoint.
- Import each phone's pre-existing notes once. Identical text with different IDs is
  retained as distinct notes for manual review. Local originals remain exportable
  after disconnecting; the connected Export button exports the central list.
- `fukuoka-pending-add` in sessionStorage retains the draft ID across a reload so an
  uncertain request can be retried without duplicating it. Keep the same draft to retry.
- The Trip Plan's old local To-do list remains local and can diverge after import.
  Use the homepage for shared Wishlist edits. Booking checks remain device-local.
- Offline/errors retain the last confirmed central list and do not report a save as
  successful. Refresh before changing an uncertain draft; there is no offline write queue.

## Verification and maintenance

Local checks (requires Node, Playwright and Chromium):

```sh
node --check home.js
node --check sync.js
node tests/backend.cjs
node tests/browser.cjs
```

The browser suite uses two isolated Chromium contexts, an in-memory Sheets adapter,
and a mock Google iframe transport. It is regression coverage, not evidence of live
Google authorization, deployed CORS/iframe behavior or iPhone/LINE compatibility.

Before release, run the user's full two-traveler sequence on production; inspect
`Wishlist!A:I` after each add/Done/delete, refresh both sessions, simulate an outage,
remove test rows, verify the Trip Plan and check the Pages workflow for the final SHA.
Never delete a genuine user row. No test rows were written to the real Sheet locally.

For Apps Script updates: save code and **Deploy → Manage deployments → Edit → New
version → Deploy**; preserve the same URL to preserve device setup/import markers.
Rotating `WISHLIST_KEY` requires both phones to reconnect with the new key. Rotating
or deleting a deployment requires updating the public endpoint and retesting.
