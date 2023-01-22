import { Value } from "@/schema/Value";


export function formatCurrencyNumber(n: number): string {
  const isNegative = n < 0;
  if (isNegative) n = -1 * n;
  let output = '';
  if (n < 1e3) return isNegative ? `-$${n}` : `$${n}`
  if (n >= 1e3 && n < 1e6) output = +(n / 1e3).toFixed(1) + 'K';
  if (n >= 1e6 && n < 1e9) output = +(n / 1e6).toFixed(1) + 'M';
  if (n >= 1e9 && n < 1e12) output = +(n / 1e9).toFixed(1) + 'B';
  if (n >= 1e12) output = +(n / 1e12).toFixed(1) + 'T';
  output = isNegative ? `-$${output}` : `$${output}`;
  return output;
}

function sanitizeNumberString(number: string): string {
  return number.replace(/,/g, '');
}

export function outputValueString(value: Value): string {
  function formatCurrency() {
    console.log(value.value)
      let numericValue = parseFloat(sanitizeNumberString(value.value));
      console.log(numericValue)
      let multiplier = 1;
      if (
        value.sectionSource.toLowerCase().includes('.txt') 
      ) {
        
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
    console.log(value.unit)
  switch (value.unit) {
    // case 'PERCENTAGE':
    //   return `${(parseFloat(value.value) * 100).toFixed(2)}%`;
    case 'DOLLARS': 
      return formatCurrency()
    case "USD":
      return formatCurrency()

    default: {
      return `${value.value}`;
    }
  }
}
