// import React, { useState } from "react";
// import { replaceSelectedText } from "../taskpane.js";
// import "./TranslationPane.css"; // Import du fichier CSS ci-dessus

// export default function TranslationPane() {
//   const [targetLanguage, setTargetLanguage] = useState("Français");
//   const [instructions, setInstructions] = useState("");
//   const [status, setStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   async function getSelectedTextFromWord() {
//     return Word.run(async (context) => {
//       const selection = context.document.getSelection();
//       selection.load("text");
//       await context.sync();
//       return selection.text.trim();
//     });
//   }

//   async function callBackend(apiType, originalText) {
//     const endpointUrl = `https://officeaiserver.onrender.com/api/translate/${apiType}`;
//     // const endpointUrl = `http://localhost:3001/api/translate/${apiType}`; // mode local ?

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

//   async function handleTranslate(apiType) {
//     try {
//       setStatus("");
//       setIsLoading(true);

//       const selectedText = await getSelectedTextFromWord();
//       if (!selectedText) {
//         setStatus("Aucun texte sélectionné dans Word.");
//         return;
//       }

//       setStatus("Traduction en cours...");

//       const translatedText = await callBackend(apiType, selectedText);
//       if (!translatedText) {
//         setStatus("Erreur : aucune traduction reçue.");
//         return;
//       }

//       await replaceSelectedText(translatedText);
//       setStatus("Traduction effectuée !");
//     } catch (error) {
//       console.error("Erreur handleTranslate:", error);
//       setStatus("Erreur lors de la traduction.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="translation-pane">
//       <h3>Traduction de la sélection</h3>

//       {/* Sélecteur de langue */}
//       <div className="form-row">
//         <label className="form-label">Langue cible :</label>
//         <select className="form-select" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
//           <option value="Français">Français</option>
//           <option value="Anglais">Anglais</option>
//           <option value="Espagnol">Espagnol</option>
//           <option value="Allemand">Allemand</option>
//         </select>
//       </div>

//       {/* Instructions optionnelles */}
//       <div className="form-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
//         <label className="form-label">Instructions (optionnel) :</label>
//         <textarea
//           className="form-textarea"
//           rows={3}
//           placeholder="Ex: Style formel, glossaire financier..."
//           value={instructions}
//           onChange={(e) => setInstructions(e.target.value)}
//         />
//       </div>

//       {/* Boutons de traduction */}
//       <div className="buttons">
//         <button onClick={() => handleTranslate("openai")} disabled={isLoading} className="button">
//           Traduire (OpenAI)
//         </button>

//         <button onClick={() => handleTranslate("claude")} disabled={isLoading} className="button green">
//           Traduire (Claude)
//         </button>

//         <button onClick={() => handleTranslate("gemini")} disabled={isLoading} className="button purple">
//           Traduire (Gemini)
//         </button>
//       </div>

//       {/* Zone de statut */}
//       <div className="status">{status}</div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { replaceSelectedText } from "../taskpane.js";
import "./TranslationPane.css";

export default function TranslationPane() {
  const [targetLanguage, setTargetLanguage] = useState("Français");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Nouveau state pour stocker la traduction retournée par l’API
  const [translatedText, setTranslatedText] = useState("");

  /**
   * Récupère le texte sélectionné depuis Word
   */
  async function getSelectedTextFromWord() {
    return Word.run(async (context) => {
      const selection = context.document.getSelection();
      selection.load("text");
      await context.sync();
      return selection.text.trim();
    });
  }

  /**
   * Envoie une requête POST à votre backend
   */
  async function callBackend(apiType, originalText) {
    const endpointUrl = `https://officeaiserver.onrender.com/api/translate/${apiType}`;
    // const endpointUrl = `http://localhost:3002/api/translate/${apiType}`; // si usage local

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

  /**
   * Clique sur un bouton "Traduire" (OpenAI/Claude/Gemini)
   */
  async function handleTranslate(apiType) {
    try {
      setStatus("");
      setIsLoading(true);

      // Récupère le texte sélectionné
      const selectedText = await getSelectedTextFromWord();
      if (!selectedText) {
        setStatus("Aucun texte sélectionné dans Word.");
        return;
      }

      setStatus("Traduction en cours...");

      // Appel au backend
      const response = await callBackend(apiType, selectedText);
      if (!response) {
        setStatus("Erreur : aucune traduction reçue.");
        return;
      }

      // Au lieu de remplacer directement la sélection,
      // on stocke la traduction dans 'translatedText'.
      setTranslatedText(response);
      setStatus("Traduction terminée. Vérifiez et corrigez si nécessaire.");
    } catch (error) {
      console.error("Erreur handleTranslate:", error);
      setStatus("Erreur lors de la traduction.");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Remplace la sélection Word par 'translatedText'
   */
  async function handleReplaceSelection() {
    if (!translatedText.trim()) {
      setStatus("Aucune traduction à insérer.");
      return;
    }

    try {
      setStatus("Insertion dans Word...");
      await replaceSelectedText(translatedText);
      setStatus("La sélection a été remplacée avec votre texte corrigé !");
    } catch (error) {
      console.error("Erreur handleReplaceSelection:", error);
      setStatus("Erreur lors de l'insertion du texte dans Word.");
    }
  }

  return (
    <div className="translation-pane">
      <h3>Traduction de la sélection</h3>

      {/* Sélecteur de langue */}
      <div className="form-row">
        <label className="form-label">Langue cible :</label>
        <select className="form-select" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
          <option value="Français">Français</option>
          <option value="Anglais">Anglais</option>
          <option value="Espagnol">Espagnol</option>
          <option value="Allemand">Allemand</option>
        </select>
      </div>

      {/* Instructions optionnelles */}
      <div className="form-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <label className="form-label">Instructions (optionnel) :</label>
        <textarea
          className="form-textarea"
          rows={3}
          placeholder="Ex: Style formel, glossaire financier..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>

      {/* Boutons de traduction */}
      <div className="buttons">
        <button onClick={() => handleTranslate("openai")} disabled={isLoading} className="button">
          Traduire (OpenAI)
        </button>
        <button onClick={() => handleTranslate("claude")} disabled={isLoading} className="button green">
          Traduire (Claude)
        </button>
        <button onClick={() => handleTranslate("gemini")} disabled={isLoading} className="button purple">
          Traduire (Gemini)
        </button>
      </div>

      {/* Zone d'édition de la traduction */}
      <div className="form-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <label className="form-label">Texte traduit (modifiable) :</label>
        <textarea
          className="form-textarea"
          rows={5}
          placeholder="La traduction apparaîtra ici..."
          value={translatedText}
          onChange={(e) => setTranslatedText(e.target.value)}
        />
      </div>

      {/* Bouton pour remplacer la sélection dans Word */}
      <div className="buttons">
        <button onClick={handleReplaceSelection} className="button" disabled={!translatedText}>
          Remplacer la sélection dans Word
        </button>
      </div>

      {/* Zone de statut */}
      <div className="status">{status}</div>
    </div>
  );
}
