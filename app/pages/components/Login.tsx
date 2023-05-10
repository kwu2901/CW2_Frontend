import { FunctionComponent } from "react";
import styles from "./Login.module.css";
import { User } from "../model/UserModel";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import Button from "./Button";
import { signIn, useSession } from "next-auth/react"

interface Props {
  onClose: () => void;
  onRegister: () => void;
  onLoginSucc: () => void;
}

interface LoginResponse {
  token: string;
  user: User;
}

const Login: FunctionComponent<Props> = ({ onClose, onRegister, onLoginSucc }) => {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      const response = await fetch("https://backend.kwu2901.repl.co/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password
        }),
      });
      if (!response.ok) {
        alert("Invalid email or password.");
        return;
      }
      const { token, user }: LoginResponse = await response.json();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      alert("Login Succ!");
      onLoginSucc();
    } catch (err) {
      alert("Authentication failed");
    }
  };

  const dome = () => {
    const  user = JSON.stringify({
      _id: "645a3deb63c106feeb372471",
      email: "test@gmail.com",
      username: "test",
      staff: false,
    });
    localStorage.setItem("user", user);
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDVhM2RlYjYzYzEwNmZlZWIzNzI0NzEiLCJpYXQiOjE2ODM2MzYyMjJ9.hUUT_fEvYDSg5ZkkhxBPqRFurZvKdo3s5m2URVpW7DM" );
  
  }
  
  const loginGoogle = () => {
    signIn("google", { callbackUrl: "http://localhost:3000" })
      .then((response) => {
        dome();
      })
      .catch((error) => {
        console.error("Google login failed", error);
      });
  };

  const loginGitHub = () => {
    signIn("github", { callbackUrl: "http://localhost:3000" })
      .then((response) => {
        dome();
      })
      .catch((error) => {
        console.error("GitHub login failed", error);
      });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h3 className={styles.title}>Login</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email:</label>
            <input className={styles.input} type="email" id="email" name="email" required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password:</label>
            <input className={styles.input} type="password" id="password" name="password" required />
          </div>
          <div className={styles.formGroup}>
            <button className={styles.button} type="submit">Submit</button>
          </div>
        </form>
        <div className={styles.form}>
          <Button
            outline
            label="Continue with Google"
            icon={FcGoogle}
            onClick={() => loginGoogle()}
          />
        </div>
        <div className={styles.form}>
          <Button
            outline
            label="Continue with Github"
            icon={AiFillGithub}
            onClick={() => loginGitHub()}
          />
        </div>
        <div className={styles.register}>
          First time using Pet Shelter?　　
          <button onClick={onRegister}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
