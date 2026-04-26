import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import styles from './GovSchemes.module.css'

const SCHEMES = [
  { id:'pmkisan', name:'PM-KISAN', full:'Pradhan Mantri Kisan Samman Nidhi', amount:'₹6,000/year', icon:'💰', cat:'income', color:'#dcfce7', border:'#86efac', tag:'Most Important', helpline:'155261', link:'https://pmkisan.gov.in', unclaimed:'₹14,000 Crore unclaimed!',
    eligibility:'All landholding farmers. Excludes govt employees & income tax payers.',
    howToApply:'Go to nearest CSC centre with: Aadhaar card + bank passbook + land records (Khasra/Khatauni). Takes 10 minutes.',
    steps:['Visit nearest CSC (Jan Seva Kendra)','Carry Aadhaar + bank passbook + land papers','CSC operator registers you online free','₹2,000 credited to bank every 4 months','Check status: pmkisan.gov.in'],
    namesInLang:{ hi:'पीएम किसान', mr:'पीएम किसान', pa:'ਪੀਐਮ ਕਿਸਾਨ', ml:'പി.എം കിസാൻ', ta:'பி.எம். கிசான்' }
  },
  { id:'pmfby', name:'PMFBY', full:'Pradhan Mantri Fasal Bima Yojana', amount:'Full crop loss covered', icon:'🛡️', cat:'insurance', color:'#dbeafe', border:'#93c5fd', tag:'Must Apply Before Sowing', helpline:'14447', link:'https://pmfby.gov.in', unclaimed:'₹8,500 Crore unclaimed claims',
    eligibility:'All farmers growing notified crops. Apply BEFORE sowing season starts.',
    howToApply:'Apply at bank branch, CSC, or pmfby.gov.in. Pay only 1.5-2% premium. Govt pays rest.',
    steps:['Apply before sowing (deadline: 2 weeks before season)','Visit bank or CSC','Pay small premium (1.5-2% of sum insured)','Get insurance certificate','Claim within 72 hours of crop damage via app or helpline'],
    namesInLang:{ hi:'फसल बीमा', mr:'पीक विमा', pa:'ਫਸਲ ਬੀਮਾ', ml:'വിള ഇൻഷുറൻസ്', ta:'பயிர் காப்பீடு' }
  },
  { id:'kcc', name:'KCC', full:'Kisan Credit Card — 4% loan', amount:'Up to ₹3 lakh at 4%', icon:'💳', cat:'loan', color:'#fef9c3', border:'#fde047', tag:'Cheapest Loan Available', helpline:'1800-180-1551', link:'https://nabard.org', unclaimed:'Crores of farmers without KCC',
    eligibility:'Any farmer, sharecropper, or tenant farmer. No collateral needed for under ₹1.6 lakh.',
    howToApply:'Apply at any nationalised bank. Need Aadhaar, land records, passport photo.',
    steps:['Go to nearest SBI/PNB/BOB branch','Ask for KCC application form','Submit Aadhaar + land records','Bank approves in 2 weeks','Withdraw as needed, pay back after harvest'],
    namesInLang:{ hi:'किसान क्रेडिट कार्ड', mr:'किसान क्रेडिट कार्ड', pa:'ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ', ml:'കിസാൻ ക്രെഡിറ്റ് കാർഡ്', ta:'கிசான் கடன் அட்டை' }
  },
  { id:'enam', name:'eNAM', full:'National Agriculture Market', amount:'Access 1,000+ mandis', icon:'🏪', cat:'market', color:'#f3e8ff', border:'#c084fc', tag:'Sell Direct — No Middleman', helpline:'1800-270-0224', link:'https://enam.gov.in', unclaimed:'Only 5% farmers use it',
    eligibility:'Any farmer with smartphone + bank account.',
    howToApply:'Register free at enam.gov.in or nearest APMC office.',
    steps:['Register at enam.gov.in (free)','Upload land & ID documents','Get eNAM farmer ID','List your produce online','Buyers bid from across India — best price wins'],
    namesInLang:{ hi:'ई-नाम', mr:'ई-नाम', pa:'ਈ-ਨਾਮ', ml:'ഇ-നാം', ta:'இ-நாம்' }
  },
  { id:'soil', name:'Soil Health Card', full:'Free Soil Testing Scheme', amount:'Free + saves ₹4,000-8,000/acre/yr', icon:'🌱', cat:'subsidy', color:'#dcfce7', border:'#86efac', tag:'Free Service', helpline:'District Agri Office', link:'https://soilhealth.dac.gov.in', unclaimed:'Most farmers never test soil',
    eligibility:'All farmers. Free of cost.',
    howToApply:'Contact local agriculture extension officer. They collect soil sample from your farm.',
    steps:['Call district agriculture office','Officer visits your farm free','Soil sample sent to lab','Receive card with fertiliser recommendations','Follow card to save ₹4,000-8,000 per acre'],
    namesInLang:{ hi:'मृदा स्वास्थ्य कार्ड', mr:'मृदा आरोग्य कार्ड', pa:'ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ', ml:'മണ്ണ് ആരോഗ്യ കാർഡ്', ta:'மண் ஆரோக்கிய அட்டை' }
  },
  { id:'pmksy', name:'PMKSY Drip', full:'PM Krishi Sinchai Yojana', amount:'55-90% subsidy on drip irrigation', icon:'💧', cat:'subsidy', color:'#cffafe', border:'#67e8f9', tag:'Water Saving Technology', helpline:'District Agriculture Office', link:'https://pmksy.gov.in', unclaimed:'Available all states',
    eligibility:'All farmers. Priority: small & marginal farmers.',
    howToApply:'Apply at district agriculture office with land records.',
    steps:['Go to district agriculture office','Submit land records + Aadhaar','Get approval letter','Buy drip/sprinkler system from approved vendor','Govt pays 55-90% directly to vendor'],
    namesInLang:{ hi:'ड्रिप सिंचाई सब्सिडी', mr:'ठिबक सिंचन अनुदान', pa:'ਡਰਿੱਪ ਸਿੰਚਾਈ ਸਬਸਿਡੀ', ml:'ഡ്രിപ് ജലസേചന സബ്സിഡി', ta:'சொட்டு நீர் மானியம்' }
  },
]

