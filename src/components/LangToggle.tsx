import { useI18n } from '../i18n';

/** EN / 中文. The only control in the header. */
export function LangToggle() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="langtoggle" role="group" aria-label={t('app.langLabel')}>
      <button
        type="button"
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
        lang="en"
      >
        EN
      </button>
      <span className="langtoggle-sep" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        aria-pressed={lang === 'zh'}
        onClick={() => setLang('zh')}
        lang="zh-CN"
      >
        中文
      </button>
    </div>
  );
}
