import { WizardState, SituationFields } from '../context/WizardContext';

export function buildPrompt(field: keyof SituationFields, state: WizardState) {
  const { personal, family, situation, lang } = state;

  const base = [
    `Language: ${lang === 'en' ? 'English' : 'Arabic'}`,
    `Citizen name: ${personal.name || 'Not provided'}`,
    `Employment status: ${family.employmentStatus || 'Not provided'}`,
    `Monthly income: ${family.monthlyIncome ?? 'Not provided'}`,
    `Dependents: ${family.dependents}`,
  ];

  const fieldMap = {
    currentFinancialSituation: 'current financial situation',
    employmentCircumstances: 'employment circumstances',
    reasonForApplying: 'reason for applying',
  } as Record<string, string>;

  base.push(`Write a concise (2-4 short paragraphs) ${fieldMap[field]} for a government social support application.`);

  const existing = situation[field];
  if (existing?.trim()) base.push(`User already wrote: "${existing}". Expand and polish that text.`);

  return base.join('\n');
}
