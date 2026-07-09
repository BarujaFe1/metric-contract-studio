# Demo metric examples

All demos ship in `src/lib/demo-data.ts` and load into localStorage on first visit.

## 1. Receita líquida

- **Domain:** Finance
- **Type:** Sum
- **Question:** How much recognized revenue remains after discounts, refunds, and taxes?
- **Grain:** order_id (monthly rollup)
- **Source:** `analytics.fct_orders`
- **Watchouts:** Excludes deferred annual contract revenue; FX converted at payment day.

## 2. Taxa de conversão

- **Domain:** Marketing
- **Type:** Rate
- **Question:** What share of qualified sessions become paid orders?
- **Grain:** session_id
- **Source:** `analytics.fct_sessions`
- **Watchouts:** Last-touch channel attribution; weak cross-device identity.

## 3. Churn mensal

- **Domain:** Product
- **Type:** Rate
- **Question:** What percent of active subscribers churned in the month?
- **Grain:** subscriber_id (monthly)
- **Source:** `analytics.fct_subscriptions`
- **Watchouts:** Logo churn, not revenue churn; involuntary payment failure lag.

## 4. Ticket médio

- **Domain:** Sales
- **Type:** Average
- **Question:** What is average net value per paid order?
- **Grain:** paid_order_id
- **Source:** `analytics.fct_orders`
- **Watchouts:** Sensitive to B2B outliers; order-level, not item-level.

## 5. Ativação de usuário

- **Domain:** Product
- **Type:** Rate
- **Question:** What percent of new users complete the aha moment within 7 days?
- **Grain:** user_id (signup cohort)
- **Source:** `analytics.fct_user_activation`
- **Definition of activated:** first project created + first invite sent within 7 days
- **Watchouts:** Aha definition may differ for enterprise segments.
