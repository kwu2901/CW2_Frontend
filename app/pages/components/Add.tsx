import { FunctionComponent,useState } from "react";
import styles from "./Add.module.css";
import ImageUpload from './ImageUpload';
import locations, { Location } from '../model/Location';
import breeds, { Breed } from '../model/Breeds';
import { Cat } from "../model/CatModel";

interface Props {
  onClose: () => void;
  handleAddSucc: () => void;
}

const Add: FunctionComponent<Props> = ({ onClose, handleAddSucc }) => {
  const [image, setImage] = useState<string>('');
  const [location, setLocation] = useState<Location>(locations[0]);
  const [gender, setGender] = useState("");
  const [breed, setSelectedBreed] = useState<Breed>("");

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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch('https://backend.kwu2901.repl.co/AddCat', options);
      const data = await response.json();
      console.log(data);
      handleAddSucc();
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
        <h3 className={styles.title}>Add New Cat</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="image">Image:</label>
            <ImageUpload onChange={handleImageChange} value={image} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="cat_name">Cat Name:</label>
            <input className={styles.input} type="cat_name" id="cat_name" name="cat_name" required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="age">Age:</label>
            <input className={styles.input} type="age" id="age" name="age" required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="gender">Gender:</label>
            <select className={styles.select} onChange={handleGenderChange}>
              <option value="Gender">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>        </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="location">Location:</label>
            <select className={styles.select} id="location" value={location} onChange={handleLocationChange}>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="breed">Breed:</label>
            <select className={styles.select} id="breed" value={breed} onChange={handleBreedChange}>
            {breeds.map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>         
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="describe">Describe:</label>
            <input className={styles.input} type="describe" id="describe" name="describe" required />
          </div>
          <div className={styles.formGroup}>
            <button className={styles.button} type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
