export type LineItem = {
  decimals: string;
  unitRef: string;
  segment?: {
    dimension: string;
    value: string;
  };
  period: Period;
  value: string;
};

export type InstantPeriod = {
  instant: string;
};

export type RangePeriod = {
  startDate: string;
  endDate: string;
};

export type Period = InstantPeriod | RangePeriod;
export type TableOfLineItems = { [key: string]: LineItem[] };
export type ListOfTableOfLineItems = { [key: string]: TableOfLineItems };

// Type methods
export function isInstantPeriod(period: Period): period is InstantPeriod {
  return (period as InstantPeriod).instant !== undefined;
}

export function isRangePeriod(period: Period): period is RangePeriod {
  return (period as RangePeriod).startDate !== undefined && (period as RangePeriod).endDate !== undefined;
}
