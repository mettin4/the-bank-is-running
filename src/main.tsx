import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { applyStoredLang, LanguageProvider } from './i18n';
import './styles.css';
import './styles-view.css';

applyStoredLang();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary scope="root">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
);
