import { FunctionComponent, useState } from "react";
import styles from "./Register.module.css";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import Button from "./Button";
import { useSession, signIn } from "next-auth/react"

interface RegisterProps {
  onClose: () => void;
  onRegisterSucc: () => void;
}

const Register: FunctionComponent<RegisterProps> = ({ onClose, onRegisterSucc }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffCode, setStaffCode] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let isStaff = false;
    if (staffCode !== "") {
      try {
        const response = await fetch(`https://backend.kwu2901.repl.co/staffCode/${staffCode}`);
        const data = await response.json();
        if (data) {
          isStaff = true;
        } else {
          alert("Staff code not found.");
          return;
        }
      } catch (err) {
        console.log(err);
        alert("An error occurred while checking staff code.");
        return;
      }
    }

    try {
      const response = await fetch("https://backend.kwu2901.repl.co/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
          staff: isStaff,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (isStaff) {
        const responseStaffCode = await fetch("https://backend.kwu2901.repl.co/addStaffCode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            staff_id: data._id,
          }),
        });
        const dataStaffCode = await responseStaffCode.json();
        console.log(dataStaffCode);
      }
      alert("Registration successful!");
      onRegisterSucc();
    } catch (err) {
      console.log(err);
      alert("An error occurred while registering.");
    }
  };

  const loginGitHub = () => {
    signIn("github");
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h3 className={styles.title}>Register</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">
              Username:
            </label>
            <input
              className={styles.input}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email:
            </label>
            <input
              className={styles.input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password:
            </label>
            <input
              className={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <div>
              <input
                className={styles.input}
                type="checkbox"
                id="staffCodeCheckbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <label htmlFor="staffCodeCheckbox">
                I have a staff code
              </label>
            </div>
            {isChecked && (
              <input
                className={styles.input}
                type="text"
                id="staffCode"
                value={staffCode}
                onChange={(e) => setStaffCode(e.target.value)}
                required
              />
            )}
          </div>
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
        <br/>
        <div className={styles.form}>
          <Button
            outline
            label="Continue with Google"
            icon={FcGoogle}
            onClick={() => { }}
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
      </div>
    </div>
  );
};

export default Register;
