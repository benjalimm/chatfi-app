import React, { useState, useEffect } from 'react';
import { Message } from '@/schema/Message';
import { Value } from '@/schema/Value';
import { TableOfLineItems } from '@/schema/TableOfLineItems';
import { StatementData } from '@/schema/StatementData';
import useChatMessenger from '@/services/data/useChatMessenger';

type ViewModel = {
  values: Value[];
  messages: Message[];
  isChatLoading: boolean;
  showModal: boolean;
  lineItems: TableOfLineItems | undefined;
  highlightInfo: { sectionKey: string; value: number } | undefined;
  listOfStatementData: StatementData[];

  onValueSelected: (value: Value) => void;
  onMessage: (message: string) => void;
  closeModal: () => void;
  openModal: () => void;
};

export default function useContentViewModel(): ViewModel {
  const { messages, values, listOfStatementData, isChatLoading, sendMessage } = useChatMessenger();

  const [showModal, setShowModal] = useState(true);
  const [lineItems, setLineItems] = useState<TableOfLineItems>();
  const [highlightInfo, setHighlightInfo] = useState<{ sectionKey: string; value: number }>();

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  async function onValueSelected(value: Value) {
    console.log(listOfStatementData.length);
    // 1. Find relevant statement data
    const statementData = listOfStatementData.find((statementData) => {
      return (
        value.filingId === statementData.filingId &&
        value.statementSource === statementData.statement
      );
    });

    if (statementData) {
      // 2. Convert statement data to line items
      if (statementData.type === 'LINE_ITEMS') {
        const lineItems = JSON.parse(statementData.data) as TableOfLineItems;
        setHighlightInfo({ sectionKey: value.sectionSource, value: parseInt(value.value) });
        setLineItems(lineItems);
        openModal();
      }
    } else {
      console.log('Statement data does not exist');
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
    onMessage: sendMessage,
    closeModal,
    openModal
  };
}
