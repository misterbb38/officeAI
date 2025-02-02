// // import React, { useState } from "react";
// // import { replaceSelectedText } from "../taskpane.js";
// // import "./TranslationPane.css";

// // export default function TranslationPane() {
// //   const [targetLanguage, setTargetLanguage] = useState("Français");
// //   const [instructions, setInstructions] = useState("");
// //   const [status, setStatus] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);

// //   // Nouveau state pour stocker la traduction retournée par l’API
// //   const [translatedText, setTranslatedText] = useState("");

// //   /**
// //    * Récupère le texte sélectionné depuis Word
// //    */
// //   async function getSelectedTextFromWord() {
// //     return Word.run(async (context) => {
// //       const selection = context.document.getSelection();
// //       selection.load("text");
// //       await context.sync();
// //       return selection.text.trim();
// //     });
// //   }

// //   /**
// //    * Envoie une requête POST à votre backend
// //    */
// //   async function callBackend(apiType, originalText) {
// //     const endpointUrl = `https://officeaiserver.onrender.com/api/translate/${apiType}`;
// //     // const endpointUrl = `http://localhost:3002/api/translate/${apiType}`; // si usage local

// //     const bodyData = {
// //       text: originalText,
// //       targetLanguage,
// //     };
// //     if (instructions.trim()) {
// //       bodyData.instructions = instructions.trim();
// //     }

// //     const response = await fetch(endpointUrl, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(bodyData),
// //     });
// //     const data = await response.json();
// //     return data.translation || "";
// //   }

// //   /**
// //    * Clique sur un bouton "Traduire" (OpenAI/Claude/Gemini)
// //    */
// //   async function handleTranslate(apiType) {
// //     try {
// //       setStatus("");
// //       setIsLoading(true);

// //       // Récupère le texte sélectionné
// //       const selectedText = await getSelectedTextFromWord();
// //       if (!selectedText) {
// //         setStatus("Aucun texte sélectionné dans Word.");
// //         return;
// //       }

// //       setStatus("Traduction en cours...");

// //       // Appel au backend
// //       const response = await callBackend(apiType, selectedText);
// //       if (!response) {
// //         setStatus("Erreur : aucune traduction reçue.");
// //         return;
// //       }

// //       // Au lieu de remplacer directement la sélection,
// //       // on stocke la traduction dans 'translatedText'.
// //       setTranslatedText(response);
// //       setStatus("Traduction terminée. Vérifiez et corrigez si nécessaire.");
// //     } catch (error) {
// //       console.error("Erreur handleTranslate:", error);
// //       setStatus("Erreur lors de la traduction.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }

// //   /**
// //    * Remplace la sélection Word par 'translatedText'
// //    */
// //   async function handleReplaceSelection() {
// //     if (!translatedText.trim()) {
// //       setStatus("Aucune traduction à insérer.");
// //       return;
// //     }

// //     try {
// //       setStatus("Insertion dans Word...");
// //       await replaceSelectedText(translatedText);
// //       setStatus("La sélection a été remplacée avec votre texte corrigé !");
// //     } catch (error) {
// //       console.error("Erreur handleReplaceSelection:", error);
// //       setStatus("Erreur lors de l'insertion du texte dans Word.");
// //     }
// //   }

// //   return (
// //     <div className="translation-pane">
// //       <h3>Traduction de la sélection</h3>

// //       {/* Sélecteur de langue */}
// //       <div className="form-row">
// //         <label className="form-label">Langue cible :</label>
// //         <select className="form-select" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
// //           <option value="Français">Français</option>
// //           <option value="Anglais">Anglais</option>
// //           <option value="Espagnol">Espagnol</option>
// //           <option value="Allemand">Allemand</option>
// //         </select>
// //       </div>

// //       {/* Instructions optionnelles */}
// //       <div className="form-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
// //         <label className="form-label">Instructions (optionnel) :</label>
// //         <textarea
// //           className="form-textarea"
// //           rows={3}
// //           placeholder="Ex: Style formel, glossaire financier..."
// //           value={instructions}
// //           onChange={(e) => setInstructions(e.target.value)}
// //         />
// //       </div>

// //       {/* Boutons de traduction */}
// //       <div className="buttons">
// //         <button onClick={() => handleTranslate("openai")} disabled={isLoading} className="button">
// //           Traduire (OpenAI)
// //         </button>
// //         <button onClick={() => handleTranslate("claude")} disabled={isLoading} className="button green">
// //           Traduire (Claude)
// //         </button>
// //         <button onClick={() => handleTranslate("gemini")} disabled={isLoading} className="button purple">
// //           Traduire (Gemini)
// //         </button>
// //       </div>

