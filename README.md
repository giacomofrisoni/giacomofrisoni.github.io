# giacomofrisoni.github.io

Personal academic website of **Giacomo Frisoni** — Postdoctoral Researcher in Natural Language Processing, Department of Computer Science and Engineering, University of Bologna.

Built with [Jekyll](https://jekyllrb.com/) and the [al-folio](https://github.com/alshedivat/al-folio) theme.

## Structure

- `_pages/about.md` — home page (bio, contacts)
- `_bibliography/papers.bib` — publications (rendered by jekyll-scholar)
- `_data/cv.yml` — CV page content; `assets/pdf/cv_giacomo_frisoni.pdf` — downloadable CV
- `_pages/teaching.md` + `_teachings/` — teaching activities
- `_projects/` — funded research projects
- `_news/` — announcements shown on the home page
- `_data/socials.yml` — contact and profile links

## Local development

```bash
docker compose up
```

Then open <http://localhost:8080>. See the [al-folio install guide](https://github.com/alshedivat/al-folio/blob/main/docs/INSTALL.md) for alternatives.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
