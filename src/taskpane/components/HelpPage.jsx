import React from "react";
import { makeStyles } from "@fluentui/react-components";

// Styles basiques (optionnel)
const useStyles = makeStyles({
  container: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  content: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    padding: "24px",
  },
  title: {
    marginTop: 0,
    marginBottom: "16px",
    color: "#2d3e50",
  },
  paragraph: {
    marginBottom: "16px",
    lineHeight: 1.5,
  },
  list: {
    listStyle: "disc",
    paddingLeft: "20px",
  },
});

export default function HelpPage() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Aide &amp; Présentation du projet</h1>
        <p className={styles.paragraph}>
          Cette page explique le fonctionnement et l’objectif de votre module complémentaire Word “Office AI”.
        </p>

        <h2>Fonctionnalités</h2>
        <ul className={styles.list}>
          <li>Traduction multilingue (OpenAI, Claude, Gemini, DeepSeek, etc.)</li>
          <li>Instructions spéciales (style, ton, vocabulaire…)</li>
          <li>Insertion automatique dans le document Word</li>
        </ul>

        <h2>Comment utiliser</h2>
        <ol className={styles.list}>
          <li>Sélectionnez du texte dans Word</li>
          <li>Choisissez l’IA et lancez la traduction</li>
          <li>Vérifiez le texte généré et insérez-le</li>
        </ol>

        <p className={styles.paragraph}>Pour plus d’infos, consultez notre documentation ou contactez le support.</p>
      </div>
    </div>
  );
}
