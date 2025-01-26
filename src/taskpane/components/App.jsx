// import * as React from "react";
// import PropTypes from "prop-types";
// import Header from "./Header";
// import HeroList from "./HeroList";
// import TextInsertion from "./TextInsertion";
// import { makeStyles } from "@fluentui/react-components";
// import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
// import { insertText } from "../taskpane";

// const useStyles = makeStyles({
//   root: {
//     minHeight: "100vh",
//   },
// });

// const App = (props) => {
//   const { title } = props;
//   const styles = useStyles();
//   // The list items are static and won't change at runtime,
//   // so this should be an ordinary const, not a part of state.
//   const listItems = [
//     {
//       icon: <Ribbon24Regular />,
//       primaryText: "Achieve more with Office integration",
//     },
//     {
//       icon: <LockOpen24Regular />,
//       primaryText: "Unlock features and functionality",
//     },
//     {
//       icon: <DesignIdeas24Regular />,
//       primaryText: "Create and visualize like a pro",
//     },
//   ];

//   return (
//     <div className={styles.root}>
//       <Header logo="assets/logo-filled.png" title={title} message="Welcome" />
//       <HeroList message="Discover what this add-in can do for you today!" items={listItems} />
//       <TextInsertion insertText={insertText} />
//     </div>
//   );
// };

// App.propTypes = {
//   title: PropTypes.string,
// };

// export default App;

// src/taskpane/components/App.jsx

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
      <Header logo="assets/logo-filled.png" title={title} message="Welcome" />

      {/* Affiche notre pane de traduction */}
      <TranslationPane />
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
