import React, { useState } from "react";
import { replaceSelectedText } from "../taskpane.js"; // On importe la fonction Word.run

function TranslationPane() {
  const [targetLanguage, setTargetLanguage] = useState("Français");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
   * Envoie une requête POST à votre backend:
   *  - /api/translate/openai
   *  - /api/translate/claude
   *  - /api/translate/gemini
   */
  async function callBackend(apiType, text) {
    const endpointUrl = `https://officeaiserver.onrender.com/api/translate/${apiType}`;
    //const endpointUrl = `http://localhost:3001/api/translate/${apiType}`;
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage }),
    });
    const data = await response.json();
    return data.translation || "";
  }

  /**
   * Gère le clic sur un bouton "Traduire"
   */
  async function handleTranslate(apiType) {
    try {
      setStatus("");
      setIsLoading(true);

      // 1) Récupérer le texte sélectionné
      const selectedText = await getSelectedTextFromWord();
      if (!selectedText) {
        setStatus("Aucun texte sélectionné dans Word.");
        return;
      }

      setStatus("Traduction en cours...");

      // 2) Appeler le backend (OpenAI, Claude ou Gemini)
      const translatedText = await callBackend(apiType, selectedText);

      if (!translatedText) {
        setStatus("Erreur: aucune traduction reçue.");
        return;
      }

      // 3) Remplacer la sélection par la traduction
      await replaceSelectedText(translatedText);
      setStatus("Traduction effectuée !");
    } catch (error) {
      console.error(error);
      setStatus("Erreur lors de la traduction.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border rounded shadow p-4 m-4 bg-white">
      <h3 className="text-xl font-bold mb-2">Traduction de la sélection</h3>
      <div className="mb-4 flex items-center space-x-2">
        <label className="font-medium">Langue cible :</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="Français">Français</option>
          <option value="Anglais">Anglais</option>
          <option value="Espagnol">Espagnol</option>
          <option value="Allemand">Allemand</option>
        </select>
      </div>
      <div className="space-x-2 mb-4">
        <button
          onClick={() => handleTranslate("openai")}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Traduire (OpenAI)
        </button>
        <button
          onClick={() => handleTranslate("claude")}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Traduire (Claude)
        </button>
        <button
          onClick={() => handleTranslate("gemini")}
          disabled={isLoading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Traduire (Gemini)
        </button>
      </div>
      <div className="text-blue-600 min-h-[1.5rem]">{status}</div>
    </div>
  );
}

export default TranslationPane;
