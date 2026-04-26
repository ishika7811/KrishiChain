import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import styles from './IntlLoans.module.css'

const BANKS = [
  { id:'worldbank', name:'IFAD / World Bank', flag:'🌍', rate:'1.25%/year', max:'₹5,00,000', tenure:'15-20 years', color:'#dbeafe', border:'#93c5fd',
    full:'International Fund for Agricultural Development', target:'Small & marginal farmers (below 2 hectares land)',
    channel:'Applied through NABARD which channels IFAD funds across India',
    steps:['Register at nabard.org/ifad-schemes','Fill IFAD beneficiary form at nearest NABARD office','Submit: Aadhaar + bank passbook + land records','Bank verification (15-20 days)','Loan disbursed directly to account at 1.25% per year'],
    contact:'nabard.org', helpline:'022-26539895', badge:'Lowest Interest', badgeColor:'#16a34a'
  },
  { id:'adb', name:'Asian Development Bank', flag:'🏦', rate:'4%/year', max:'₹10,00,000', tenure:'10 years', color:'#fef9c3', border:'#fde047',
    full:'ADB Agricultural Credit via NABARD & State Co-op Banks', target:'Farmer groups, FPOs, cooperatives (5+ members)',
    channel:'Through state cooperative banks linked to NABARD-ADB credit lines',
    steps:['Form or join an FPO (Farmer Producer Organisation)','Apply through district cooperative bank as a group','Group credit assessment by bank officer','Loan approved at 4% for 10 years','Repay after harvest season'],
    contact:'adb.org/india', helpline:'011-24628657', badge:'For Groups', badgeColor:'#d97706'
  },
  { id:'giz', name:'GIZ Green Agriculture', flag:'🌿', rate:'2%/year', max:'₹3,00,000', tenure:'7 years', color:'#dcfce7', border:'#86efac',
    full:'German Development Bank Sustainable Farming Loan', target:'Farmers adopting organic or sustainable practices',
    channel:'Available through select state agriculture banks under Indo-German climate cooperation',
    steps:['Enrol in any organic farming certification programme','Apply via state agriculture bank (mention GIZ scheme)','Farm inspection by GIZ partner organisation','Loan approved for organic inputs & sustainable equipment','Repay over 7 years at 2%'],
    contact:'giz.de/india', helpline:'District Agriculture Office', badge:'Organic Farmers', badgeColor:'#059669'
  },
  { id:'usaid', name:'USAID PACE Programme', flag:'🇺🇸', rate:'6%/year', max:'₹25,00,000', tenure:'5 years', color:'#f3e8ff', border:'#c084fc',
    full:'USAID Promoting Agricultural Competitiveness for Entrepreneurs', target:'Agri-entrepreneurs & large farmer groups (5+ acres)',
    channel:'Applied through partner banks (HDFC Agri, ICICI Rural) under USAID India programme',
    steps:['Check if your district is covered (usaid.gov/india/agriculture)','Visit HDFC or ICICI rural branch','Submit business plan + land records','Bank assessment (30-45 days)','Loan for farm modernisation, cold chain, processing'],
    contact:'usaid.gov/india', helpline:'011-23016000', badge:'Agri Business', badgeColor:'#7c3aed'
  },
  { id:'kcc', name:'KCC — Kisan Credit Card', flag:'🇮🇳', rate:'4%/year (after subsidy)', max:'₹3,00,000', tenure:'1 year (renew annually)', color:'#fff7ed', border:'#fdba74',
    full:'Government of India — Cheapest Indian Bank Loan for Farmers', target:'All farmers, sharecroppers, tenant farmers',
    channel:'Any nationalised bank: SBI, PNB, BOB, Canara, Union Bank',
    steps:['Go to nearest SBI or nationalised bank','Ask for KCC application form (free)','Submit Aadhaar + land records + photo','Bank approves in 2 weeks, no collateral under ₹1.6 lakh','Withdraw as needed, repay within 1 year at 4%'],
    contact:'Any nationalised bank', helpline:'1800-180-1551', badge:'Easiest to Get', badgeColor:'#ea580c'
  },
]

