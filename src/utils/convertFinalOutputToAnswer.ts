import { Value } from "@/schema/Value";
import { outputValueString } from "./valueUtils";

export default function convertFinalOutputToString(
  rawAnswer: string,
  values: Value[]
): string {
  let answer: string = rawAnswer;
  values.forEach((value) => {
    answer = answer.replace(`@${value.key}`, outputValueString(value));
  });
  return answer;
}
