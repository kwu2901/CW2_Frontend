import { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import styles from "./Card.module.css";
import { User } from "../model/UserModel";
import Edit from "./Edit";
import { Cat } from "../model/CatModel";
import Message from "./Message";

type Props = {
  cats: Cat;
  fav: boolean;
};

const Card: FunctionComponent<Props> = ({ cats, fav }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [isFavorite, setIsFavorite] = useState(fav);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleEditClose = () => {
    setShowEdit(false);
  };

  const handleMessageClose = () => {
    setShowMessage(false);
  };

  const handleEditSucc = () => {
    setShowEdit(false);
    window.location.reload();
  };
  
  const handleFavorite = () => {
    if(user){
      handleFavoriteClick();
    }else{
      alert("Please login!");
    }  };

  const handleFavoriteClick = async () => {
    // const url = 'https://backend.kwu2901.repl.co'
    const endpoint = isFavorite ? `https://backend.kwu2901.repl.co/delFavourites/${user?._id}/${cats._id}` : `https://backend.kwu2901.repl.co/addFavourites`;
    const method = isFavorite ? 'DELETE' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          user_id: user?._id,
          cat_id: cats._id,
        }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowMessage = () => {
    if(user){
      setShowMessage(true);
    }else{
      alert("Please login!");
    }
  }

  return (
    <div className={styles.divrow}>
      <div className={styles.divmedia}>
        <img
          className={styles.adoptIcon}
          alt=""
          src={cats.image}
        />
        <button className={styles.inputbtn2} autoFocus onClick={handleFavorite}>
        <img className={styles.inputbtnChild} alt="" src={isFavorite ? "/star-1.svg" : "/star-2.svg"} />
        </button>
        <div className={styles.divmediaBody}>
          <div className={styles.atextWhite}>
            <a className={styles.a} target="_blank">
              {cats.cat_name}
            </a>
          </div>
          <div className={styles.ullistUnstyled}>
            <div className={styles.litextWhite}>
              <img className={styles.frameIcon} alt="" src="/frame.svg" />
              <div className={styles.div}>
                {cats.age}
              </div>
            </div>
            <div className={styles.litextWhite}>
              <img className={styles.frameIcon1} alt="" src="/frame1.svg" />
              <div className={styles.div}>
                {cats.gender}
              </div>
            </div>
            <div className={styles.litextWhite}>
              <img className={styles.frameIcon2} alt="" src="/frame2.svg" />
              <div className={styles.div2}>
                {cats.location}
              </div>
            </div>
            <div className={styles.litextWhite}>
              <img className={styles.frameIcon2} alt="" src="/frame3.svg" />
              <div className={styles.div3}>
                {cats.breed}
              </div>
            </div>
          </div>
          <div className={styles.ptextWhite}>
            <div className={styles.div4}>
              {cats.describe}
            </div>
          </div>
          <div className={styles.abtn} onClick={() => handleShowMessage()}>
            <div className={styles.div6}>
              <div className={styles.contactUs}>contact us</div>
            </div>
          </div>
          {user?.staff  ? (
              <button 
                className={styles.inputbtn}
                onClick={() => setShowEdit(true)}
                autoFocus>
                <div className={styles.edit}>Edit</div>
              </button>
            ) : null}
          {showEdit && (
            <Edit
              onClose={handleEditClose}
              handleEditSucc={handleEditSucc}
              cats={cats}
            />
          )}
          {showMessage && user? (
            <Message
              message={[{user_id: user._id, title: "Cat ID: "+cats._id, content: "", read: true}]}
              reply={true}
              //onChange={handleMessageClose}
              onClose={handleMessageClose}
              // onRegisterSucc={handleRegisterSucc}
            />
          ):null}
        </div>
      </div>
    </div>
  );
};

export default Card;
