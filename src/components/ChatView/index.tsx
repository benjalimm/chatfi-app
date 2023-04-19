import { Message } from '@/schema/Message';
import React, { useRef, useState } from 'react';
import ChatInput from './ChatInput';
import style from "./index.module.css";
import MessagesContainer from './MessagesContainer';

type Props = { 
  messages: Message[],
  onMessage: (message: string) => void, 
  isChatLoading: boolean
}
export default function ChatView({ messages, onMessage, isChatLoading }: Props) {
  const [currentInputText, setCurrentInputText] = useState<string>("");

  function onChange(event: React.FormEvent<HTMLInputElement>) {
    setCurrentInputText(event.currentTarget.value);
  }

  function onEnter() {
    setCurrentInputText("");
    onMessage(currentInputText);
  }

  return <div className={style.main}>
    <MessagesContainer messages={messages}/>
    <ChatInput 
    onChange={onChange} 
    text={currentInputText}
    onEnter={onEnter}
    isChatLoading={isChatLoading}
    />
  </div>
}