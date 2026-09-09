import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyStoredLang, LanguageProvider } from './i18n';
import './styles.css';
import './styles-view.css';

applyStoredLang();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
