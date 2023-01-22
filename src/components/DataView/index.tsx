import { Value } from '@/schema/Value';
import React from 'react';
import style from './index.module.css'
import ValueCell from './ValueCell';

type Props = { values: Value[], customStyle: React.CSSProperties }
export default function DataView({ values, customStyle }:Props) {
  
  return <div className={style.main} style={customStyle}>
    { values.map((value,i) => {
      const animationDuration = `${0.3 + (i * 0.1)}s`
      // const animationDuration = "0.2s"
      return <ValueCell key={i} value={value} 
      inlineStyle={{animationDuration}}
        />
    })}
  </div>
}