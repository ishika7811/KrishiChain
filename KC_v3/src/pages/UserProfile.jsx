import { useState, useEffect } from 'react'
import { useLang } from '../lib/LangContext'
import styles from './UserProfile.module.css'

const USER_TYPES = [
  { id:'farmer',  icon:'👨‍🌾', labelEn:'Farmer',  labelHi:'किसान',     labelMr:'शेतकरी',  labelPa:'ਕਿਸਾਨ',  labelMl:'കർഷകൻ',     labelTa:'விவசாயி' },
  { id:'trader',  icon:'🏪',   labelEn:'Trader',  labelHi:'व्यापारी',  labelMr:'व्यापारी', labelPa:'ਵਪਾਰੀ',  labelMl:'വ്യാപാരി',   labelTa:'வணிகர்' },
  { id:'agent',   icon:'🤝',   labelEn:'Agent',   labelHi:'एजेंट',     labelMr:'एजंट',    labelPa:'ਏਜੰਟ',   labelMl:'ഏജന്റ്',      labelTa:'முகவர்' },
  { id:'fpo',     icon:'🌾',   labelEn:'FPO/Cooperative', labelHi:'FPO/सहकारी', labelMr:'FPO/सहकारी', labelPa:'FPO/ਸਹਿਕਾਰੀ', labelMl:'FPO/സഹകരണം', labelTa:'FPO/கூட்டுறவு' },
]

const CROPS_LIST = ['Tomato','Onion','Potato','Wheat','Rice','Cotton','Soybean','Mango','Orange','Sugarcane','Maize','Bajra']
const STATES = ['Maharashtra','Uttar Pradesh','Punjab','Haryana','Gujarat','Rajasthan','Madhya Pradesh','Karnataka','Tamil Nadu','Andhra Pradesh','Telangana','Kerala','Bihar','West Bengal','Odisha','Assam']

const EMPTY = { type:'farmer', name:'', phone:'', state:'Maharashtra', district:'Nagpur', village:'', landAcres:'', crops:[], language:'en', experience:'', bio:'' }

