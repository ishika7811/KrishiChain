import { useNavigate } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { MOCK_LISTINGS, URGENCY_COLORS } from '../lib/data'
import styles from './Dashboard.module.css'

function SpoilageRing({ days, urgency }) {
  const max=14,pct=Math.min(days/max,1),r=26,circ=2*Math.PI*r,dash=pct*circ
  const colors={critical:'#ef4444',high:'#f97316',medium:'#eab308',safe:'#22c55e'}
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="5"/>
      <circle cx="32" cy="32" r={r} fill="none" stroke={colors[urgency]} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 32 32)"
        style={{transition:'stroke-dasharray .6s ease'}}/>
      <text x="32" y="36" textAnchor="middle" fontSize="13" fontWeight="800" fill={colors[urgency]}>{days}d</text>
    </svg>
  )
}

export default function Dashboard() {
  const nav = useNavigate()
  const { t, langCode } = useLang()

  const STATS = [
    {label:t.listingsActive,value:'2,847',delta:'+12%',icon:'📋',bg:'linear-gradient(135deg,#e8faf5,#f0fdf8)'},
    {label:t.farmersOnline,value:'1,203',delta:'+8%', icon:'👨‍🌾',bg:'linear-gradient(135deg,#eef6ff,#f5fbff)'},
    {label:t.dealsToday,   value:'₹4.2L', delta:'+23%',icon:'💰',bg:'linear-gradient(135deg,#fffbea,#fffef5)'},
    {label:t.kgSaved,      value:'18,400',delta:'+31%',icon:'♻️',bg:'linear-gradient(135deg,#fdf2fb,#fef8fe)'},
  ]

  const QUICK = [
    {icon:'🔬',label:t.cropDoctor,    sub:langCode==='hi'?'फोटो से रोग पहचानें':'Detect disease by photo', route:'/crop-doctor',color:'#e8faf5'},
    {icon:'🧮',label:t.profitCalc,    sub:langCode==='hi'?'यात्रा से पहले लाभ जानें':'Know profit before travel',route:'/tools',     color:'#fff8e1'},
    {icon:'🚨',label:t.amIBeingCheated,sub:langCode==='hi'?'एजेंट सच बोल रहा है?':'Is agent telling truth?',  route:'/tools',     color:'#fff0f0'},
    {icon:'⊗',label:t.mandiGuard,     sub:langCode==='hi'?'मंडी में धोखाधड़ी पकड़ें':'Detect mandi cartel',     route:'/mandiguard',color:'#fff8f0',hot:true},
    {icon:'🏛️',label:t.govSchemes,    sub:langCode==='hi'?'सरकारी पैसा पाएं':'Claim govt money',            route:'/schemes',   color:'#e8f4fd'},
    {icon:'🏦',label:t.loans,          sub:langCode==='hi'?'1.25% ब्याज पर ऋण':'Loan at 1.25% interest',      route:'/loans',     color:'#fef9e7'},
  ]

  const greet = langCode==='hi'?`${t.goodMorning}, रमेश 🌅`:langCode==='mr'?`${t.goodMorning}, रमेश 🌅`:langCode==='pa'?`${t.goodMorning}, ਰਮੇਸ਼ 🌅`:langCode==='ml'?`${t.goodMorning}, രമേഷ് 🌅`:langCode==='ta'?`${t.goodMorning}, ரமேஷ் 🌅`:`${t.goodMorning}, Ramesh 🌅`

  return (
    <div className={styles.page}>
      <div className={styles.heroStrip}>
        <div className={styles.heroLeft}>
          <div className={styles.heroGreet}>{greet}</div>
          <h1 className={styles.heroTitle}>{t.yourFarm}</h1>
          <p className={styles.heroSub}>
            {langCode==='hi'?'3 सक्रिय लिस्टिंग · 2 सहकारी अवसर · 1 मूल्य अलर्ट':langCode==='mr'?'3 सक्रिय यादी · 2 सहकारी संधी · 1 भाव सूचना':langCode==='pa'?'3 ਸਰਗਰਮ ਲਿਸਟਿੰਗ · 2 ਸਹਿਕਾਰੀ ਮੌਕੇ':langCode==='ml'?'3 സജീവ ലിസ്റ്റിങ്ങ് · 2 സഹകരണ അവസരം':langCode==='ta'?'3 செயலில் பட்டியல் · 2 கூட்டுறவு வாய்ப்பு':'3 active listings · 2 cooperative opportunities · 1 price alert'}
          </p>
        </div>
        <button className="btn-gold" onClick={() => nav('/list')} style={{flexShrink:0,fontWeight:800}}>
          + {t.listProduce}
        </button>
      </div>

      <div className={styles.statsGrid}>
        {STATS.map((s,i)=>(
          <div key={i} className={`${styles.statCard} fade-up`} style={{animationDelay:`${i*.06}s`,background:s.bg}}>
            <div className={styles.statTop}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statDelta}>{s.delta}</span>
            </div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={`${styles.alertBox} fade-up-2`}>
        <span className={styles.alertPulse}/>
        <div className={styles.alertBody}>
          <strong>{t.mandiGuard}:</strong> {langCode==='hi'?'APMC नागपुर में टमाटर का भाव 11 दिनों से जिला औसत से 34% कम — कार्टेल की आशंका।':langCode==='mr'?'APMC नागपूर मध्ये टोमॅटोचा भाव 11 दिवसांपासून जिल्हा सरासरीपेक्षा 34% कमी.':langCode==='pa'?'APMC ਨਾਗਪੁਰ ਵਿੱਚ ਟਮਾਟਰ 11 ਦਿਨਾਂ ਤੋਂ ਜ਼ਿਲੇ ਦੀ ਔਸਤ ਤੋਂ 34% ਘੱਟ.':langCode==='ml'?'APMC നാഗ്പൂരിൽ ടൊമാറ്റോ 11 ദിവസമായി ശരാശരിയേക്കാൾ 34% കുറവ്.':langCode==='ta'?'APMC நாக்பூரில் தக்காளி 11 நாட்களாக மாவட்ட சராசரியை விட 34% குறைவு.':'APMC Nagpur showing suspicious Tomato suppression — 34% below district average for 11 days. Potential cartel.'}
        </div>
        <button className={styles.alertCta} onClick={()=>nav('/mandiguard')}>{langCode==='hi'?'जाँचें →':'Investigate →'}</button>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{langCode==='hi'?'लाइव लिस्टिंग':langCode==='mr'?'लाइव यादी':langCode==='pa'?'ਲਾਈਵ ਲਿਸਟਿੰਗ':langCode==='ml'?'ലൈവ് ലിസ്റ്റിങ്ങ്':langCode==='ta'?'நேரடி பட்டியல்':'Live Listings'}</h2>
            <span className={styles.liveTag}><span className={styles.livePulse}/>Live</span>
          </div>
          <div className={styles.listingsCol}>
            {MOCK_LISTINGS.map((l,i) => {
              const u = URGENCY_COLORS[l.urgency]
              return (
                <div key={l.id} className={`${styles.listCard} fade-up`} style={{animationDelay:`${i*.05}s`}} onClick={()=>nav('/market')}>
                  <div className={styles.lcLeft}><SpoilageRing days={l.daysLeft} urgency={l.urgency}/></div>
                  <div className={styles.lcMid}>
                    <div className={styles.lcCrop}>{l.crop}</div>
                    <div className={styles.lcFarmer}>{l.farmer} · {l.district}</div>
                    <div className={styles.lcMeta}>{l.qty.toLocaleString()} kg · ₹{l.price}/kg</div>
                  </div>
                  <div className={styles.lcRight}>
                    <span className={styles.lcStatus} style={{background:u.bg,color:u.text,border:`1px solid ${u.border}`}}>{u.label}</span>
                    <span className={styles.lcTime}>{l.listed}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.aside}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{langCode==='hi'?'जल्दी करें':langCode==='mr'?'लवकर करा':langCode==='pa'?'ਜਲਦੀ ਕਰੋ':langCode==='ml'?'വേഗം ചെയ്യൂ':langCode==='ta'?'விரைவில் செய்யுங்கள்':'Quick Actions'}</h2>
          </div>
          <div className={styles.quickGrid}>
            {QUICK.map((q,i)=>(
              <button key={i} className={styles.quickBtn} style={{background:q.color}} onClick={()=>nav(q.route)}>
                {q.hot && <span className={styles.hotTag}>🏆 {langCode==='hi'?'सीक्रेट':'Secret'}</span>}
                <span className={styles.quickIcon}>{q.icon}</span>
                <div className={styles.quickLabel}>{q.label}</div>
                <div className={styles.quickSub}>{q.sub}</div>
              </button>
            ))}
          </div>

          <div className={styles.sdgCard}>
            <div className={styles.sdgTitle}>UN SDGs · {langCode==='hi'?'7 लक्ष्य':'7 Goals'}</div>
            <div className={styles.sdgList}>
              {['SDG 1','SDG 2','SDG 3','SDG 8','SDG 10','SDG 12','SDG 13'].map(s=>(
                <span key={s} className={styles.sdgPill}>{s}</span>
              ))}
            </div>
            <div className={styles.sdgNote}>14 Google APIs · 14 screens · Firebase deployed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
