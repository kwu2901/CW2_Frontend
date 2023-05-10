
import { useState, useEffect } from "react";
import { MessageModel } from "../model/MessageModel";
import styles from "./Message.module.css";
import { User } from "../model/UserModel";

interface MessageProps {
    message: MessageModel;
    reply: boolean;
  }
  
  const MessageItem: React.FC<MessageProps> = ({ message, reply }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [replyOpen, setReplyOpen] = useState(reply);
    const [replyMessage, setReplyMessage] = useState("");

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          setUser(JSON.parse(loggedInUser));
        }
      }, []);
    
      const handleToggle = async () => {
        if (!message.read) {
          try {
            const options = {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                read: true,
              }),
            };
      
            const response = await fetch(
              `https://backend.kwu2901.repl.co/updateMessages/${message._id}`,
              options
            );
            if(response.ok){
                message.read=true;
            }
          } catch (error) {
            console.error(error);
          }
        }
        setIsOpen(!isOpen);
      };
      

    const handleReplyClick = () => {
        setReplyOpen(!replyOpen);
    };

    const handleSendClick = async () => {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            user_id: message?.user_id,
            title: message.title,
            content: replyMessage,
            read: false,
          }),
        };
      
        try {
          const response = await fetch("https://backend.kwu2901.repl.co/addMessages", options);
          const data = await response.json();
          console.log(data);
          alert("Send successfully!")
          window.location.reload();
        } catch (error) {
          console.error(error);
        }
      };

      const handleDelete = async () => {
        const options = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
      
        try {
          const response = await fetch(`https://backend.kwu2901.repl.co/delMessages/${message._id}`, options);
          const data = await response.json();
          //console.log(data);
          alert("Message deleted successfully");
          window.location.reload();
        } catch (error) {
          console.error(error);
        }
      };
      

    return ( 
        <div className={styles.formGroup}>
        <div className={styles.form} onClick={handleToggle}>
        {message.read ? null : <span className={styles.unread}>Unread</span>}
        {message.title}
        </div>
        {isOpen && (
          <div className={styles.form}>
            {message.content}
            <p/>
            <div>
              <button className={styles.button} onClick={handleReplyClick}>Reply</button>
              {user?.staff && 
                <button className={styles.button2} onClick={handleDelete}>Delete</button>
              }
            </div>
          </div>
        )}
        {replyOpen && (
          <div className={styles.formGroup2}>
            <textarea
              className={styles.input}
              placeholder="Type your message here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <div className={styles.reply}>
            <button className={styles.button} onClick={handleSendClick}>Send</button>
            </div>
          </div>
        )}
        </div>

     );
  }
   
  export default MessageItem;
  