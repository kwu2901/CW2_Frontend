import { useState, useEffect } from "react";
import styles from "./Message.module.css";
import { MessageModel } from "../model/MessageModel";
import MessageItem from "./MessageItem";

interface Props {
  message: MessageModel[];
  reply: boolean;
  onClose: () => void;
}

const Message: React.FC<Props> = ({ message, reply, onClose  }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h3 className={styles.title}>Message</h3>
        
        {message.map((msg) => (
          <MessageItem
            message={msg}
            reply={reply}
          />
        ))}
        
      </div>
    </div>
  );
};

export default Message;
