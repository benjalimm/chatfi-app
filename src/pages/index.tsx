import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import ChatView from '@/components/ChatView'
import DataView from '@/components/DataView'
import { Message } from '@/schema/Message';
import Modal from '@/components/Modal'


import io from 'socket.io-client'
import axios from 'axios'

import ContentView from '@/components/ContentView'

export default function Home() {

  return (
    <>
      <Head>
        <title>Chatfi</title>
        <meta name="description" content="Query Coinbase's latest 10-Q" />
      </Head>
      <ContentView/>
      
    </>
  )
}