const CATS = [
  {id:'all',label:'All Schemes',labelHi:'सभी योजनाएं'},
  {id:'income',label:'Income Support',labelHi:'आय सहायता'},
  {id:'insurance',label:'Insurance',labelHi:'बीमा'},
  {id:'loan',label:'Cheap Loans',labelHi:'सस्ते ऋण'},
  {id:'market',label:'Market Access',labelHi:'बाज़ार'},
  {id:'subsidy',label:'Subsidies',labelHi:'सब्सिडी'},
]

export default function GovSchemes() {
  const { t, langCode } = useLang()
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [checking, setChecking] = useState(false)
  const [eligible, setEligible] = useState(null)

  const filtered = SCHEMES.filter(s => {
    if (cat !== 'all' && s.cat !== cat) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.full.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function checkEligibility(scheme) {
    setChecking(true)
    await new Promise(r => setTimeout(r, 1200))
    setEligible(scheme.id)
    setChecking(false)
    setExpanded(scheme.id)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrow}>🏛️ {langCode === 'hi' ? 'सरकारी योजनाएं' : langCode === 'mr' ? 'सरकारी योजना' : langCode === 'pa' ? 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ' : langCode === 'ml' ? 'സർക്കാർ പദ്ധതികൾ' : langCode === 'ta' ? 'அரசு திட்டங்கள்' : 'Government Schemes'}</div>
          <h1 className={styles.title}>{langCode==='hi'?'आपके लिए सरकारी पैसा':langCode==='mr'?'तुमच्यासाठी सरकारी पैसा':langCode==='pa'?'ਤੁਹਾਡੇ ਲਈ ਸਰਕਾਰੀ ਪੈਸਾ':langCode==='ml'?'നിങ്ങൾക്കുള്ള സർക്കാർ പണം':langCode==='ta'?'உங்களுக்கான அரசு பணம்':'Government Money For You'}</h1>
          <p className={styles.sub}>{langCode==='hi'?'₹14,000 करोड़ से अधिक दावा नहीं किया गया है। जांचें कि आप क्या पाने के हकदार हैं।':'Over ₹14,000 Crore unclaimed. Check what you are entitled to.'}</p>
        </div>
        <div className={styles.alertStat}>
          <div className={styles.alertNum}>₹14,000Cr</div>
          <div className={styles.alertLbl}>{langCode==='hi'?'अनक्लेम्ड':langCode==='mr'?'दावा न केलेले':langCode==='ml'?'ക്ലെയിം ചെയ്യാത്തത്':langCode==='ta'?'கோரப்படாதது':'Unclaimed'}</div>
        </div>
      </div>

      {/* Search + filter */}
      <div className={styles.controls}>
        <input
          className={`${styles.searchInput}`}
          placeholder={t.searchSchemes}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.catRow}>
          {CATS.map(c => (
            <button key={c.id} className={`${styles.catBtn} ${cat===c.id?styles.catActive:''}`} onClick={()=>setCat(c.id)}>
              {langCode==='hi'?c.labelHi:c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes grid */}
      <div className={styles.grid}>
        {filtered.map((s,i) => (
          <div key={s.id} className={`${styles.schemeCard} fade-up`} style={{animationDelay:`${i*.06}s`,background:s.color,border:`1.5px solid ${s.border}`}}>
            <div className={styles.scTop}>
              <span className={styles.scIcon}>{s.icon}</span>
              <div className={styles.scMeta}>
                <div className={styles.scName}>{s.namesInLang?.[langCode] || s.name}</div>
                <div className={styles.scFull}>{s.full}</div>
              </div>
              {s.tag && <span className={styles.scTag}>{s.tag}</span>}
            </div>

            <div className={styles.scAmount}>{s.amount}</div>
            <div className={styles.scUnclaimed}>⚠️ {s.unclaimed}</div>
            <div className={styles.scElig}><strong>{langCode==='hi'?'पात्रता:':'Eligibility:'}</strong> {s.eligibility}</div>

            {expanded === s.id && (
              <div className={`${styles.scExpanded} fade-up`}>
                <div className={styles.stepsTitle}>{langCode==='hi'?'कैसे आवेदन करें:':'How to apply:'}</div>
                {s.steps.map((step,si) => (
                  <div key={si} className={styles.stepRow}>
                    <div className={styles.stepNum}>{si+1}</div>
                    <div className={styles.stepText}>{step}</div>
                  </div>
                ))}
                <div className={styles.helplineRow}>
                  📞 {langCode==='hi'?'हेल्पलाइन':'Helpline'}: <strong>{s.helpline}</strong>
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>{langCode==='hi'?'वेबसाइट':'Website →'}</a>
                </div>
              </div>
            )}

            <div className={styles.scActions}>
              <button className={styles.expandBtn} onClick={() => setExpanded(expanded===s.id?null:s.id)}>
                {expanded===s.id ? (langCode==='hi'?'कम देखें':'Show Less ▲') : (langCode==='hi'?'कैसे आवेदन करें ▼':'How to Apply ▼')}
              </button>
              <button
                className={styles.eligBtn}
                onClick={() => checkEligibility(s)}
                disabled={checking}
              >
                {checking && eligible!==s.id ? '…' : eligible===s.id ? (langCode==='hi'?'✅ आप पात्र हैं':'✅ You Qualify!') : t.checkEligibility}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
