import * as React from "react";
import PropTypes from "prop-types";
import { Image, tokens, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  welcome__header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // Ajustez la hauteur souhaitée via le padding
    paddingBottom: "10px",
    paddingTop: "20px", // réduit de 70px à 20px
    backgroundColor: "green",
  },
  message: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightRegular,
    // Pour que le texte soit en blanc
    color: "white",
  },
});

const Header = (props) => {
  const { title, logo, message } = props;
  const styles = useStyles();

  return (
    <section className={styles.welcome__header}>
      <Image width="70" height="70" src={logo} alt={title} />
      <h1 className={styles.message}>{message}</h1>
    </section>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  message: PropTypes.string,
};

export default Header;
