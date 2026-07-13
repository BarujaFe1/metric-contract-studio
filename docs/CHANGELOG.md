# Changelog

## 2026-07-13 — Contract governance demo

### Added
- Local contract version history and governance-field diffs
- Local review workflow: `in_review` status, submit / approve / reject
- dbt/MetricFlow-style YAML documentation export
- Organizational case study at `/cases/conversion-conflict`
- Tests for diff, YAML export, review gates, conflict content, legacy normalize

### Changed
- README interview script and feature table updated for governance narrative
- Home/examples CTAs point to the conflict case

### Notes
- Review workflow is browser-local (not multi-user)
- YAML export is a documentation template, not a live semantic-layer sync
- Production deploy may lag until branch merge

## 2026-07-13 — Portfolio quality pass

- Zod soft-parse on localStorage
- CI, typecheck script, skeletons, a11y nav
- README rewrite and architecture docs
