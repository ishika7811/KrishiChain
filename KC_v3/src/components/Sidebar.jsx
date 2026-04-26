import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import styles from './Sidebar.module.css'

export default function Sidebar({ mobileOpen, onClose }) {
  const { t, langCode, setLanguage, LANGUAGES } = useLang()
  const [showLang, setShowLang] = useState(false)

  const NAV = [
    { to:'/',           icon:'◈', label:t.dashboard },
    { to:'/list',       icon:'✦', label:t.listProduce },
    { to:'/crop-doctor',icon:'⊕', label:t.cropDoctor },
    { to:'/forecast',   icon:'↗', label:t.forecast },
    { to:'/tools',      icon:'🧮', label:t.profitCalc },
    { to:'/cooperative',icon:'⋈', label:t.cooperative },
    { to:'/market',     icon:'◎', label:t.marketMap },
    { to:'/nearby',     icon:'📍', label:t.nearbyLandmarks },
  ]
  const NAV2 = [
    { to:'/schemes',    icon:'🏛️', label:t.govSchemes },
    { to:'/loans',      icon:'🏦', label:t.loans },
    { to:'/carbon',     icon:'❋',  label:t.carbonCert },
    { to:'/krishiscore',icon:'◉',  label:t.krishiScore },
  ]
  const SECRET = [
    { to:'/mandiguard', icon:'⊗', label:t.mandiGuard },
  ]

  const currentLang = LANGUAGES.find(l => l.code === langCode)

  return (
    <>
      {mobileOpen && <div className={styles.overlay} onClick={onClose}/>}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>🌾</div>
          <div>
            <div className={styles.logoName}>{t.appName}</div>
            <div className={styles.logoTag}>{t.tagline}</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSec}>{langCode==='hi'?'मुख्य':langCode==='mr'?'मुख्य':langCode==='pa'?'ਮੁੱਖ':langCode==='ml'?'പ്രധാനം':langCode==='ta'?'முக்கியம்':'Main'}</div>
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to==='/'} onClick={onClose}
              className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <span className={styles.ni}>{item.icon}</span>
              <span className={styles.nl}>{item.label}</span>
            </NavLink>
          ))}

          <div className={styles.navSec} style={{marginTop:8}}>
            {langCode==='hi'?'योजनाएं':langCode==='mr'?'योजना':langCode==='pa'?'ਯੋਜਨਾਵਾਂ':langCode==='ml'?'പദ്ധതി':langCode==='ta'?'திட்டங்கள்':'Finance & Govt'}
          </div>
          {NAV2.map(item => (
            <NavLink key={item.to} to={item.to} onClick={onClose}
              className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <span className={styles.ni}>{item.icon}</span>
              <span className={styles.nl}>{item.label}</span>
            </NavLink>
          ))}

          <div className={styles.navDiv}/>
          <div className={styles.navSec} style={{marginTop:4,display:'flex',justifyContent:'space-between'}}>
            <span>{langCode==='hi'?'सीक्रेट':langCode==='mr'?'गुप्त':langCode==='ml'?'രഹസ്യം':'Secret'}</span>
            <span className={styles.nb}>🏆</span>
          </div>
          {SECRET.map(item => (
            <NavLink key={item.to} to={item.to} onClick={onClose}
              className={({isActive}) => `${styles.navItem} ${styles.si} ${isActive ? styles.active : ''}`}>
              <span className={styles.ni}>{item.icon}</span>
              <span className={styles.nl}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.foot}>
          <NavLink to="/profile" onClick={onClose} className={styles.profLink}>
            <span>👤</span>
            <span>{t.profile}</span>
          </NavLink>
          <div style={{position:'relative'}}>
            <button className={styles.langBtn} onClick={() => setShowLang(p => !p)}>
              🌐 {currentLang?.native || 'Language'}
            </button>
            {showLang && (
              <div className={styles.langDrop}>
                {LANGUAGES.map(lang => (
                  <button key={lang.code} className={`${styles.langOpt} ${langCode===lang.code?styles.langOptOn:''}`}
                    onClick={() => { setLanguage(lang.code); setShowLang(false); onClose() }}>
                    {lang.flag} {lang.native}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
