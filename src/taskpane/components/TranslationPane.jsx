import React, { useState } from "react";
import { replaceSelectedText } from "../taskpane.js";
import { Spinner, Button, Textarea, Select, Label, makeStyles } from "@fluentui/react-components";
import { Translate24Regular, ArrowSwap24Filled } from "@fluentui/react-icons";

const useStyles = makeStyles({
  root: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  pane: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    padding: "24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
    color: "#2d3e50",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  fileInput: {
    // Un peu de style pour le input file
    marginTop: "8px",
  },
  buttons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    margin: "16px 0",
  },
  status: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    "&.loading": { backgroundColor: "#e6f3ff", color: "#005a9e" },
    "&.success": { backgroundColor: "#e6ffec", color: "#22863a" },
    "&.error": { backgroundColor: "#ffe6e6", color: "#cc0000" },
  },
  textarea: {
    // Styles communs pour les textareas (instructions + traduction)
  },
});

export default function TranslationPane() {
  const [targetLanguage, setTargetLanguage] = useState("Français");
  const [instructions, setInstructions] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // "loading" | "error" | "success"
  const [loadingAPI, setLoadingAPI] = useState(null);

  const styles = useStyles();

  /** Récupère le texte sélectionné dans Word */
  async function getSelectedTextFromWord() {
    return Word.run(async (context) => {
      const selection = context.document.getSelection();
      selection.load("text");
      await context.sync();
      return selection.text.trim();
    });
  }

  /** Appelle votre backend (OpenAI, Claude, Gemini) */
  async function callBackend(apiType, originalText) {
    const endpointUrl = `https://officeaiserver.onrender.com/api/translate/${apiType}`;
    // const endpointUrl = `http://localhost:3002/api/translate/${apiType}`; // usage local

    const bodyData = {
      text: originalText,
      targetLanguage,
    };
    if (instructions.trim()) {
      bodyData.instructions = instructions.trim();
    }

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });
    const data = await response.json();
    return data.translation || "";
  }

  /** Quand on clique "Traduire" */
  async function handleTranslate(apiType) {
    try {
      setStatusMessage("");
      setStatusType("");
      setLoadingAPI(apiType);

      const selectedText = await getSelectedTextFromWord();
      if (!selectedText) {
        setStatusMessage("Aucun texte sélectionné dans Word.");
        setStatusType("error");
        return;
      }

      setStatusMessage("Traduction en cours...");
      setStatusType("loading");

      const response = await callBackend(apiType, selectedText);
      if (!response) {
        setStatusMessage("Erreur : aucune traduction reçue.");
        setStatusType("error");
        return;
      }

      setTranslatedText(response);
      setStatusMessage("Traduction terminée. Vérifiez et corrigez si nécessaire.");
      setStatusType("success");
    } catch (error) {
      console.error("Erreur handleTranslate:", error);
      setStatusMessage("Erreur lors de la traduction.");
      setStatusType("error");
    } finally {
      setLoadingAPI(null);
    }
  }

  /** Quand on clique "Insérer dans Word" */
  async function handleReplaceSelection() {
    if (!translatedText.trim()) {
      setStatusMessage("Aucune traduction à insérer.");
      setStatusType("error");
      return;
    }

    try {
      setStatusMessage("Insertion dans Word...");
      setStatusType("loading");

      await replaceSelectedText(translatedText);

      setStatusMessage("La sélection a été remplacée par votre texte corrigé !");
      setStatusType("success");
    } catch (error) {
      console.error("Erreur handleReplaceSelection:", error);
      setStatusMessage("Erreur lors de l'insertion du texte dans Word.");
      setStatusType("error");
    }
  }

  /**
   * Gestion de l'import de fichier pour remplir "instructions"
   */
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      // Vous pouvez remplacer le texte existant ou concaténer
      // Ex: setInstructions((prev) => prev + "\n" + fileContent);
      // Ici, on remplace directement le contenu
      setInstructions(fileContent);
    };
    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className={styles.root}>
      <div className={styles.pane}>
        <a href="help.html" target="_blank">
          <Button appearance="primary">HELP</Button>
        </a>
        {/* Header */}
        <div className={styles.header}>
          <Translate24Regular />
          <h2 style={{ margin: 0 }}>Traduction intelligente</h2>
        </div>
        {/* Langue cible */}
        <div className={styles.formGroup}>
          <Label>Langue cible</Label>
          <Select appearance="filled-darker" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
            <option>Allemand</option>
            <option>Anglais</option>
            <option>Arabe</option>
            <option>Espagnol</option>
            <option>Français</option>
            <option>Portugais</option>
          </Select>
        </div>
        {/* Instructions (texte ou fichier) */}
        <div className={styles.formGroup}>
          <Label>Instructions spéciales (optionnel)</Label>
          <Textarea
            appearance="filled-darker"
            resize="vertical"
            className={styles.textarea}
            placeholder="Ex: Style formel, termes techniques à conserver..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          {/* Input file pour charger un fichier texte et le mettre dans instructions */}
          <input
            type="file"
            accept=".txt,.md,.json,.csv,.xml,.docx" /* ajustez selon vos besoins */
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>
        {/* Boutons de traduction */}
        <div className={styles.buttons}>
          <Button
            appearance="primary"
            icon={loadingAPI === "openai" ? <Spinner size="tiny" /> : undefined}
            disabled={!!loadingAPI}
            onClick={() => handleTranslate("openai")}
          >
            OpenAI
          </Button>
          <Button
            appearance="primary"
            icon={loadingAPI === "claude" ? <Spinner size="tiny" /> : undefined}
            disabled={!!loadingAPI}
            onClick={() => handleTranslate("claude")}
            style={{ backgroundColor: "#2cb673" }}
          >
            Claude
          </Button>
          <Button
            appearance="primary"
            icon={loadingAPI === "gemini" ? <Spinner size="tiny" /> : undefined}
            disabled={!!loadingAPI}
            onClick={() => handleTranslate("gemini")}
            style={{ backgroundColor: "#6e14ef" }}
          >
            Gemini
          </Button>
          {/* AJOUT DEEPSEEK */}
          <Button
            appearance="primary"
            icon={loadingAPI === "deepseek" ? <Spinner size="tiny" /> : undefined}
            disabled={!!loadingAPI}
            onClick={() => handleTranslate("deepseek")}
            style={{ backgroundColor: "#b3730f" }} // Couleur exemple
          >
            DeepSeek
          </Button>
        </div>
        {/* Zone de texte pour la traduction */}
        <div className={styles.formGroup}>
          <Label>Traduction générée</Label>
          <Textarea
            appearance="filled-darker"
            resize="vertical"
            className={styles.textarea}
            rows={6}
            value={translatedText}
            onChange={(e) => setTranslatedText(e.target.value)}
            placeholder="La traduction apparaîtra ici..."
          />
        </div>
        {/* Bouton pour insérer dans Word */}
        <Button
          appearance="outline"
          icon={<ArrowSwap24Filled />}
          onClick={handleReplaceSelection}
          disabled={!translatedText.trim()}
          style={{ width: "100%" }}
        >
          Insérer dans Word
        </Button>
        {/* Status message */}
        {statusMessage && <div className={`${styles.status} ${statusType}`}>{statusMessage}</div>}
      </div>
    </div>
  );
}
