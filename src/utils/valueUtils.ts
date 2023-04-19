import { Value } from '@/schema/Value';

export function formatCurrencyNumber(n: number): string {
  const isNegative = n < 0;
  if (isNegative) n = -1 * n;
  let output = '';
  if (n < 1e3) return isNegative ? `-$${n}` : `$${n}`;
  if (n >= 1e3 && n < 1e6) output = +(n / 1e3).toFixed(1) + 'K';
  if (n >= 1e6 && n < 1e9) output = +(n / 1e6).toFixed(1) + 'M';
  if (n >= 1e9 && n < 1e12) output = +(n / 1e9).toFixed(1) + 'B';
  if (n >= 1e12) output = +(n / 1e12).toFixed(1) + 'T';
  output = isNegative ? `-$${output}` : `$${output}`;
  return output;
}

export function convertDateStringToMonthYear(dateString: string): string {
  // Months array with short names
  const months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  // Check if the input string is in the correct format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return dateString;
  }

  // Split the input string into year, month, and day parts
  const [year, month, day] = dateString.split('-');

  // Convert the year and month to the desired format
  const shortYear = year.slice(-2);
  const shortMonth = months[parseInt(month) - 1];

  // Return the formatted string
  return `${shortMonth} '${shortYear}`;
}

function sanitizeNumberString(number: string): string {
  return number.replace(/,/g, '');
}

export function outputValueString(value: Value): string {
  function formatCurrency() {
    console.log(value.value);
    let numericValue = parseFloat(sanitizeNumberString(value.value));
    console.log(numericValue);
    let multiplier = 1;
    if (value.sectionSource.toLowerCase().includes('.txt')) {
      switch (value.multiplier) {
        case 'IN_MILLIONS':
          multiplier = 1000000;
          break;
        case 'IN_THOUSANDS':
          multiplier = 1000;
          break;
      }
    }
    return formatCurrencyNumber(numericValue * multiplier);
  }
  console.log(value.unit);
  switch (value.unit) {
    case 'DOLLARS':
      return formatCurrency();
    case 'USD':
      return formatCurrency();

    default: {
      return `${value.value}`;
    }
  }
}

export function camelCaseToNormalText(camelCasedString: string): string {
  // Check if the input string is non-empty
  if (camelCasedString.length === 0) {
    return '';
  }

  // Capitalize the first character and use a regex to match upper-case characters
  // and insert a space before them
  const stringWithSpaces =
    camelCasedString.charAt(0).toUpperCase() + camelCasedString.slice(1).replace(/([A-Z])/g, ' $1');

  // Convert the stringWithSpaces to lower case except for the first character
  const result = stringWithSpaces.charAt(0) + stringWithSpaces.slice(1).toLowerCase();

  return result;
}

export function formatDateRange(dateRange: string): string {
  const [startDateStr, endDateStr] = dateRange.split(' - ');
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const endMonth = endDate.toLocaleString('default', { month: 'short' });
  const endYear = endDate.getFullYear().toString().slice(-2);

  return `${months} months ending ${endMonth} '${endYear}`;
}
