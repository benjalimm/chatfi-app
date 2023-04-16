import React from 'react';
import { TableOfLineItems, isInstantPeriod, isRangePeriod, Period, LineItem } from '@/schema/TableOfLineItems';
import { formatCurrencyNumber, camelCaseToNormalText, formatDateRange, convertDateStringToMonthYear } from '@/utils/valueUtils';

type FinancialStatementProps = {
  tableOfLineItems: TableOfLineItems;
};

const FinancialStatement: React.FC<FinancialStatementProps> = ({ tableOfLineItems }) => {

  const lineItemGroups: { [key: string]: LineItem[] } = {};
  Object.entries(tableOfLineItems).forEach(([key, lineItems]) => {
    if (!lineItemGroups[key]) {
      lineItemGroups[key] = [];
    }
    lineItemGroups[key] = [...lineItemGroups[key], ...lineItems];
  });

  const periods: Period[] = [];
  Object.values(lineItemGroups).forEach((lineItems) => {
    lineItems.forEach((item) => {
      if (!periods.find((period) => getKeyFromPeriod(period) === getKeyFromPeriod(item.period))) {
        periods.push(item.period);
      }
      
    });
  });

  function getKeyFromPeriod(period: Period): string {
    return isInstantPeriod(period) ? period.instant : `${period.startDate} - ${period.endDate}`;
  }

  function getDateStringFromPeriod(period: Period): string {
    const key = getKeyFromPeriod(period)

    if (isInstantPeriod(period)) {
      return convertDateStringToMonthYear(key)
    }
    return formatDateRange(key)
  }

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

                return (
                  <td key={getKeyFromPeriod(period)} className="border px-4 py-2">
                    {lineItem ? formatCurrencyNumber(parseInt(lineItem.value)) : '-'}
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
