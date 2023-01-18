import { Message } from '@/schema/Message';
import React from 'react';
import style from './MessagesContainer.module.css'
import { Inter } from '@next/font/google'



export default function MessagesContainer({ messages }: { messages: Message[]}) {
  return <div className={style.main}>
    { messages.map((message, i) => <Message key={i} message={message}/>)}
  </div>
}

function Message({ message }: { message: Message }) {

  const alignmentStyle = message.isBot ? style.bot : style.user;
  const bubbleStyle = message.isBot ? style.botBubble: style.userBubble;
  return <div className={`${style.message} ${alignmentStyle}`}>
    <div className={`${style.bubble} ${bubbleStyle}`}>
      {message.text}
    </div>
  </div>
}