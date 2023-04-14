import React from 'react';
import { TableOfLineItems, isInstantPeriod, isRangePeriod } from '@/schema/TableOfLineItems';
import { formatCurrencyNumber, camelCaseToNormalText, formatDateRange, convertDateStringToMonthYear } from '@/utils/valueUtils';

type FinancialStatementProps = {
  tableOfLineItems: TableOfLineItems;
  statementType: 'instant' | 'range';
};

const FinancialStatement: React.FC<FinancialStatementProps> = ({ tableOfLineItems, statementType }) => {
  const filteredLineItems: TableOfLineItems = {};

  Object.entries(tableOfLineItems).forEach(([key, lineItems]) => {
    filteredLineItems[key] = lineItems.filter((item) => {
      return statementType === 'instant'
        ? isInstantPeriod(item.period)
        : isRangePeriod(item.period);
    });
  });

  const dates: string[] = [];
  Object.values(filteredLineItems).forEach((lineItems) => {
    lineItems.forEach((item) => {
      const date = isInstantPeriod(item.period)
        ? item.period.instant
        : `${item.period.startDate} - ${item.period.endDate}`;
      if (!dates.includes(date)) {
        dates.push(date);
      }
    });
  });

  return (
    <div className="w-full h-full">
      <table className="w-full h-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Line Item</th>
            {dates.map((date) => (
              <th key={date} className="border px-4 py-2">
                {statementType === 'instant' ? 
                convertDateStringToMonthYear(date) : 
                formatDateRange(date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(filteredLineItems).map(([key, lineItems]) => (
            <tr key={key}>
              <td className="border px-4 py-2">{camelCaseToNormalText(key)}</td>
              {dates.map((date) => {
                const lineItem = lineItems.find((item) => {
                  const itemDate = isInstantPeriod(item.period)
                    ? item.period.instant
                    : `${item.period.startDate} - ${item.period.endDate}`;
                  return date === itemDate;
                });

                return (
                  <td key={date} className="border px-4 py-2">
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
