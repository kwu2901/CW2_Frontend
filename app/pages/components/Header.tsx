import { FunctionComponent, useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import styles from "./Header.module.css";
import Avatar from "./Avatar";
import { User } from "../model/UserModel";
import { useSession, signIn, signOut } from "next-auth/react"

interface Props {
  onFavourites: () => void;
}

const Header: FunctionComponent<Props> = ({ onFavourites }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession()

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
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

  const handleRegisterSucc = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleFavourites = () => {
    onFavourites();
  }

  return (
    <div className={styles.headerpagetop}>
      <div className={styles.navnavbar}>
        <div className={styles.divcontainer}>
          <i className={styles.thePetShelter}>The Pet Shelter</i>
          <div className={styles.ulnavbarNav}>
            <div className={styles.anavLink}>
              <img
                className={styles.ifaEyeIcon}
                alt=""
                src="/ifaeye.svg"
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
            {session ? (
              <div className={styles.anavLink2}>
                <Avatar
                  src={"/placeholder.jpg"}
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
    </div>
  );
};

export default Header;
