import { createContext, useContext, useState } from 'react'
import { LANGUAGES } from './data'
import { getT } from './i18n'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [langCode, setLangCode] = useState(() => {
    try { return localStorage.getItem('kc_lang') || null } catch { return null }
  })

  const t = getT(langCode || 'en')
  const lang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0]

  function setLanguage(code) {
    try { localStorage.setItem('kc_lang', code) } catch {}
    setLangCode(code)
  }

  return (
    <LangContext.Provider value={{ langCode: langCode || 'en', setLanguage, t, lang, LANGUAGES }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