export default function IntlLoans() {
  const { t, langCode } = useLang()
  const [selected, setSelected] = useState(null)
  const [applyStep, setApplyStep] = useState(null)
  const [applying, setApplying] = useState(false)

  async function startApply(bank) {
    setApplying(true)
    await new Promise(r => setTimeout(r, 1000))
    setApplyStep(bank.id)
    setApplying(false)
  }

  const labels = {
    title: { en:'Low-Interest Farm Loans', hi:'कम ब्याज कृषि ऋण', mr:'कमी व्याज शेती कर्ज', pa:'ਘੱਟ ਵਿਆਜ ਖੇਤੀ ਕਰਜ਼ੇ', ml:'കുറഞ്ഞ പലിശ കൃഷി വായ്പ', ta:'குறைந்த வட்டி விவசாய கடன்' },
    sub: { en:'International & government banks offering cheap loans for farmers — as low as 1.25% per year', hi:'किसानों के लिए सस्ते ऋण — केवल 1.25% प्रति वर्ष से', mr:'शेतकऱ्यांसाठी स्वस्त कर्ज — फक्त 1.25% प्रतिवर्ष', pa:'ਕਿਸਾਨਾਂ ਲਈ ਸਸਤੇ ਕਰਜ਼ੇ — ਸਿਰਫ਼ 1.25% ਪ੍ਰਤੀ ਸਾਲ', ml:'1.25% മുതൽ കർഷകർക്ക് വായ്പ', ta:'1.25% வட்டியில் விவசாயிகளுக்கு கடன்' },
  }
  const L = l => labels[l]?.[langCode] || labels[l]?.en || ''

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrow}>🏦 {langCode==='hi'?'बैंक ऋण':langCode==='mr'?'बँक कर्ज':langCode==='pa'?'ਬੈਂਕ ਕਰਜ਼ੇ':langCode==='ml'?'ബാങ്ക് വായ്പ':langCode==='ta'?'வங்கி கடன்':'Bank Loans'}</div>
          <h1 className={styles.title}>{L('title')}</h1>
          <p className={styles.sub}>{L('sub')}</p>
        </div>
        <div className={styles.rateStat}>
          <div className={styles.rateNum}>1.25%</div>
          <div className={styles.rateLbl}>{langCode==='hi'?'न्यूनतम ब्याज':langCode==='mr'?'किमान व्याज':'Min. Interest'}</div>
        </div>
      </div>

      <div className={styles.comparison}>
        {[
          {label:langCode==='hi'?'साहूकार ब्याज':'Moneylender Rate',rate:'36-60%',color:'#dc2626',bad:true},
          {label:langCode==='hi'?'सामान्य बैंक':'Normal Bank',rate:'11-14%',color:'#f97316',bad:true},
          {label:langCode==='hi'?'किसान क्रेडिट':'Kisan Credit',rate:'4%',color:'#eab308',bad:false},
          {label:langCode==='hi'?'GIZ जर्मनी':'GIZ Germany',rate:'2%',color:'#22c55e',bad:false},
          {label:langCode==='hi'?'IFAD विश्व बैंक':'IFAD World Bank',rate:'1.25%',color:'#16a34a',bad:false},
        ].map((r,i) => (
          <div key={i} className={styles.rateBar}>
            <div className={styles.rateLabel}>{r.label}</div>
            <div className={styles.rateBarOuter}>
              <div className={styles.rateBarFill} style={{width:`${Math.min(r.bad?(parseFloat(r.rate)/60*80):parseFloat(r.rate)*10,100)}%`,background:r.color}}/>
            </div>
            <div className={styles.rateVal} style={{color:r.color}}>{r.rate}</div>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {BANKS.map((bank,i) => (
          <div key={bank.id} className={`${styles.bankCard} fade-up`} style={{animationDelay:`${i*.06}s`,background:bank.color,border:`1.5px solid ${bank.border}`}}>
            <div className={styles.bankTop}>
              <span className={styles.bankFlag}>{bank.flag}</span>
              <div className={styles.bankMeta}>
                <div className={styles.bankName}>{bank.name}</div>
                <div className={styles.bankFull}>{bank.full}</div>
              </div>
              <span className={styles.bankBadge} style={{background:bank.badgeColor}}>{bank.badge}</span>
            </div>

            <div className={styles.rateRow}>
              <div className={styles.rateItem}><div className={styles.riVal}>{bank.rate}</div><div className={styles.riLbl}>{langCode==='hi'?'ब्याज':'Interest'}</div></div>
              <div className={styles.rateItem}><div className={styles.riVal}>{bank.max}</div><div className={styles.riLbl}>{langCode==='hi'?'अधिकतम':'Max Loan'}</div></div>
              <div className={styles.rateItem}><div className={styles.riVal}>{bank.tenure}</div><div className={styles.riLbl}>{langCode==='hi'?'अवधि':'Tenure'}</div></div>
            </div>

            <div className={styles.targetRow}>
              <strong>{langCode==='hi'?'किसके लिए:':'For:'}</strong> {bank.target}
            </div>
            <div className={styles.channelRow}>
              <strong>{langCode==='hi'?'कैसे मिलेगा:':'Channel:'}</strong> {bank.channel}
            </div>

            {selected === bank.id && (
              <div className={`${styles.stepsPanel} fade-up`}>
                <div className={styles.stepsTitle}>{langCode==='hi'?'आवेदन के चरण:':'Steps to Apply:'}</div>
                {bank.steps.map((s,si) => (
                  <div key={si} className={styles.stepRow}>
                    <div className={styles.stepNum}>{si+1}</div>
                    <div className={styles.stepText}>{s}</div>
                  </div>
                ))}
                <div className={styles.contactRow}>
                  📞 {bank.helpline} &nbsp;|&nbsp;
                  <a href={`https://${bank.contact}`} target="_blank" rel="noopener" className={styles.siteLink}>{bank.contact} →</a>
                </div>
              </div>
            )}

            {applyStep === bank.id && (
              <div className={styles.appliedBanner}>
                ✅ {langCode==='hi'?'आवेदन शुरू किया। नजदीकी बैंक शाखा जाएं।':'Application started! Visit nearest bank branch with documents.'}
              </div>
            )}

            <div className={styles.bankActions}>
              <button className={styles.viewBtn} onClick={()=>setSelected(selected===bank.id?null:bank.id)}>
                {selected===bank.id?(langCode==='hi'?'कम देखें ▲':'Show Less ▲'):(langCode==='hi'?'चरण देखें ▼':'View Steps ▼')}
              </button>
              <button className={styles.applyBtn} onClick={()=>startApply(bank)} disabled={applying}>
                {applying?'…':t.applyLoan}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
