import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import ChatView from '@/components/ChatView'
import DataView from '@/components/DataView'
import { Message } from '@/schema/Message';
import Modal from '@/components/Modal'


import io from 'socket.io-client'
import axios from 'axios'

import { useEffect, useState } from 'react'
import { Value } from '@/schema/Value'
import FinancialStatement from '@/components/DataView/FinancialStatement'
import { instantStringData } from 'sampleData/instantData'
import { isRangePeriod, TableOfLineItems } from '@/schema/TableOfLineItems'

const inter = Inter({ subsets: ['latin'] })
const domain = "http://localhost:3000"
// const socket = io("https://damp-springs-38226.herokuapp.com")
const socket = io(domain)
const data = JSON.parse(instantStringData).data as TableOfLineItems
export default function Home() {

  const [messages, setMessages] = useState<Message[]>([{ id: "", text: `You can type any query that pertains to Coinbase's latest 10-Q. For example, you could ask something like "What acquisitions did Coinbase make in 2022?"`, isBot: true }]);

  const [values, setValues] = useState<Value[]>([])  
  const isValuesEmpty = values.length < 1;
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(true);
  const [lineItems, setLineItems] = useState<TableOfLineItems>(data)

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

      // Update messages
      const message: Message = {
        id: "",
        text: json.data.answer,
        isBot: true
      }
      setMessages((messages) => [...messages, message])

      // Check for values and update if present
      const valuesJSON = json.data.metadata?.values

      if (valuesJSON) {
        const values = valuesJSON as Value[]

        if (values.length > 0) {
          setValues(values)
        }
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

  function getTableType(): "range" | "instant" {

    if (lineItems.lineItems === undefined) {
      return "instant"
    }

    const [key, firstLineItem] = Object.entries(lineItems.lineItems)[0]
    if ((firstLineItem) && isRangePeriod(firstLineItem.period)) {
      return "range"
    }
    return "instant"
  }

  async function onValueSelected(value: Value) {

    try {
      const response = await axios.get(domain + `/api/pFiling/${value.filingId}/${value.statementSource}`)
      const data = response.data
      const lineItems = data.data as TableOfLineItems
      setLineItems(lineItems)
      openModal()
    } catch (e) {
      console.log(e)
    }
    
  }

  return (
    <>
      <Head>
        <title>Chatfi</title>
        <meta name="description" content="Query Coinbase's latest 10-Q" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.content}>
          <DataView 
          values={values} 
          onValueSelected={onValueSelected}
          customStyle={{ display: isValuesEmpty ?"none" : "grid"}}
          />
          <ChatView messages={messages}
          onMessage={onMessage}
          isChatLoading={isChatLoading}
          />
        </div>
        <Modal show={showModal} handleClose={closeModal}>
          <FinancialStatement 
          tableOfLineItems={lineItems}  
          statementType={getTableType()}
          />
        </Modal>
      </main>
    </>
  )
}
