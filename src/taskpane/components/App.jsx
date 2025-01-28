import * as React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HeroList from "./HeroList";
import TextInsertion from "./TextInsertion";
// Importer notre nouveau composant
import TranslationPane from "./TranslationPane";

const App = (props) => {
  const { title } = props;

  // Ex. d'items pour HeroList (illustration)
  const listItems = [
    { icon: "", primaryText: "Achieve more with Office integration" },
    { icon: "", primaryText: "Unlock features and functionality" },
    { icon: "", primaryText: "Create and visualize like a pro" },
  ];

  return (
    <div>
      <Header logo="assets/logo.svg" title={title} message="PALABRESAK2" className="couleur-text" />

      {/* Affiche notre pane de traduction */}
      <TranslationPane />
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
