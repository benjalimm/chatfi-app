import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import ChatView from '@/components/ChatView'
import DataView from '@/components/DataView'
import Modal from '@/components/Modal'
import FinancialStatement from '@/components/DataView/FinancialStatement'
import useContentViewModel from './useContentViewModel';
const inter = Inter({ subsets: ['latin'] })

export default function ContentView() {

  const {
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
    openModal
   } = useContentViewModel()
  
  return <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.content}>
          <DataView 
          values={values} 
          onValueSelected={onValueSelected}
          customStyle={{ display: (values.length < 1) ?"none" : "grid"}}
          />
          <ChatView messages={messages}
          onMessage={onMessage}
          isChatLoading={isChatLoading}
          />
        </div>
        <Modal show={showModal} handleClose={closeModal}>
          { (lineItems !== undefined) ? <FinancialStatement 
          tableOfLineItems={lineItems}  
          highlightInfo={highlightInfo} 
          /> : null 
          }
        </Modal>
      </main>
}