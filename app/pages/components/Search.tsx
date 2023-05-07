import { FunctionComponent } from "react";
import styles from "./Search.module.css";
import { useState, useEffect } from 'react';
import { User } from "../model/UserModel";
import Add from "./Add";
import locations, { Location } from '../model/Location';
import breeds, { Breed } from '../model/Breeds';

interface Props {
  onClose: () => void;
  handleAddSucc: () => void;
}

const Search: FunctionComponent<{ onSearch: (location: string, gender: string, breed: string) => void }> = ({ onSearch }) => {
  const [location, setLocation] = useState<Location>("");
  const [gender, setGender] = useState("");
  const [breed, setSelectedBreed] = useState<Breed>("");
  const [user, setUser] = useState<User | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  function handleClick() {
    onSearch(location, gender, breed);
  }

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "Locations") {
      setLocation("");
    } else {
      setLocation(event.target.value as Location);
    }
  };

  function handleGenderChange(event: React.ChangeEvent<HTMLSelectElement>) {
    if (event.target.value === "Gender") {
      setGender("");
    } else {
      setGender(event.target.value);
    }
  }
  
  const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "Breeds") {
      setSelectedBreed("");
    } else {
      setSelectedBreed(event.target.value as Breed);
    }
  }

  const handleAddClose = () => {
    setShowAdd(false);
  };

  const handleAddSucc = () => {
    setShowAdd(false);
    window.location.reload();
  };

  return (
    <div className={styles.divrow}>
      <div className={styles.selectarea}>
        <div id="locationDropdown" className={styles.div}>
          <select id="location" value={location} onChange={handleLocationChange}>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.selectsex}>
        <div id="genderDropdown" className={styles.div}>
          <select className={styles.location} onChange={handleGenderChange}>
            <option value="Gender">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>
      <div className={styles.selectanimal}>
        <div id="breedDropdown" className={styles.div}>
          <select className={styles.location} id="breed" value={breed} onChange={handleBreedChange}>
            {breeds.map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>
      </div>
      <button className={styles.inputbtn} autoFocus onClick={handleClick}>
        <div className={styles.search}>Search</div>
      </button>
      {user === null ? null :
        (
          <button 
            className={styles.inputbtn1}
            onClick={() => setShowAdd(true)}
            autoFocus>
            <div className={styles.search}>Add</div>
          </button>
        )}
      {showAdd && (
        <Add
          onClose={handleAddClose}
          handleAddSucc={handleAddSucc}
        />
      )}
    </div>
  );
};


export default Search;
