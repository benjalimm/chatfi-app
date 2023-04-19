export type Value = {
  key: string;
  value: string;
  unit: string;
  title: string;
  statementSource: string;
  sectionSource: string;
  filingId: string;
  multiplier: 'NONE' | 'IN_THOUSANDS' | 'IN_MILLIONS';
};