export default function UserProfile() {
  const { t, langCode, setLanguage, LANGUAGES } = useLang()
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kc_profile')) || EMPTY }
    catch { return EMPTY }
  })
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('profile') // profile | stats | settings

  function set(k, v) { setProfile(p => ({ ...p, [k]: v })) }

  function toggleCrop(crop) {
    setProfile(p => ({
      ...p,
      crops: p.crops.includes(crop) ? p.crops.filter(c => c !== crop) : [...p.crops, crop]
    }))
  }

  function saveProfile() {
    localStorage.setItem('kc_profile', JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const utype = USER_TYPES.find(u => u.id === profile.type) || USER_TYPES[0]
  const typeLabel = (u) => {
    if (langCode === 'hi') return u.labelHi
    if (langCode === 'mr') return u.labelMr
    if (langCode === 'pa') return u.labelPa
    if (langCode === 'ml') return u.labelMl
    if (langCode === 'ta') return u.labelTa
    return u.labelEn
  }

  const labels = {
    title:      { en:'My Profile',           hi:'मेरी प्रोफाइल',      mr:'माझी प्रोफाइल',   pa:'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ',  ml:'എന്റെ പ്രൊഫൈൽ',    ta:'என் சுயவிவரம்' },
    whoAreYou:  { en:'Who are you?',         hi:'आप कौन हैं?',         mr:'तुम्ही कोण आहात?', pa:'ਤੁਸੀਂ ਕੌਣ ਹੋ?',   ml:'നിങ്ങൾ ആരാണ്?',     ta:'நீங்கள் யார்?' },
    fullName:   { en:'Full Name',            hi:'पूरा नाम',           mr:'पूर्ण नाव',         pa:'ਪੂਰਾ ਨਾਮ',       ml:'മുഴുവൻ പേര്',       ta:'முழு பெயர்' },
    phone:      { en:'Mobile Number',        hi:'मोबाइल नंबर',        mr:'मोबाइल नंबर',      pa:'ਮੋਬਾਈਲ ਨੰਬਰ',    ml:'മൊബൈൽ നമ്പർ',      ta:'மொபைல் எண்' },
    state:      { en:'State',               hi:'राज्य',              mr:'राज्य',             pa:'ਰਾਜ',             ml:'സംസ്ഥാനം',          ta:'மாநிலம்' },
    district:   { en:'District',            hi:'जिला',               mr:'जिल्हा',            pa:'ਜ਼ਿਲ੍ਹਾ',          ml:'ജില്ല',              ta:'மாவட்டம்' },
    village:    { en:'Village / Taluka',     hi:'गांव / तहसील',       mr:'गाव / तालुका',     pa:'ਪਿੰਡ / ਤਹਿਸੀਲ',  ml:'ഗ്രാമം / താലൂക്ക്', ta:'கிராமம் / தாலூகா' },
    land:       { en:'Land (acres)',         hi:'जमीन (एकड़)',         mr:'जमीन (एकर)',        pa:'ਜ਼ਮੀਨ (ਏਕੜ)',      ml:'ഭൂമി (ഏക്കർ)',       ta:'நிலம் (ஏக்கர்)' },
    crops:      { en:'Crops you grow',       hi:'आप जो फसल उगाते हैं', mr:'तुम्ही पिकवत असलेली पिके', pa:'ਤੁਸੀਂ ਜੋ ਫਸਲਾਂ ਉਗਾਉਂਦੇ ਹੋ', ml:'നിങ്ങൾ വളർത്തുന്ന വിളകൾ', ta:'நீங்கள் பயிரிடும் பயிர்கள்' },
    experience: { en:'Years of Experience', hi:'अनुभव (वर्ष)',        mr:'अनुभव (वर्षे)',     pa:'ਤਜ਼ਰਬਾ (ਸਾਲ)',    ml:'അനുഭവം (വർഷം)',     ta:'அனுபவம் (ஆண்டுகள்)' },
    bio:        { en:'About you (optional)', hi:'अपने बारे में (वैकल्पिक)', mr:'तुमच्याबद्दल', pa:'ਆਪਣੇ ਬਾਰੇ', ml:'നിങ്ങളെ കുറിച്ച്', ta:'உங்களைப் பற்றி' },
    langPref:   { en:'Preferred Language',  hi:'पसंदीदा भाषा',        mr:'आवडती भाषा',        pa:'ਮਨਪਸੰਦ ਭਾਸ਼ਾ',    ml:'ഇഷ്ട ഭാഷ',          ta:'விரும்பிய மொழி' },
    save:       { en:'Save Profile',        hi:'प्रोफाइल सेव करें',   mr:'प्रोफाइल सेव्ह करा', pa:'ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਕਰੋ', ml:'പ്രൊഫൈൽ സേവ് ചെയ്യുക', ta:'சுயவிவரம் சேமிக்கவும்' },
    savedMsg:   { en:'✅ Profile saved!',    hi:'✅ प्रोफाइल सेव हुई!', mr:'✅ प्रोफाइल सेव्ह झाली!', pa:'✅ ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਹੋਈ!', ml:'✅ പ്രൊഫൈൽ സേവ് ആയി!', ta:'✅ சுயவிவரம் சேமிக்கப்பட்டது!' },
  }
  const L = k => labels[k]?.[langCode] || labels[k]?.en

  return (
    <div className={styles.page}>
      {/* Header card */}
      <div className={styles.profileHero}>
        <div className={styles.avatar}>{utype.icon}</div>
        <div className={styles.heroInfo}>
          <div className={styles.heroName}>{profile.name || (langCode==='hi'?'नाम नहीं दिया':'No name yet')}</div>
          <div className={styles.heroType}>{typeLabel(utype)} · {profile.district || 'District not set'}</div>
          {profile.crops.length > 0 && (
            <div className={styles.heroCrops}>
              {profile.crops.slice(0,4).map(c => <span key={c} className={styles.cropTag}>{c}</span>)}
              {profile.crops.length > 4 && <span className={styles.cropTag}>+{profile.crops.length-4}</span>}
            </div>
          )}
        </div>
        <div className={styles.heroStats}>
          <div className={styles.hStat}><div className={styles.hStatVal}>{profile.landAcres||'—'}</div><div className={styles.hStatLbl}>{langCode==='hi'?'एकड़':'acres'}</div></div>
          <div className={styles.hStat}><div className={styles.hStatVal}>{profile.crops.length||'—'}</div><div className={styles.hStatLbl}>{langCode==='hi'?'फसलें':'crops'}</div></div>
          <div className={styles.hStat}><div className={styles.hStatVal}>{profile.experience||'—'}</div><div className={styles.hStatLbl}>{langCode==='hi'?'वर्ष':'years'}</div></div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {[['profile', langCode==='hi'?'प्रोफाइल':'Profile'], ['language', langCode==='hi'?'भाषा':'Language']].map(([id,label]) => (
          <button key={id} className={`${styles.tab} ${tab===id?styles.tabActive:''}`} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className={styles.formWrap}>
          {/* User type */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>{L('whoAreYou')}</div>
            <div className={styles.typeGrid}>
              {USER_TYPES.map(u => (
                <button key={u.id} className={`${styles.typeBtn} ${profile.type===u.id?styles.typeBtnActive:''}`} onClick={()=>set('type',u.id)}>
                  <span className={styles.typeIcon}>{u.icon}</span>
                  <span className={styles.typeLabel}>{typeLabel(u)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Basic info */}
          <div className={styles.section}>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>{L('fullName')}</label>
                <input className={styles.fieldInput} value={profile.name} onChange={e=>set('name',e.target.value)} placeholder={langCode==='hi'?'अपना नाम लिखें':'Enter your name'}/>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>{L('phone')}</label>
                <input className={styles.fieldInput} value={profile.phone} onChange={e=>set('phone',e.target.value)} placeholder="9876543210" type="tel"/>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>{L('state')}</label>
                <select className={styles.fieldInput} value={profile.state} onChange={e=>set('state',e.target.value)}>
                  {STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>{L('district')}</label>
                <input className={styles.fieldInput} value={profile.district} onChange={e=>set('district',e.target.value)} placeholder={langCode==='hi'?'जिला':'District'}/>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>{L('village')}</label>
                <input className={styles.fieldInput} value={profile.village} onChange={e=>set('village',e.target.value)} placeholder={langCode==='hi'?'गांव':'Village'}/>
              </div>
              {profile.type === 'farmer' && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>{L('land')}</label>
                  <input className={styles.fieldInput} value={profile.landAcres} onChange={e=>set('landAcres',e.target.value)} placeholder="2.5" type="number"/>
                </div>
              )}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>{L('experience')}</label>
                <input className={styles.fieldInput} value={profile.experience} onChange={e=>set('experience',e.target.value)} placeholder="10" type="number"/>
              </div>
            </div>
          </div>

          {/* Crops */}
          {(profile.type === 'farmer' || profile.type === 'trader') && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>{L('crops')}</div>
              <div className={styles.cropsGrid}>
                {CROPS_LIST.map(crop => (
                  <button key={crop} className={`${styles.cropBtn} ${profile.crops.includes(crop)?styles.cropActive:''}`} onClick={()=>toggleCrop(crop)}>
                    {crop}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          <div className={styles.section}>
            <div className={styles.field} style={{gridColumn:'1/-1'}}>
              <label className={styles.fieldLabel}>{L('bio')}</label>
              <textarea className={styles.fieldInput} rows={3} value={profile.bio} onChange={e=>set('bio',e.target.value)} placeholder={langCode==='hi'?'अपने बारे में कुछ लिखें...':'Tell buyers/sellers about yourself...'}/>
            </div>
          </div>

          {saved && <div className={styles.savedMsg}>{L('savedMsg')}</div>}
          <button className="btn-primary" style={{fontSize:15,padding:'13px 28px'}} onClick={saveProfile}>{L('save')}</button>
        </div>
      )}

      {tab === 'language' && (
        <div className={styles.langWrap}>
          <div className={styles.langTitle}>{L('langPref')}</div>
          <div className={styles.langGrid}>
            {LANGUAGES.map(lang => (
              <button key={lang.code} className={`${styles.langBtn} ${langCode===lang.code?styles.langActive:''}`} onClick={()=>setLanguage(lang.code)}>
                <span className={styles.langFlag}>{lang.flag}</span>
                <span className={styles.langNative}>{lang.native}</span>
                <span className={styles.langEng}>{lang.name}</span>
                {langCode===lang.code && <span className={styles.langCheck}>✓</span>}
              </button>
            ))}
          </div>
          <p className={styles.langNote}>{langCode==='hi'?'भाषा बदलने पर पूरा ऐप उस भाषा में हो जाएगा।':'Changing language will update the entire app immediately.'}</p>
        </div>
      )}
    </div>
  )
}
