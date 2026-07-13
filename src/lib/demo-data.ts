import {
  normalizeContract,
  type MetricContract,
  type MetricField,
  type UsageExample,
  type ValidationRule,
} from "./metric-model";

type DemoSeed = Omit<MetricContract, "version" | "approval">;

function field(
  metricId: string,
  partial: Omit<MetricField, "id" | "metric_id"> & { id?: string },
): MetricField {
  return {
    id: partial.id ?? `${metricId}-field-${partial.field_name}`,
    metric_id: metricId,
    ...partial,
  };
}

function rule(
  metricId: string,
  partial: Omit<ValidationRule, "id" | "metric_id"> & { id?: string },
): ValidationRule {
  return {
    id: partial.id ?? `${metricId}-rule-${partial.rule_type}`,
    metric_id: metricId,
    ...partial,
  };
}

function example(
  metricId: string,
  partial: Omit<UsageExample, "id" | "metric_id"> & { id?: string },
): UsageExample {
  return {
    id: partial.id ?? `${metricId}-ex-${partial.type}-${partial.title}`,
    metric_id: metricId,
    ...partial,
  };
}

const NOW = "2026-07-01T12:00:00.000Z";

export const DEMO_METRICS: DemoSeed[] = [
  {
    id: "demo-net-revenue",
    name: "Receita líquida",
    slug: "receita-liquida",
    status: "ready",
    business_question:
      "Quanto de receita reconhecida permanece após descontos, estornos e impostos?",
    description:
      "Receita líquida mensal de pedidos pagos, após descontos comerciais, estornos e impostos indiretos. Usada para forecast financeiro e performance comercial.",
    owner: "Ana Ribeiro (Finance Analytics)",
    domain: "finance",
    metric_type: "sum",
    formula:
      "SUM(order_gross_amount - discount_amount - refund_amount - tax_amount) WHERE payment_status = 'paid'",
    source_system: "Warehouse / Stripe + ERP",
    source_table: "analytics.fct_orders",
    grain: "order_id (aggregated by month)",
    refresh_frequency: "Daily at 06:00 UTC",
    default_filters: "payment_status = 'paid' AND is_test_order = false",
    numerator_definition: null,
    denominator_definition: null,
    inclusion_rules:
      "Pedidos pagos, não-teste, com invoice emitida no período de referência.",
    exclusion_rules:
      "Pedidos cancelados antes do pagamento, chargebacks abertos e pedidos internos.",
    limitations:
      "Não inclui receita diferida de contratos anuais. Moeda convertida para BRL na taxa do dia do pagamento.",
    created_at: NOW,
    updated_at: NOW,
    fields: [
      field("demo-net-revenue", {
        field_name: "order_gross_amount",
        field_type: "numeric",
        source_column: "gross_amount",
        required: true,
        description: "Valor bruto do pedido antes de descontos",
        example_value: "1299.90",
      }),
      field("demo-net-revenue", {
        field_name: "discount_amount",
        field_type: "numeric",
        source_column: "discount_amount",
        required: true,
        description: "Descontos comerciais aplicados",
        example_value: "100.00",
      }),
      field("demo-net-revenue", {
        field_name: "refund_amount",
        field_type: "numeric",
        source_column: "refund_amount",
        required: true,
        description: "Estornos liquidados no período",
        example_value: "0.00",
      }),
    ],
    validation_rules: [
      rule("demo-net-revenue", {
        rule_type: "non_negative",
        severity: "critical",
        description: "Receita líquida diária não pode ser negativa sem nota.",
        sql_check_template:
          "select order_date, sum(net_amount) as net from analytics.fct_orders where payment_status='paid' group by 1 having sum(net_amount) < 0",
        failure_message: "Found negative net revenue days",
        owner_action: "Investigate refunds/tax mapping with Finance Ops",
      }),
      rule("demo-net-revenue", {
        rule_type: "reconciliation",
        severity: "warning",
        description: "Reconciliar com ledger financeiro semanalmente (±2%).",
        sql_check_template:
          "-- compare analytics.fct_orders.net vs finance.ledger_revenue",
        failure_message: "Variance above 2% vs ledger",
        owner_action: "Open reconciliation ticket with FP&A",
      }),
    ],
    usage_examples: [
      example("demo-net-revenue", {
        type: "correct",
        title: "Receita líquida mensal por canal",
        description:
          "Usar para comparar performance de canais pagos vs orgânicos no mês fechado.",
        explanation:
          "Respeita filtros de pagamento e exclui pedidos teste.",
      }),
      example("demo-net-revenue", {
        type: "incorrect",
        title: "Somar receita bruta e chamar de líquida",
        description:
          "Usar gross_amount sem descontos/estornos em board executivo.",
        explanation:
          "Infla resultados e conflita com o contrato financeiro.",
      }),
    ],
  },
  {
    id: "demo-conversion-rate",
    name: "Taxa de conversão",
    slug: "taxa-de-conversao",
    status: "ready",
    business_question:
      "Qual percentual de sessões qualificadas resulta em compra concluída?",
    description:
      "Taxa de conversão de sessão para pedido pago em e-commerce. Base para experimentos de funil e performance de aquisição.",
    owner: "Bruno Costa (Growth Analytics)",
    domain: "marketing",
    metric_type: "rate",
    formula:
      "COUNT(DISTINCT session_id WHERE converted) / COUNT(DISTINCT session_id WHERE qualified)",
    source_system: "Segment + Warehouse",
    source_table: "analytics.fct_sessions",
    grain: "session_id (aggregated by day/channel)",
    refresh_frequency: "Hourly",
    default_filters: "is_bot = false AND country IN ('BR','PT')",
    numerator_definition: "session with paid_order_id IS NOT NULL",
    denominator_definition: "qualified session (pageview_count >= 1, not bot)",
    inclusion_rules: "Sessões humanas em mercados ativos.",
    exclusion_rules: "Bots, staff, e sessões de QA.",
    limitations:
      "Atribuição last-touch no canal. Não resolve cross-device do mesmo usuário.",
    created_at: NOW,
    updated_at: NOW,
    fields: [
      field("demo-conversion-rate", {
        field_name: "session_id",
        field_type: "string",
        source_column: "session_id",
        required: true,
        description: "Identificador único da sessão",
        example_value: "sess_9f2a",
      }),
      field("demo-conversion-rate", {
        field_name: "paid_order_id",
        field_type: "string",
        source_column: "paid_order_id",
        required: false,
        description: "Pedido pago associado à sessão",
        example_value: "ord_1182",
      }),
    ],
    validation_rules: [
      rule("demo-conversion-rate", {
        rule_type: "bounds",
        severity: "critical",
        description: "Taxa diária deve estar entre 0 e 1.",
        sql_check_template:
          "select day, conversion_rate from analytics.mart_conversion_daily where conversion_rate < 0 or conversion_rate > 1",
        failure_message: "Conversion rate outside [0,1]",
        owner_action: "Check join fan-out between sessions and orders",
      }),
      rule("demo-conversion-rate", {
        rule_type: "denominator_volume",
        severity: "warning",
        description: "Denominador diário não deve cair >40% vs média 14d.",
        sql_check_template:
          "-- volume anomaly check on qualified sessions",
        failure_message: "Sudden drop in qualified sessions",
        owner_action: "Validate tracking pipeline health",
      }),
    ],
    usage_examples: [
      example("demo-conversion-rate", {
        type: "correct",
        title: "Comparar conversão por canal em experimento",
        description:
          "Usar taxa diária com mesmo filtro de mercado e exclusão de bots.",
        explanation: "Mantém denominador consistente entre variantes.",
      }),
      example("demo-conversion-rate", {
        type: "incorrect",
        title: "Dividir pedidos por usuários únicos do mês",
        description:
          "Misturar grain de sessão com grain de usuário mensal.",
        explanation: "Quebra comparabilidade e infla/defla a taxa.",
      }),
    ],
  },
  {
    id: "demo-monthly-churn",
    name: "Churn mensal",
    slug: "churn-mensal",
    status: "ready",
    business_question:
      "Qual percentual da base ativa de assinantes cancelou ou não renovou no mês?",
    description:
      "Churn logo mensal de assinaturas SaaS. Mede perda de clientes ativos no fim do mês anterior.",
    owner: "Camila Duarte (Product Analytics)",
    domain: "product",
    metric_type: "rate",
    formula:
      "COUNT(subscribers churned in month) / COUNT(active subscribers at month start)",
    source_system: "Billing (Stripe) + Warehouse",
    source_table: "analytics.fct_subscriptions",
    grain: "subscriber_id (monthly cohort)",
    refresh_frequency: "Daily",
    default_filters: "plan_type != 'trial' AND is_internal = false",
    numerator_definition:
      "subscriber active on month_start and inactive on month_end due to cancel/non-renewal",
    denominator_definition: "subscribers active at month_start",
    inclusion_rules: "Planos pagos ativos no início do mês.",
    exclusion_rules: "Trials, contas internas e upgrades/downgrades sem cancelamento.",
    limitations:
      "Não captura churn involuntário por falha de pagamento até d+7. Logo churn, não revenue churn.",
    created_at: NOW,
    updated_at: NOW,
    fields: [
      field("demo-monthly-churn", {
        field_name: "subscriber_id",
        field_type: "string",
        source_column: "subscriber_id",
        required: true,
        description: "ID do assinante",
        example_value: "sub_4421",
      }),
      field("demo-monthly-churn", {
        field_name: "status_month_start",
        field_type: "string",
        source_column: "status_month_start",
        required: true,
        description: "Status no início do mês",
        example_value: "active",
      }),
    ],
    validation_rules: [
      rule("demo-monthly-churn", {
        rule_type: "bounds",
        severity: "critical",
        description: "Churn mensal deve estar entre 0% e 100%.",
        sql_check_template:
          "select month, churn_rate from analytics.mart_churn_monthly where churn_rate < 0 or churn_rate > 1",
        failure_message: "Churn outside [0,1]",
        owner_action: "Audit status transitions in subscription SCD",
      }),
      rule("demo-monthly-churn", {
        rule_type: "cohort_integrity",
        severity: "critical",
        description: "Denominador deve igualar active base snapshot.",
        sql_check_template:
          "-- reconcile month_start actives vs snapshot table",
        failure_message: "Denominator mismatch vs snapshot",
        owner_action: "Fix snapshot job timing",
      }),
    ],
    usage_examples: [
      example("demo-monthly-churn", {
        type: "correct",
        title: "Churn logo por plano no mês fechado",
        description: "Reportar após fechamento contábil do mês.",
        explanation: "Evita reprocessamento de late cancels.",
      }),
      example("demo-monthly-churn", {
        type: "incorrect",
        title: "Usar churn de receita como churn de clientes",
        description: "Misturar MRR lost com logo churn sem aviso.",
        explanation: "São contratos diferentes e mudam decisões de retention.",
      }),
    ],
  },
  {
    id: "demo-aov",
    name: "Ticket médio",
    slug: "ticket-medio",
    status: "ready",
    business_question:
      "Qual o valor médio líquido por pedido pago no período?",
    description:
      "Average Order Value (AOV) líquido para e-commerce. Apoia pricing, promoções e mix de produtos.",
    owner: "Diego Martins (Commercial Analytics)",
    domain: "sales",
    metric_type: "average",
    formula:
      "SUM(net_order_amount) / COUNT(DISTINCT paid_order_id)",
    source_system: "Warehouse",
    source_table: "analytics.fct_orders",
    grain: "paid_order_id (aggregated by day/channel)",
    refresh_frequency: "Daily",
    default_filters: "payment_status = 'paid' AND is_test_order = false",
    numerator_definition: null,
    denominator_definition: null,
    inclusion_rules: "Pedidos pagos no período de análise.",
    exclusion_rules: "Pedidos gratuitos (net_amount = 0) e pedidos teste.",
    limitations:
      "Sensível a outliers de B2B. Não normaliza por item; é por pedido.",
    created_at: NOW,
    updated_at: NOW,
    fields: [
      field("demo-aov", {
        field_name: "net_order_amount",
        field_type: "numeric",
        source_column: "net_amount",
        required: true,
        description: "Valor líquido do pedido",
        example_value: "189.50",
      }),
      field("demo-aov", {
        field_name: "paid_order_id",
        field_type: "string",
        source_column: "order_id",
        required: true,
        description: "Pedido pago único",
        example_value: "ord_7781",
      }),
    ],
    validation_rules: [
      rule("demo-aov", {
        rule_type: "outlier",
        severity: "warning",
        description: "Alertar se AOV diário > p99 histórico * 1.5.",
        sql_check_template:
          "-- compare daily AOV vs historical p99",
        failure_message: "AOV spike detected",
        owner_action: "Check large B2B orders and promo leakage",
      }),
      rule("demo-aov", {
        rule_type: "non_null_measure",
        severity: "critical",
        description: "net_amount não pode ser null em pedidos pagos.",
        sql_check_template:
          "select count(*) from analytics.fct_orders where payment_status='paid' and net_amount is null",
        failure_message: "Null net_amount on paid orders",
        owner_action: "Fix ETL casting for amount fields",
      }),
    ],
    usage_examples: [
      example("demo-aov", {
        type: "correct",
        title: "AOV por canal de aquisição",
        description: "Comparar ticket médio entre paid social e search.",
        explanation: "Usa mesmo filtro de pedidos pagos.",
      }),
      example("demo-aov", {
        type: "incorrect",
        title: "Dividir receita por itens vendidos",
        description: "Calcular média por item e rotular como ticket médio.",
        explanation: "Muda o grain e não é AOV de pedido.",
      }),
    ],
  },
  {
    id: "demo-activation",
    name: "Ativação de usuário",
    slug: "ativacao-de-usuario",
    status: "ready",
    business_question:
      "Qual percentual de novos usuários completa o momento aha em 7 dias?",
    description:
      "Taxa de ativação D7 para produto SaaS. Um usuário está ativado quando cria o primeiro projeto e convida um colaborador.",
    owner: "Elena Souza (Product Analytics)",
    domain: "product",
    metric_type: "rate",
    formula:
      "COUNT(users activated within 7 days) / COUNT(new users in cohort)",
    source_system: "Product events warehouse",
    source_table: "analytics.fct_user_activation",
    grain: "user_id (signup cohort day)",
    refresh_frequency: "Daily",
    default_filters: "is_internal_user = false AND signup_source != 'import'",
    numerator_definition:
      "user with first_project_created_at and first_invite_sent_at within 7 days of signup",
    denominator_definition: "users with signup_at in cohort window",
    inclusion_rules: "Novos signups orgânicos e paid, excluindo imports em massa.",
    exclusion_rules: "Usuários internos, bots e contas sandbox.",
    limitations:
      "Definição de aha pode mudar por segmento enterprise. Janela fixa de 7 dias.",
    created_at: NOW,
    updated_at: NOW,
    fields: [
      field("demo-activation", {
        field_name: "user_id",
        field_type: "string",
        source_column: "user_id",
        required: true,
        description: "Usuário recém-criado",
        example_value: "usr_9910",
      }),
      field("demo-activation", {
        field_name: "first_project_created_at",
        field_type: "timestamp",
        source_column: "first_project_created_at",
        required: true,
        description: "Timestamp do primeiro projeto",
        example_value: "2026-07-02T15:22:00Z",
      }),
      field("demo-activation", {
        field_name: "first_invite_sent_at",
        field_type: "timestamp",
        source_column: "first_invite_sent_at",
        required: true,
        description: "Timestamp do primeiro convite",
        example_value: "2026-07-03T09:10:00Z",
      }),
    ],
    validation_rules: [
      rule("demo-activation", {
        rule_type: "event_order",
        severity: "critical",
        description: "Eventos de ativação não podem ocorrer antes do signup.",
        sql_check_template:
          "select * from analytics.fct_user_activation where first_project_created_at < signup_at",
        failure_message: "Activation event before signup",
        owner_action: "Fix event clock skew / identity stitching",
      }),
      rule("demo-activation", {
        rule_type: "bounds",
        severity: "warning",
        description: "Taxa D7 deve ficar entre 0 e 1.",
        sql_check_template:
          "select cohort_day, activation_rate from analytics.mart_activation_d7 where activation_rate not between 0 and 1",
        failure_message: "Activation rate out of bounds",
        owner_action: "Inspect cohort joins",
      }),
    ],
    usage_examples: [
      example("demo-activation", {
        type: "correct",
        title: "Ativação D7 por cohort de signup",
        description:
          "Acompanhar se onboarding novo melhora ativação após 7 dias completos.",
        explanation: "Respeita a janela e a definição de aha.",
      }),
      example("demo-activation", {
        type: "incorrect",
        title: "Contar login como ativação",
        description:
          "Usar 'usuário logou 1x' como proxy de ativação no board.",
        explanation:
          "Login não prova o momento aha definido no contrato.",
      }),
    ],
  },
];

