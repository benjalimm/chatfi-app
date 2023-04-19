import React, { useState, useEffect } from 'react'
import { Message } from '@/schema/Message';
import { Value } from '@/schema/Value'
import { TableOfLineItems } from '@/schema/TableOfLineItems'
import { StatementData } from '@/schema/StatementData'

import io from 'socket.io-client'



const domain = "http://localhost:3000"
// const socket = io("https://damp-springs-38226.herokuapp.com")
const socket = io(domain)

interface ViewModel {
  values: Value[],
  messages: Message[],
  isChatLoading: boolean,
  showModal: boolean,
  lineItems: TableOfLineItems | undefined,
  highlightInfo: { sectionKey: string, value: number } | undefined,
  listOfStatementData: StatementData[],


  onValueSelected: (value: Value) => void,
  onMessage: (message: string) => void,
  closeModal: () => void,
  openModal: () => void
}

export default function useContentViewModel(): ViewModel {
  const [messages, setMessages] = useState<Message[]>([{ id: "", text: `You can type any query that pertains to Coinbase's latest 10-Q. For example, you could ask something like "What acquisitions did Coinbase make in 2022?"`, isBot: true }]);

  const [values, setValues] = useState<Value[]>([])  
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(true);
  const [lineItems, setLineItems] = useState<TableOfLineItems>()
  const [highlightInfo, setHighlightInfo] = useState<{ sectionKey: string, value: number }>()
  const [listOfStatementData, setListOfStatementData] = useState<StatementData[]>([])

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
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

  function onMessage(message: string) {
    socket.emit("query", { query: message })
    const userMessage: Message = {
      id: "",
      text: message,
      isBot: false
    }
    setMessages((messages) => [...messages, userMessage])
  }

  async function onValueSelected(value: Value) {
    console.log(listOfStatementData.length)
    // 1. Find relevant statement data
    const statementData = listOfStatementData.find((statementData) => {
      return (value.filingId === statementData.filingId && value.statementSource === statementData.statement)
    })

    if (statementData) {
      // 2. Convert statement data to line items
      if (statementData.type === "LINE_ITEMS") {
        const lineItems = JSON.parse(statementData.data )as TableOfLineItems
        setHighlightInfo({ sectionKey: value.sectionSource, value: parseInt(value.value) })
        setLineItems(lineItems)
        openModal()
      }

    } else {
      console.log("Statement data does not exist")
      // TODO: Fetch manually from API
    }
    
  }

  return {
    values,
    messages,
    isChatLoading,
    showModal,
    lineItems,
    highlightInfo,
    listOfStatementData,
    onValueSelected,
    onMessage,
    closeModal,
    openModal,
  }

}