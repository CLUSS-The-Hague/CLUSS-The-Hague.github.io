# CLÜSS website

The replacement for the Google Sites page at cluss.nl. It is a plain static site with no dependencies, built on the CLÜSS design system (rotulador sobre papel).

## Change something

Almost everything lives in one file: **`content/site.mjs`**. Team, events, committees, FAQ and links are all there.

```bash
npm run dev
```

That builds the site and opens it at http://localhost:4321. After an edit, run `npm run build` and refresh.

- **New event:** add it to `events`. Future dates appear as "next", and past dates move to "past events" the next time the site is built, so rebuild after an event ends.
- **Team photo:** put a JPG in `public/img/team/` with the filename listed in `team.board` (for example `fernanda.jpg`). It appears on the next build.

Code lives in `build.mjs` (page templates), `src/styles.css` and `src/main.js`. The finished site goes to `dist/`, so never edit that folder by hand.

## Still needed

Everything here is marked `TODO` in `content/site.mjs`, or listed below.

| What | Why |
| --- | --- |
| Past-event photos and page-header photos | Could not be copied. The Drive link is still on the Events page. |

## Publishing

The site lives in this repository and publishes itself to GitHub Pages at https://cluss-the-hague.github.io/.

- **To change something:** edit the files and push to `main`. The site rebuilds within a few minutes.
- **Events:** the site also rebuilds once a day, so finished events move to "past" by themselves. GitHub pauses these daily runs after 60 days without changes to the repository.

### Moving cluss.nl to this site

The domain still points to the old Google Site. When you're ready:

1. In this repository, open **Settings → Pages → Custom domain** and enter `www.cluss.nl`.
2. Where the domain is registered, point `www` to `cluss-the-hague.github.io` with a CNAME record, and point `cluss.nl` to GitHub's four addresses listed in GitHub's custom domain guide.
3. Turn on **Enforce HTTPS** once GitHub offers it, then unpublish the Google Site.

Old Google Sites addresses redirect to their new pages. `https://cluss.nl` without `www` does not load today, and these records fix that too.

## Privacy

Fonts are self-hosted and there are no trackers. The Events and Events & Culture committee pages embed Google Calendar, and Google may set its own cookies there, as it did on the old site. Membership forms still open on Google Forms.
