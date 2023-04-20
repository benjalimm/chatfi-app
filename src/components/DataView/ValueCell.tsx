import style from "./ValueCell.module.css";
import { Value } from "@/schema/Value";
import { camelCaseToNormalText, outputValueString } from "@/utils/valueUtils";

type Props = {
  value: Value;
  inlineStyle: React.CSSProperties;
  onClick?: () => void;
};
export default function ValueCell({ value, inlineStyle, onClick }: Props) {
  const isNegativeValue = parseFloat(value.value) < 0;
  // Parse value string
  let valueString: string = outputValueString(value);
  if (valueString.length >= 30) {
    valueString = valueString.substring(0, 30) + "...";
  }

  // Parse title
  let MAX_TITLE_LENGTH = 30;
  let title: string = value.title;
  if (value.title.length >= MAX_TITLE_LENGTH) {
    title = `${value.title.substring(0, MAX_TITLE_LENGTH)}...`;
  }

  // Parse statement source
  let MAX_STATEMENT_LENGTH = 20;
  let statementSource: string = value.statementSource;
  if (value.statementSource.length >= MAX_STATEMENT_LENGTH) {
    statementSource = `${value.statementSource.substring(
      0,
      MAX_STATEMENT_LENGTH
    )}...`;
  }

  // Change value color based on value
  const valueStyles = isNegativeValue
    ? `${style.value} ${style.negativeValue}`
    : style.value;

  return (
    <div className={style.main} style={inlineStyle} onClick={onClick}>
      <div className={style.container}>
        <span className={style.title}>{title}</span>
        <span className={valueStyles}>{valueString}</span>
        <span className={style.statementSource}>
          {camelCaseToNormalText(statementSource)}
        </span>
      </div>
    </div>
  );
}
