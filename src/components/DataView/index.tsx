import { Value } from '@/schema/Value';
import React from 'react';
import style from './index.module.css'
import ValueCell from './ValueCell';

type Props = { values: Value[] }
export default function DataView({ values }:Props) {
  return <div className={style.main}>
    { values.map((value,i) => {
      return <ValueCell key={i} value={value}/>
    })}
  </div>
}