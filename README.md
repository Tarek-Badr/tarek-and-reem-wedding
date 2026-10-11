# Mohamed & Reem wedding invitations

Static wedding invitations for Thursday, 7 January 2027, in Cairo.

- English: `index.html`
- Arabic: `ar.html`
- Shared RSVP behaviour: `assets/rsvp.js`
- WhatsApp/Messenger preview: `assets/invitation-preview.jpg`

The English photos and botanical illustrations are included directly in the HTML. Typography uses Google Fonts. Both forms submit to the same Formspree endpoint; replies include `language=en` or `language=ar`, attendance, attendee count, optional email, and an optional message.

## Publish with GitHub Pages

Publish the repository's `main` branch from the root directory. For a new Pages setup, use **Settings → Pages → Build and deployment → Deploy from a branch**, select **main / (root)**, and save. Keep both HTML files, `.nojekyll`, and the entire `assets` directory together. No build command is required.

Public links once deployment completes:

- https://tarek-badr.github.io/tarek-and-reem-wedding/index.html
- https://tarek-badr.github.io/tarek-and-reem-wedding/ar.html

If you configure a custom domain or change the repository name, update the absolute `og:url` and `og:image` values in both HTML files. The preview image must be publicly accessible; messaging services can cache old previews.

## Local development

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

There are no project dependencies or build steps. The RSVP script preserves native form submission when enhanced submission is unavailable. For native submissions, use the attendance answer when counting guests; enhanced declined replies submit zero attendees.

## Final delivery check

After publication, send one clearly labelled test RSVP from each language and check the Formspree dashboard and notification inbox. Verify Arabic characters, attendance, attendee count, optional email, and message. Check the provider's submission allowance and spam settings. Browser tests should intercept Formspree requests so they do not create real replies.

The calendars start at 2 PM Cairo time and currently end at 11 PM. Changing the end time requires updating both downloadable calendars and both Google Calendar links. No RSVP deadline is configured.
