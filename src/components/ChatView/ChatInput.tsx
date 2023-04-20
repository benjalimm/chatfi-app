import React from "react";
import style from "./ChatInput.module.css";
import { Seek } from "react-loading-indicators";

type Props = {
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  text: string;
  onEnter: () => void;
  isChatLoading: boolean;
};

export default function ChatInput({
  onChange,
  text,
  onEnter,
  isChatLoading,
}: Props) {
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onEnter();
    }
  }
  const opacity = isChatLoading ? "1" : "0";
  return (
    <div className={style.main}>
      <div className={style.top} style={{ opacity }}>
        <Seek color={"rgb(122, 122, 122)"} size={"small"} />
        <span className={style.loadingText}> Chatfi is typing...</span>
      </div>
      <div className={style.inputContainer}>
        <input
          className={style.input}
          type="text"
          value={text}
          placeholder={"Type query here"}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}