export function getDemoMetrics(): MetricContract[] {
  return DEMO_METRICS.map((metric) =>
    normalizeContract({
      ...metric,
      version: 1,
      approval: {
        state: "approved",
        submitted_at: NOW,
        decided_at: NOW,
        decision_note: "Seeded demo contract treated as approved for walkthrough.",
        reviewer_label: "Demo seed",
      },
      fields: metric.fields.map((f) => ({ ...f })),
      validation_rules: metric.validation_rules.map((r) => ({ ...r })),
      usage_examples: metric.usage_examples.map((e) => ({ ...e })),
    }),
  );
}

export function assertDemoConsistency(
  metrics: MetricContract[] = getDemoMetrics(),
): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const requiredNames = [
    "Receita líquida",
    "Taxa de conversão",
    "Churn mensal",
    "Ticket médio",
    "Ativação de usuário",
  ];

  if (metrics.length < 5) {
    errors.push(`Expected at least 5 demo metrics, got ${metrics.length}`);
  }

  for (const name of requiredNames) {
    if (!metrics.some((m) => m.name === name)) {
      errors.push(`Missing demo metric: ${name}`);
    }
  }

  for (const metric of metrics) {
    if (!metric.business_question) errors.push(`${metric.slug}: missing business_question`);
    if (!metric.formula) errors.push(`${metric.slug}: missing formula`);
    if (!metric.source_table) errors.push(`${metric.slug}: missing source_table`);
    if (!metric.grain) errors.push(`${metric.slug}: missing grain`);
    if (!metric.limitations) errors.push(`${metric.slug}: missing limitations`);
    if (metric.validation_rules.length === 0) {
      errors.push(`${metric.slug}: missing validation rules`);
    }
    const hasCorrect = metric.usage_examples.some((e) => e.type === "correct");
    const hasIncorrect = metric.usage_examples.some((e) => e.type === "incorrect");
    if (!hasCorrect) errors.push(`${metric.slug}: missing correct example`);
    if (!hasIncorrect) errors.push(`${metric.slug}: missing incorrect example`);
  }

  return { ok: errors.length === 0, errors };
}
