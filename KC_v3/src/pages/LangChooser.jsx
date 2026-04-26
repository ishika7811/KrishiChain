import { useLang } from '../lib/LangContext'
import styles from './LangChooser.module.css'

export default function LangChooser() {
  const { LANGUAGES, setLanguage } = useLang()

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroIcon}>🌾</div>
        <h1 className={styles.heroTitle}>KrishiChain</h1>
        <p className={styles.heroSub}>AI Farm Intelligence · आपकी भाषा में</p>
      </div>

      <div className={styles.prompt}>
        <p className={styles.promptText}>अपनी भाषा चुनें · Choose Your Language · ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ · உங்கள் மொழி</p>
      </div>

      <div className={styles.grid}>
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            className={styles.langBtn}
            onClick={() => setLanguage(lang.code)}
          >
            <span className={styles.langFlag}>{lang.flag}</span>
            <span className={styles.langNative}>{lang.native}</span>
            <span className={styles.langEng}>{lang.name}</span>
          </button>
        ))}
      </div>

      <p className={styles.footer}>
        You can change language anytime from the menu · किसी भी समय भाषा बदलें
      </p>
    </div>
  )
}
