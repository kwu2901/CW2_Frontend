import { FunctionComponent } from "react";
import styles from "./Footer.module.css";
const Footer: FunctionComponent = () => {
  return (
    <div className={styles.footerfooterBgImg}>
      <img
        className={styles.divcopyrightIcon}
        alt=""
        src="/divcopyright@2x.png"
      />
    </div>
  );
};

export default Footer;
