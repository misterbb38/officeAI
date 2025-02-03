import React from "react";
import { createRoot } from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

function HelpPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Aide &amp; Présentation</h1>
      <p>Contenu de la page help…</p>
    </div>
  );
}

// Montre React dans l'élément #help-root
const container = document.getElementById("help-root");
const root = createRoot(container);
root.render(
  <FluentProvider theme={webLightTheme}>
    <HelpPage />
  </FluentProvider>
);