// //       {/* Zone d'édition de la traduction */}
// //       <div className="form-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
// //         <label className="form-label">Texte traduit (modifiable) :</label>
// //         <textarea
// //           className="form-textarea"
// //           rows={5}
// //           placeholder="La traduction apparaîtra ici..."
// //           value={translatedText}
// //           onChange={(e) => setTranslatedText(e.target.value)}
// //         />
// //       </div>

// //       {/* Bouton pour remplacer la sélection dans Word */}
// //       <div className="buttons">
// //         <button onClick={handleReplaceSelection} className="button" disabled={!translatedText}>
// //           Remplacer la sélection dans Word
// //         </button>
// //       </div>

// //       {/* Zone de statut */}
// //       <div className="status">{status}</div>
// //     </div>
// //   );
// // }

// import React, { useState } from "react";
// import { replaceSelectedText } from "../taskpane.js";
// import { Spinner, Button, Textarea, Select, Label, makeStyles } from "@fluentui/react-components";
// import { Translate24Regular, ArrowSwap24Filled } from "@fluentui/react-icons";

// const useStyles = makeStyles({
//   root: {
//     padding: "20px",
//     backgroundColor: "#f8f9fa",
//     minHeight: "100vh",
//   },
//   pane: {
//     maxWidth: "600px",
//     margin: "0 auto",
//     backgroundColor: "#fff",
//     borderRadius: "8px",
//     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
//     padding: "24px",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     marginBottom: "24px",
//     color: "#2d3e50",
//   },
//   formGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//     marginBottom: "16px",
//   },
//   buttons: {
//     display: "flex",
//     gap: "12px",
//     flexWrap: "wrap",
//     margin: "16px 0",
//   },
//   status: {
//     marginTop: "16px",
//     padding: "12px",
//     borderRadius: "6px",
//     fontSize: "14px",
//     // Couleurs selon le statut (facultatif)
//     "&.loading": { backgroundColor: "#e6f3ff", color: "#005a9e" },
//     "&.success": { backgroundColor: "#e6ffec", color: "#22863a" },
//     "&.error": { backgroundColor: "#ffe6e6", color: "#cc0000" },
//   },
//   textarea: {
//     // Styles communs pour les 2 textareas (instructions + traduction)
//     // FluentUI "appearance" = "filled-darker" gère déjà beaucoup, mais vous pouvez personnaliser ici.
//   },
// });

// export default function TranslationPane() {
//   const [targetLanguage, setTargetLanguage] = useState("Français");
//   const [instructions, setInstructions] = useState("");
//   const [translatedText, setTranslatedText] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [statusType, setStatusType] = useState(""); // "loading" | "error" | "success" (facultatif)

//   // Pour savoir quel bouton est en cours de chargement
//   const [loadingAPI, setLoadingAPI] = useState(null);

//   const styles = useStyles();

//   /** Récupère le texte sélectionné dans Word */
//   async function getSelectedTextFromWord() {
//     return Word.run(async (context) => {
//       const selection = context.document.getSelection();
//       selection.load("text");
//       await context.sync();
//       return selection.text.trim();
//     });
//   }

//   /** Appelle votre backend (OpenAI, Claude, Gemini) */
//   async function callBackend(apiType, originalText) {
//     const endpointUrl = `https://officeaiserver.onrender.com/api/translate/${apiType}`;
//     // const endpointUrl = `http://localhost:3002/api/translate/${apiType}`; // en local ?

//     const bodyData = {
//       text: originalText,
//       targetLanguage,
//     };
//     if (instructions.trim()) {
//       bodyData.instructions = instructions.trim();
//     }

//     const response = await fetch(endpointUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(bodyData),
//     });
//     const data = await response.json();
//     return data.translation || "";
//   }

//   /** Quand on clique "Traduire" */
//   async function handleTranslate(apiType) {
//     try {
//       setStatusMessage("");
//       setStatusType("");
//       setLoadingAPI(apiType); // Indique l’API en cours de chargement

//       // Récupère le texte dans Word
//       const selectedText = await getSelectedTextFromWord();
//       if (!selectedText) {
//         setStatusMessage("Aucun texte sélectionné dans Word.");
//         setStatusType("error");
//         return;
//       }

//       setStatusMessage("Traduction en cours...");
//       setStatusType("loading");

