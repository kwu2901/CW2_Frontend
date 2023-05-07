import { FunctionComponent, useState, useEffect } from "react";
import styles from "./Edit.module.css";
import ImageUpload from './ImageUpload';
import locations, { Location } from '../model/Location';
import breeds, { Breed } from '../model/Breeds';
import { Cat } from "../model/CatModel";
import genders, { Gender } from '../model/Gender';

interface Props {
  onClose: () => void;
  handleEditSucc: () => void;
  cats: Cat;
}

const Edit: FunctionComponent<Props> = ({ onClose, handleEditSucc, cats }) => {
  const [image, setImage] = useState<string>(cats.image);
  const [location, setLocation] = useState<Location>(cats.location);
  const [gender, setGender] = useState<Gender>(cats.gender);
  const [breed, setSelectedBreed] = useState<Breed>(cats.breed);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData: Cat = {
      cat_name: event.currentTarget.cat_name.value,
      age: event.currentTarget.age.value,
      breed: breed,
      gender: gender,
      location: location,
      describe: event.currentTarget.describe.value,
      image: image,
    };

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(`https://backend.kwu2901.repl.co/updateCat/${cats._id}`, options);
      const data = await response.json();
      console.log(data);
      handleEditSucc();
    } catch (error) {
      console.error(error);
    }
  };  

  const handleDelete = async () => {
    const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      };
    try {
      const response = await fetch(`https://backend.kwu2901.repl.co/delCat/${cats._id}`, options);
      const data = await response.json();
      console.log(data);
      handleEditSucc();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = async (value: string) => {
    setImage(value);
  };  

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

  
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h3 className={styles.title}>Edit</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="image">Image:</label>
            <ImageUpload onChange={handleImageChange} value={cats.image} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="cat_name">Cat Name:</label>
            <input className={styles.input} type="cat_name" id="cat_name" name="cat_name" defaultValue={cats.cat_name} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="age">Age:</label>
            <input className={styles.input} type="age" id="age" name="age" defaultValue={cats.age} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="gender">Gender:</label>
            <select className={styles.select} onChange={handleGenderChange} defaultValue={cats.gender}>
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="location">Location:</label>
            <select className={styles.select} id="location" defaultValue={cats.location} onChange={handleLocationChange}>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="breed">Breed:</label>
            <select className={styles.select} id="breed" defaultValue={cats.breed} onChange={handleBreedChange}>
            {breeds.map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>         
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="describe">Describe:</label>
            <input className={styles.input} defaultValue={cats.describe} type="describe" id="describe" name="describe" required />
          </div>
          <div className={styles.formGroup}>
            <button className={styles.button} type="submit">Submit</button>
          </div>
        </form>
        <div className={styles.formGroup}>
            <button className={styles.button2} onClick={handleDelete}>
                Delete
            </button>        
        </div>
      </div>
    </div>
  );
};

export default Edit;
