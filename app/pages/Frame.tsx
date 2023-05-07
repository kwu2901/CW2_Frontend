"use client"

import { FunctionComponent } from "react";
import React, { useState, useEffect } from 'react';

import Header from "./components/Header";
import Card from "./components/Card";
import Search from "./components/Search";
import Footer from "./components/Footer";
import styles from "./Frame.module.css";

import { Cat } from "./model/CatModel";
import { User } from "./model/UserModel";

async function fetchFilteredCats(location: string, gender: string, breed: string) {
  const response = await fetch(`https://backend.kwu2901.repl.co/catList?location=${location}&gender=${gender}&breed=${breed}`);
  const data = await response.json();
  return data;
}

interface Favorite {
  _id: string;
  user_id: string;
  cat_id: string;
}

const Frame: FunctionComponent = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isFavorites, setIsFavorites] = useState(false);
  const [logined, setLogined] = useState(false);


  function handleSearch(location: string, gender: string, breed: string) {
    fetchFilteredCats(location, gender, breed).then((data) => {
      setCats(data);
      setIsFavorites(false);
    });
  }

  function handleFavorites() {
    if(!isFavorites){
      fetchFilterFavorites();
    }else{
      handleSearch('','','');
    }
  }

  const fetchFilterFavorites = async () => {
    try {
      const ids = favorites.map((fav) => fav.cat_id).join(',');
      const response = await fetch(`https://backend.kwu2901.repl.co/catList/${ids}`);
      const data = await response.json();
      setCats(data);
      setIsFavorites(true);
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchFavorites = async (id:string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    };

    try {
      const response = await fetch(`https://backend.kwu2901.repl.co/favourites/${id}`, options);
      const data = await response.json();

      setFavorites(data);
      setLogined(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const userData: User = JSON.parse(loggedInUser);
      setUser(userData);
      fetchFavorites(userData._id);
    }
  }, []);

  const fetchData = async () => {
    const response = await fetch('https://backend.kwu2901.repl.co/catList');
    const data = await response.json();
    setCats(data);
  }

  const isFav = (catId?: string) => {
    if(favorites){
      const fav = favorites.some((favData) => {  
        return favData.cat_id === catId
      });   
      return fav;
    }
    return false;
  };

  return (
    <div className={styles.frame}>
      <Header onFavourites={handleFavorites} />
      <div className={styles.divmainWrapper}>
        <div className={styles.sectionbreadcrumbBg}>
          <div className={styles.div}>
            <div className={styles.sectionbreadcrumbBg}>Pet Adoption</div>
          </div>
        </div>
        <div className={styles.divcontainer}>
        <Search onSearch={handleSearch} />
        {logined? ( 
          isFavorites?(
            cats.map((cat, index) => (
              <Card key={index} cats={cat} fav={isFav(cat._id)} />
            ))
          ):null):null
        }
        {logined? ( 
          isFavorites?null:(
            cats.map((cat, index) => (
              <Card key={index} cats={cat} fav={isFav(cat._id)} />
            ))
          )):null
        }

        {logined? null:(cats.map((cat, index) => (
          <Card key={index} cats={cat} fav={isFav(cat._id)} />
        )))}
        </div>
        <div className={styles.ulpagination}>
          <div className={styles.spanpageLinkParent}>
            <div className={styles.spanpageLink}>
              <div className={styles.div1}>‹</div>
            </div>
            <div className={styles.div2}>1</div>
            <div className={styles.div3}>2</div>
            <div className={styles.div4}>3</div>
            <div className={styles.div5}>4</div>
            <div className={styles.div6}>5</div>
            <div className={styles.div7}>6</div>
            <div className={styles.div8}>7</div>
            <div className={styles.div9}>8</div>
            <div className={styles.div10}>9</div>
            <div className={styles.div11}>10</div>
            <div className={styles.div12}>
              <div className={styles.div1}>›</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Frame;