//       // Appel au backend
//       const response = await callBackend(apiType, selectedText);
//       if (!response) {
//         setStatusMessage("Erreur : aucune traduction reçue.");
//         setStatusType("error");
//         return;
//       }

//       // On affiche la traduction dans le textarea
//       setTranslatedText(response);
//       setStatusMessage("Traduction terminée. Vérifiez et corrigez si nécessaire.");
//       setStatusType("success");
//     } catch (error) {
//       console.error("Erreur handleTranslate:", error);
//       setStatusMessage("Erreur lors de la traduction.");
//       setStatusType("error");
//     } finally {
//       // Libère le spinner
//       setLoadingAPI(null);
//     }
//   }

//   /** Quand on clique "Insérer dans Word" */
//   async function handleReplaceSelection() {
//     if (!translatedText.trim()) {
//       setStatusMessage("Aucune traduction à insérer.");
//       setStatusType("error");
//       return;
//     }

//     try {
//       setStatusMessage("Insertion dans Word...");
//       setStatusType("loading");

//       await replaceSelectedText(translatedText);

//       setStatusMessage("La sélection a été remplacée par votre texte corrigé !");
//       setStatusType("success");
//     } catch (error) {
//       console.error("Erreur handleReplaceSelection:", error);
//       setStatusMessage("Erreur lors de l'insertion du texte dans Word.");
//       setStatusType("error");
//     }
//   }

//   return (
//     <div className={styles.root}>
//       <div className={styles.pane}>
//         {/* Header */}
//         <div className={styles.header}>
//           <Translate24Regular />
//           <h2 style={{ margin: 0 }}>Traduction intelligente</h2>
//         </div>

//         {/* Langue cible */}
//         <div className={styles.formGroup}>
//           <Label>Langue cible</Label>
//           <Select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} appearance="filled-darker">
//             <option>Français</option>
//             <option>Anglais</option>
//             <option>Espagnol</option>
//             <option>Allemand</option>
//           </Select>
//         </div>

//         {/* Instructions */}
//         <div className={styles.formGroup}>
//           <Label>Instructions spéciales (optionnel)</Label>
//           <Textarea
//             appearance="filled-darker"
//             resize="vertical"
//             className={styles.textarea}
//             placeholder="Ex: Style formel, termes techniques à conserver..."
//             value={instructions}
//             onChange={(e) => setInstructions(e.target.value)}
//           />
//         </div>

//         {/* Boutons de traduction */}
//         <div className={styles.buttons}>
//           <Button
//             appearance="primary"
//             // Spinner visible UNIQUEMENT si loadingAPI === "openai"
//             icon={loadingAPI === "openai" ? <Spinner size="tiny" /> : undefined}
//             disabled={!!loadingAPI} // Désactive le bouton si on est en train de charger
//             onClick={() => handleTranslate("openai")}
//           >
//             OpenAI
//           </Button>

//           <Button
//             appearance="primary"
//             icon={loadingAPI === "claude" ? <Spinner size="tiny" /> : undefined}
//             disabled={!!loadingAPI}
//             onClick={() => handleTranslate("claude")}
//             style={{ backgroundColor: "#2cb673" }}
//           >
//             Claude
//           </Button>

//           <Button
//             appearance="primary"
//             icon={loadingAPI === "gemini" ? <Spinner size="tiny" /> : undefined}
//             disabled={!!loadingAPI}
//             onClick={() => handleTranslate("gemini")}
//             style={{ backgroundColor: "#6e14ef" }}
//           >
//             Gemini
//           </Button>
//         </div>

//         {/* Zone de texte pour la traduction */}
//         <div className={styles.formGroup}>
//           <Label>Traduction générée</Label>
//           <Textarea
//             appearance="filled-darker"
//             resize="vertical"
//             className={styles.textarea}
//             rows={6}
//             value={translatedText}
//             onChange={(e) => setTranslatedText(e.target.value)}
//             placeholder="La traduction apparaîtra ici..."
//           />
//         </div>

//         {/* Bouton pour insérer dans Word */}
//         <Button
//           appearance="outline"
//           icon={<ArrowSwap24Filled />}
//           onClick={handleReplaceSelection}
//           disabled={!translatedText.trim()}
//           style={{ width: "100%" }}
//         >
//           Insérer dans Word
//         </Button>

//         {/* Status message */}
//         {statusMessage && <div className={`${styles.status} ${statusType}`}>{statusMessage}</div>}
//       </div>
//     </div>
//   );
// }

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
