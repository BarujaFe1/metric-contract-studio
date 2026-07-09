import { isRatioLike, type MetricContract } from "./metric-model";
import { validateMetric } from "./validation";

export interface ScoreComponent {
  id: string;
  label: string;
  max: number;
  earned: number;
  details: string[];
}

export interface MaturityScoreResult {
  score: number;
  components: ScoreComponent[];
  summary: string;
}

function hasText(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function calculateMaturityScore(
  metric: MetricContract,
): MaturityScoreResult {
  const validation = validateMetric(metric);
  const components: ScoreComponent[] = [];

  // Business definition — 20
  const businessDetails: string[] = [];
  let business = 0;
  if (hasText(metric.business_question)) {
    business += 8;
    businessDetails.push("+8 business question");
  } else {
    businessDetails.push("−8 missing business question");
  }
  if (hasText(metric.description) && metric.description.trim().length >= 40) {
    business += 7;
    businessDetails.push("+7 solid description");
  } else if (hasText(metric.description)) {
    business += 3;
    businessDetails.push("+3 short description");
    businessDetails.push("−4 description could be richer");
  } else {
    businessDetails.push("−7 missing description");
  }
  if (hasText(metric.inclusion_rules) || hasText(metric.exclusion_rules)) {
    business += 5;
    businessDetails.push("+5 inclusion/exclusion rules");
  } else {
    businessDetails.push("−5 missing inclusion/exclusion rules");
  }
  components.push({
    id: "business",
    label: "Business definition",
    max: 20,
    earned: business,
    details: businessDetails,
  });

  // Formula & fields — 20
  const formulaDetails: string[] = [];
  let formulaScore = 0;
  if (hasText(metric.formula) && metric.formula.trim().length >= 12) {
    formulaScore += 10;
    formulaDetails.push("+10 documented formula");
  } else if (hasText(metric.formula)) {
    formulaScore += 4;
    formulaDetails.push("+4 short formula");
    formulaDetails.push("−6 formula needs more detail");
  } else {
    formulaDetails.push("−10 missing formula");
  }
  if (metric.fields.length > 0) {
    formulaScore += 5;
    formulaDetails.push(`+5 ${metric.fields.length} field(s) defined`);
  } else {
    formulaDetails.push("−5 no fields defined");
  }
  if (metric.fields.some((f) => f.required)) {
    formulaScore += 5;
    formulaDetails.push("+5 required fields marked");
  } else {
    formulaDetails.push("−5 no required fields");
  }
  if (isRatioLike(metric.metric_type)) {
    if (
      hasText(metric.numerator_definition) &&
      hasText(metric.denominator_definition)
    ) {
      formulaDetails.push("+ratio numerator/denominator present");
    } else {
      formulaScore = Math.max(0, formulaScore - 5);
      formulaDetails.push("−5 ratio/rate missing numerator or denominator");
    }
  }
  components.push({
    id: "formula",
    label: "Formula & fields",
    max: 20,
    earned: Math.min(20, formulaScore),
    details: formulaDetails,
  });

  // Source & grain — 20
  const sourceDetails: string[] = [];
  let source = 0;
  if (hasText(metric.source_system)) {
    source += 5;
    sourceDetails.push("+5 source system");
  } else {
    sourceDetails.push("−5 missing source system");
  }
  if (hasText(metric.source_table)) {
    source += 5;
    sourceDetails.push("+5 source table");
  } else {
    sourceDetails.push("−5 missing source table");
  }
  if (hasText(metric.grain)) {
    source += 6;
    sourceDetails.push("+6 grain defined");
  } else {
    sourceDetails.push("−6 missing grain");
  }
  if (hasText(metric.default_filters)) {
    source += 4;
    sourceDetails.push("+4 default filters");
  } else {
    sourceDetails.push("−4 missing default filters");
  }
  components.push({
    id: "source",
    label: "Source & granularity",
    max: 20,
    earned: source,
    details: sourceDetails,
  });

  // Validations — 20
  const validationDetails: string[] = [];
  let validations = 0;
  const ruleCount = metric.validation_rules.length;
  if (ruleCount >= 2) {
    validations += 12;
    validationDetails.push(`+12 ${ruleCount} validation rules`);
  } else if (ruleCount === 1) {
    validations += 8;
    validationDetails.push("+8 one validation rule");
    validationDetails.push("−4 prefer at least two checks");
  } else {
    validationDetails.push("−12 no validation rules");
  }
  const hasCriticalRule = metric.validation_rules.some(
    (r) => r.severity === "critical",
  );
  if (hasCriticalRule) {
    validations += 5;
    validationDetails.push("+5 critical severity rule present");
  } else if (ruleCount > 0) {
    validationDetails.push("−5 no critical severity rule");
  }
  const hasSqlCheck = metric.validation_rules.some((r) =>
    hasText(r.sql_check_template),
  );
  if (hasSqlCheck) {
    validations += 3;
    validationDetails.push("+3 SQL check template present");
  } else if (ruleCount > 0) {
    validationDetails.push("−3 missing SQL check templates");
  }
  components.push({
    id: "validations",
    label: "Validations",
    max: 20,
    earned: Math.min(20, validations),
    details: validationDetails,
  });

  // Limitations & examples — 10
  const limDetails: string[] = [];
  let lim = 0;
  if (hasText(metric.limitations) && metric.limitations.trim().length >= 20) {
    lim += 4;
    limDetails.push("+4 limitations documented");
  } else if (hasText(metric.limitations)) {
    lim += 2;
    limDetails.push("+2 short limitations");
  } else {
    limDetails.push("−4 missing limitations");
  }
  const correct = metric.usage_examples.filter((e) => e.type === "correct");
  const incorrect = metric.usage_examples.filter((e) => e.type === "incorrect");
  if (correct.length > 0) {
    lim += 3;
    limDetails.push("+3 correct usage example");
  } else {
    limDetails.push("−3 missing correct usage example");
  }
  if (incorrect.length > 0) {
    lim += 3;
    limDetails.push("+3 incorrect usage example");
  } else {
    limDetails.push("−3 missing incorrect usage example");
  }
  components.push({
    id: "limitations",
    label: "Limitations & examples",
    max: 10,
    earned: lim,
    details: limDetails,
  });

  // Owner & maintenance — 10
  const ownerDetails: string[] = [];
  let owner = 0;
  if (hasText(metric.owner)) {
    const generic = [
      "time de dados",
      "data team",
      "analytics",
      "bi",
      "equipe de dados",
      "dados",
    ].includes(metric.owner.trim().toLowerCase());
    if (generic) {
      owner += 2;
      ownerDetails.push("+2 owner present but generic");
    } else {
      owner += 5;
      ownerDetails.push("+5 named owner");
    }
  } else {
    ownerDetails.push("−5 missing owner");
  }
  if (hasText(metric.refresh_frequency)) {
    owner += 5;
    ownerDetails.push("+5 refresh frequency");
  } else {
    ownerDetails.push("−5 missing refresh frequency");
  }
  components.push({
    id: "ownership",
    label: "Owner & maintenance",
    max: 10,
    earned: owner,
    details: ownerDetails,
  });

  const score = components.reduce((sum, c) => sum + c.earned, 0);
  const summary =
    score >= 85
      ? "Production-ready contract with strong governance signals."
      : score >= 65
        ? "Solid draft — close remaining gaps before broad adoption."
        : score >= 40
          ? "Early contract — critical definition gaps remain."
          : "Incomplete contract — not safe for decision-making yet.";

  // Soft penalty awareness from critical alerts (already reflected in components)
  void validation;

  return { score, components, summary };
}

export function maturityBand(score: number): "low" | "medium" | "high" {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}
