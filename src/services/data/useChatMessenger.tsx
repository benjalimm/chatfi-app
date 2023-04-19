import React, { useState, useEffect } from 'react'
import { Message } from '@/schema/Message';
import socket from '../networking/socket';
import { Value } from '@/schema/Value';
import { StatementData } from '@/schema/StatementData';

type Result = {
  messages: Message[],
  values: Value[],
  listOfStatementData: StatementData[],
  isChatLoading: boolean,
  sendMessage: (message: string) => void
}

export default function useChatMessenger(): Result  {
  const [messages, setMessages] = useState<Message[]>([{ id: "", text: `You can type any query that pertains to Coinbase's latest 10-Q. For example, you could ask something like "What acquisitions did Coinbase make in 2022?"`, isBot: true }]);
  const [values, setValues] = useState<Value[]>([])  
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [listOfStatementData, setListOfStatementData] = useState<StatementData[]>([])

  function sendMessage(message: string) {
     socket.emit("query", { query: message })
      const userMessage: Message = {
        id: "",
        text: message,
        isBot: false
      }
    setMessages((messages) => [...messages, userMessage])
  }


   useEffect(() => {
    socket.on(`connect`, () => {
      console.log("Connected")      
    })
    
    socket.on("message", (res) => {
      const json = JSON.parse(res)
      console.log(`RES: ${res}`)

      // 1.  Update messages
      const message: Message = {
        id: "",
        text: json.data.answer,
        isBot: true
      }
      setMessages((messages) => [...messages, message])

      // 2. Check for values and update if present
      const valuesJSON = json.data.metadata?.values

      if (valuesJSON) {
        const values = valuesJSON as Value[]

        if (values.length > 0) {
          setValues(values)
        }
      }

      // 3. Check for statement data
      const statementDataJSON = json.data.metadata?.listOfStatementData

      if (statementDataJSON) {
        const listOfStatementData = statementDataJSON as StatementData[]
        setListOfStatementData(listOfStatementData)
      }
    })

    socket.on("loading", (res) => {
      const json = JSON.parse(res)
      const loading = json.data.loading
      setIsChatLoading(loading === true)
    })

    return () => {
      socket.off('connect')
      socket.off("message")
      socket.off("loading")
    }
  },[])

  return { 
    messages,
    values,
    listOfStatementData,
    isChatLoading,
    sendMessage
  }

}