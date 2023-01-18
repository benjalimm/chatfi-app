import React from 'react';
import style from './ChatInput.module.css';

export default function ChatInput({ onChange, text, onEnter } :
  { 
    onChange: (event: React.FormEvent<HTMLInputElement>) => void,
    text: string,
    onEnter: () => void
   }) {

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === "Enter") {
        onEnter()
      }
    }
  return <div className={style.main}>
    <input className={style.input} type="text" value={text} placeholder={
      "Type query here"
    } onChange={onChange} onKeyDown={onKeyDown}/>
  </div>
}