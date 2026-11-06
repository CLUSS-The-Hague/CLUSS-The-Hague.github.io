# CLÜSS website

The website at https://www.cluss.nl. It is a plain static site with no dependencies, built on the CLÜSS design system (rotulador sobre papel), plus a members area backed by Supabase.

## Change something

Most text lives in one file: **`content/site.mjs`**. Team, committees, FAQ and links are all there.

```bash
npm run dev
```

That builds the site and opens it at http://localhost:4321. After an edit, run `npm run build` and refresh.

- **Events and blog posts:** use the members area at https://www.cluss.nl/miembros/. No code needed.
- **Team photo:** put a JPG in `public/img/team/` with the filename listed in `team.board` (for example `fernanda.jpg`). It appears on the next build.

Code lives in `build.mjs` (page templates), `src/render.mjs` (events and posts, shared with the browser), `src/styles.css`, `src/main.js`, `src/live.js` and `src/miembros.js`. The finished site goes to `dist/`, so never edit that folder by hand.

## Members area

Active members sign in at **cluss.nl/miembros**. The first time, or after forgetting their password, they press **Enviarme un enlace** and sign in from the email. Then they set a password in the **Cuenta** tab and use email and password from then on. What they can do depends on their role:

| Role | Can |
| --- | --- |
| Member | See tasks, Drive links and the members list; update their own tasks |
| Collaborator | Also create tasks, write event and blog drafts, upload photos |
| Editor | Also publish events and posts to the website, edit anyone's, manage links |
| Admin | Also add and remove people and change roles |

Only emails an admin has added can sign in. The rules live in the database, so they hold even if someone tampers with the page. The email signature generator is at `/miembros/firmas/`.

Published events and posts appear on the website straight away. The site also rebuilds every day, so search engines see them too.

### Setting it up (once)

1. Create a free account at [supabase.com](https://supabase.com) and a new project called `cluss`. Choose an EU region (Frankfurt or Ireland) and save the database password somewhere safe.
2. Open **SQL Editor → New query**, paste all of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**. It is safe to run again later.
3. Add yourself as the first admin. In a new query, with your own details:
   ```sql
   insert into public.members (email, name, role) values ('you@example.com', 'Your Name', 'admin');
   ```
4. **Authentication → URL Configuration:** set **Site URL** to `https://www.cluss.nl`, and add `https://www.cluss.nl/miembros/` and `http://localhost:4321/miembros/` under **Redirect URLs**.
5. *(Optional, needs your own email sender, see below.)* **Authentication → Emails:** in both the **Magic Link** and **Confirm signup** templates, add the line `Código: {{ .Token }}`. Then people can type the code if the link opens in the wrong browser. Without it, sign-in works with the link alone.
6. **Project Settings → API Keys:** copy the **Project URL** and the **publishable** key (`sb_publishable_…`). Paste them into `backend` in `content/site.mjs`. The publishable key is meant to be public; never use a **secret** key (`sb_secret_…`) or the old `service_role` key.

### Things to know

- **Email limit:** Supabase's built-in email sends only a few sign-in emails per hour. That's fine once people are set up, because they stay signed in. For a big first sign-up wave, add your own email sender under **Authentication → SMTP**, for example Gmail with an app password.
- **Free plan pauses:** Supabase pauses free projects after a week without use. The site's daily rebuild reads the database, which keeps it awake.
- **Photos** uploaded in the members area are shrunk to 1800 px and stored publicly in Supabase, so only upload what may be public.

## Still needed

| What | Why |
| --- | --- |
| Past-event photos and page-header photos | Could not be copied from Google Sites. The Drive link is still on the Events page. |

## Publishing

The site lives in this repository and publishes itself to GitHub Pages at https://www.cluss.nl.

- **To change something in the code:** edit the files and push to `main`. The site rebuilds within a few minutes.
- **Daily rebuild:** finished events move to "past" and new posts get their own page. GitHub pauses these daily runs after 60 days without changes to the repository; live visitors still see current events and posts.
- **Domain:** `cluss.nl` and `www.cluss.nl` point to GitHub Pages from Namecheap. Keep the email forwarding, the SPF and Google TXT records, and the `_github-pages-challenge-CLUSS-The-Hague` record. Old Google Sites addresses redirect to their new pages.

## Privacy

Fonts are self-hosted and there are no trackers. The Events and Events & Culture committee pages embed Google Calendar, and Google may set its own cookies there. Membership forms still open on Google Forms. The members area stores a sign-in session in the browser.
