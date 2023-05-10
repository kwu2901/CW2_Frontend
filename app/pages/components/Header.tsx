import { FunctionComponent, useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Message from "./Message";
import styles from "./Header.module.css";
import Avatar from "./Avatar";
import { User } from "../model/UserModel";
import { signOut } from "next-auth/react"
import { MessageModel } from "../model/MessageModel";

interface Props {
  onFavourites: () => void;
}

const Header: FunctionComponent<Props> = ({ onFavourites }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState<MessageModel[]>([]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      fetchMessage();
    }
  }, []);

  const handleLoginSucc = () => {
    const userFromSession = localStorage.getItem('user');
    if (userFromSession) {
      setUser(JSON.parse(userFromSession));
    }
    setShowLogin(false);
    window.location.reload();
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleRegisterClose = () => {
    setShowRegister(false);
  };

  const handleMessageClose = () => {
    setShowMessage(false);
  };

  const handleRegisterSucc = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    signOut();
    window.location.reload();
  };

  const handleFavourites = () => {
    if(user){
      onFavourites();
    }else{
      setShowLogin(!showLogin);
    }
  }

  const fetchMessage = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    };

    try {
      const response = await fetch(`https://backend.kwu2901.repl.co/messages`, options);
      const data = await response.json();

      setMessage(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowMessage = () => {
    if(user){
      if (message && user.staff==false) {
        const filteredMessage = message.filter((mes) => mes.user_id === user._id);      
        setMessage(filteredMessage);
        setShowMessage(true);
      }else{      
        setShowMessage(true);
      }
    }else{
      setShowLogin(!showLogin);
    }

  }

  return (
    <div className={styles.headerpagetop}>
      <div className={styles.navnavbar}>
        <div className={styles.divcontainer}>
          <i className={styles.thePetShelter}>The Pet Shelter</i>
          <div className={styles.ulnavbarNav}>
            <div className={styles.anavLink}>
              <Avatar
                  src={"/ifaeye.svg"}
                  onClick={() => handleShowMessage()}
              />
              <div className={styles.span}>
                <div className={styles.message}>message</div>
              </div>
            </div>
            <div className={styles.anavLink1}>
              <Avatar
                  src={"/ifaheart.svg"}
                  onClick={() => handleFavourites()}
              />
              <div className={styles.span1}>
                <div className={styles.message}>favourites</div>
              </div>
            </div>
            {user ? (
              <div className={styles.anavLink2}>
                <Avatar
                  src={user.usericon ?? "/placeholder.jpg"}
                  onClick={() => handleLogout()}
                />
                <div className={styles.spanjumpText}>
                  <div className={styles.signUp}>log out</div>
                </div>
              </div>
            ) : (
              <div className={styles.anavLink2}>
                <Avatar
                  src="/ifauser.svg"
                  onClick={() => setShowLogin(true)}
                />
                <div className={styles.spanjumpText}>
                  <div className={styles.signUp}>sign up</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      {showLogin && (
        <Login
          onClose={handleLoginClose}
          onRegister={handleRegisterClick}
          onLoginSucc={handleLoginSucc}
        />
      )}
      {showRegister && (
        <Register
          onClose={handleRegisterClose}
          onRegisterSucc={handleRegisterSucc}
        />
      )}
      {showMessage && (
        <Message
          message={message}
          reply={false}
          //onChange={handleMessageClose}
          onClose={handleMessageClose}
          // onRegisterSucc={handleRegisterSucc}
        />
      )}
    </div>
  );
};

export default Header;
