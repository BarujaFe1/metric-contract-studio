# Data model

## MetricContract

Primary aggregate root for a metric definition.

Required conceptual fields:

- identity: `id`, `name`, `slug`, `status`
- business: `business_question`, `description`, `owner`, `domain`
- calculation: `metric_type`, `formula`, optional numerator/denominator
- source: `source_system`, `source_table`, `grain`, `refresh_frequency`, `default_filters`
- policy: `inclusion_rules`, `exclusion_rules`, `limitations`
- audit: `created_at`, `updated_at`
- children: `fields`, `validation_rules`, `usage_examples`

## MetricField

Documents columns/concepts the metric depends on.

## ValidationRule

Machine-assisted quality expectations with severity and owner action.

## UsageExample

Correct and incorrect consumption patterns for stakeholder education.

## Persistence (MVP)

- Browser `localStorage` key: `metric-contract-studio:metrics:v1`
- Seed flag: `metric-contract-studio:seeded:v1`
- No server database in MVP
