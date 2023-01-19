import style from "./ValueCell.module.css"
import { Value } from "@/schema/Value"

export default function ValueCell({value}: {value: Value}) {

  const isNegativeValue = value.value < 0;
  // Parse value string
  let valueString: string;
  console.log(value)
  switch (value.unit) {
    case 'PERCENTAGE':
      valueString = `${value.value}%`;
      break
    case "DOLLARS": {
      let minusSign = '';
      if (isNegativeValue) {
        minusSign='-';
      }
      valueString = `${minusSign}$${abbreviateNumber(value.value)}`;
      break
    }
    default: {
      valueString = `${value.value}`
    }
  }
    

  // Parse title
  let MAX_TITLE_LENGTH = 30
  let title: string = value.title
  if (value.title.length >= MAX_TITLE_LENGTH) {
    title = `${value.title.substring(0, MAX_TITLE_LENGTH)}...`
  }

  // Parse statement source
  let MAX_STATEMENT_LENGTH = 20
  let statementSource: string = value.statementSource
  if (value.statementSource.length >= MAX_STATEMENT_LENGTH) {
    statementSource = `${value.statementSource.substring(0, MAX_STATEMENT_LENGTH)}...`
  }

  // Change value color based on value
  const valueStyles = isNegativeValue ? 
  `${style.value} ${style.negativeValue}` : style.value

  return <div className={style.main}>
    <div className={style.container}>
      <span className={style.title}>{title}</span>
      <span className={valueStyles}>{valueString}</span>
      <span className={style.statementSource}>{statementSource}</span>
    </div>
    
  </div>
  
}


const abbreviateNumber = (n: number) => {
  let isNegative = n < 0;
  if (isNegative) n = -1 * n;
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
  if (isNegative) return -1 * n;
  return n;
};