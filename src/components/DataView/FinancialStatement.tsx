import React from "react";
import {
  TableOfLineItems,
  isInstantPeriod,
  isRangePeriod,
  Period,
  LineItem,
} from "@/schema/TableOfLineItems";
import {
  formatCurrencyNumber,
  camelCaseToNormalText,
  formatDateRange,
  convertDateStringToMonthYear,
} from "@/utils/valueUtils";

type FinancialStatementProps = {
  tableOfLineItems: TableOfLineItems;
  highlightInfo?: { sectionKey: string; value: number };
};

const FinancialStatement: React.FC<FinancialStatementProps> = ({
  tableOfLineItems,
  highlightInfo,
}) => {
  function getKeyFromPeriod(period: Period): string {
    return isInstantPeriod(period)
      ? period.instant
      : `${period.startDate} - ${period.endDate}`;
  }

  function getDateStringFromPeriod(period: Period): string {
    const key = getKeyFromPeriod(period);

    if (isInstantPeriod(period)) {
      return convertDateStringToMonthYear(key);
    }
    return formatDateRange(key);
  }

  function isHighlighted(lineItemKey: string, value: number | null): boolean {
    if (!highlightInfo) return false;

    const { sectionKey, value: highlightValue } = highlightInfo;
    return lineItemKey === sectionKey && value === highlightValue;
  }

  // 1. Group line items by section
  const lineItemGroups: { [key: string]: LineItem[] } = {};
  Object.entries(tableOfLineItems).forEach(([key, lineItems]) => {
    if (!lineItemGroups[key]) {
      lineItemGroups[key] = [];
    }
    lineItemGroups[key] = [...lineItemGroups[key], ...lineItems];
  });

  // 2. Get all periods
  const periods: Period[] = [];
  Object.values(lineItemGroups).forEach((lineItems) => {
    lineItems.forEach((item) => {
      if (
        !periods.find(
          (period) => getKeyFromPeriod(period) === getKeyFromPeriod(item.period)
        )
      ) {
        periods.push(item.period);
      }
    });
  });

  return (
    <div className="w-full h-full">
      <table className="w-full h-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Line Item</th>
            {periods.map((period) => (
              <th key={getKeyFromPeriod(period)} className="border px-4 py-2">
                {getDateStringFromPeriod(period)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(lineItemGroups).map(([key, lineItems]) => (
            <tr key={key}>
              <td className="border px-4 py-2">{camelCaseToNormalText(key)}</td>
              {periods.map((period) => {
                const lineItem = lineItems.find((item) => {
                  const itemDate = getKeyFromPeriod(item.period);
                  const periodKey = getKeyFromPeriod(period);
                  return periodKey === itemDate;
                });

                const value = lineItem ? parseInt(lineItem.value) : null;
                const highlightClass = isHighlighted(key, value)
                  ? "bg-green-500"
                  : "";

                return (
                  <td
                    key={getKeyFromPeriod(period)}
                    className={`border px-4 py-2 ${highlightClass}`}
                  >
                    {lineItem && value ? formatCurrencyNumber(value) : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialStatement;
