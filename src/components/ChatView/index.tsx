import { Message } from '@/schema/Message';
import React, { useRef, useState } from 'react';
import ChatInput from './ChatInput';
import style from "./index.module.css"
import MessagesContainer from './MessagesContainer';




export default function ChatView() {
  const [currentInputText, setCurrentInputText] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([{ id: "", text: `You can type any query that pertains to Coinbase's latest 10-Q. For example, you could ask something like "What acquisitions did Coinbase make in 2022?"`, isBot: true }]);

  function onChange(event: React.FormEvent<HTMLInputElement>) {
    setCurrentInputText(event.currentTarget.value);
  }

  function onEnter() {
    setMessages([...messages, { id: "", text: currentInputText, isBot: false }]);
    setCurrentInputText("");
  }

  return <div className={style.main}>
    <MessagesContainer messages={messages}/>
    <ChatInput 
    onChange={onChange} 
    text={currentInputText}
    onEnter={onEnter}
    />
  </div>
}