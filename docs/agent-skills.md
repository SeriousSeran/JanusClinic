# Installed agent tools

All ten requested skills are installed under `.agents/skills/`, with their complete supporting files. `.agents/skills-lock.json` records upstream commits and SHA256 file hashes. Upstream skill text is unchanged; source licences are retained. The 15 original skill folders include Ponytail's five companion commands.

| Requested toolkit | Local invocation |
| --- | --- |
| Ponytail | `$ponytail` |
| Frontend Design | `$frontend-design` |
| UI/UX Pro Max | `$ui-ux-pro-max` |
| Taste Skill | `$design-taste-frontend` |
| Impeccable | `$impeccable` |
| Hallmark | `$hallmark` |
| Web Design Guidelines | `$web-design-guidelines` |
| Vercel React Best Practices | `$vercel-react-best-practices` |
| Agent Browser | `$agent-browser` |
| Improve Animations | `$improve-animations` |

Codex discovers project skills from `.agents/skills/`; an already-open skill picker may need a new session to refresh. In this session, the assistant can read and use the installed SKILL.md paths directly. These are repository-local skills, not newly installed cloud plugins or additions to the cloud skills API catalog.

## GitHub Spec Kit

Spec Kit was initialized for Codex with the installed `specify` CLI (1.3.1.dev0), built from GitHub commit `ec9a6f3b94c0aa856f77e550785a1ddde1993de1`. `.specify/` contains its templates, scripts and workflow; nine `$speckit-*` commands are installed as skills.

Use `$speckit-specify` for a major feature's requirements, `$speckit-clarify` for ambiguities, `$speckit-plan` for implementation design, and `$speckit-tasks` for tasks. Do not start a second competing specification for the same feature. Existing briefs under `docs/superpowers/`, the owner decisions and AGENTS.md remain authoritative. The project constitution records existing requirements rather than adding a new brand or commercial policy.

The CLI is installed in this cloud environment; fresh machines can restore it with:

```sh
uv tool install 'git+https://github.com/github/spec-kit.git@ec9a6f3b94c0aa856f77e550785a1ddde1993de1'
```

The generated project files and skills are already in Git; do not rerun `specify init --force` as routine startup.

## How to combine the design skills

Use Ponytail for proportionate implementation, Frontend Design for the Janus-specific visual direction, UI/UX Pro Max for targeted reference searches, and Impeccable for refinement. Taste and Hallmark offer additional art-direction checks. Use Web Design Guidelines for accessibility and interface review, Improve Animations for a motion audit, and Agent Browser for actual browser checks. React Best Practices applies when maintaining editable React/Next source, including a future migration; this site's current maintained pages use HTML/CSS/JavaScript/Python.

The owner's choices and repository rules take precedence over generic skill preferences. In particular, preserve the Janus logo, local fonts and factual content, retain AI disclosures, and keep prices and clinical text readable. A skill's dislike of serif/italic headings, labels or captions does not authorize removing Janus's agreed identity. Installation does not authorize applying a random theme, copying a starter over the site, or connecting real accounts and bookings. Load the relevant skill and references for each task; do not read every toolkit or apply every workflow at once.

Skills may include optional reference code, example assets and native-platform examples. They live outside the exported website and add no application runtime dependencies. Their complete source resources take approximately 49 MB; the preview exporter does not publish them.

## Verified tools

- `agent-browser` 0.41.2 is installed globally, using existing `/usr/bin/chromium`. No second browser download is needed. Restore with `npm install --global --ignore-scripts agent-browser@0.41.2`.
- Agent Browser opened the local Pages preview, captured a mobile screenshot, and ran axe on the actual page: zero automated violations, with one item requiring manual review. Automated checks do not establish full accessibility compliance.
- UI/UX Pro Max's local search runs using Python 3 with no external Python dependencies.
- Impeccable's context loader ran successfully using its checksum-verified engine. It recognized the existing design and reported missing optional PRODUCT.md / DESIGN.md metadata; the current identity guide and source remain the reference. No hooks were enabled.

Verify installed files with `npm run skills:check`. Keep reusable runtime caches and browser sessions out of Git. Future skill upgrades should deliberately update the source pin and file hashes together.
