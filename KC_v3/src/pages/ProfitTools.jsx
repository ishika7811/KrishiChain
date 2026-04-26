import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import { calcNetProfit, checkCheating } from '../lib/gemini'
import styles from './ProfitTools.module.css'

const CROPS = ['Tomato','Onion','Potato','Wheat','Rice','Cotton','Soybean','Mango']
const DISTRICTS = ['Nagpur','Pune','Nashik','Amravati','Aurangabad','Kolhapur','Solapur','Latur','Satara','Akola']
const MANDIS = ['APMC Nagpur','APMC Pune','Nashik Mandi','Amravati Mandi','Aurangabad Hub','Kolhapur Market','Solapur APMC','Latur Mandi']
const VEHICLES = [
  {id:'truck',  labelEn:'Truck (5000kg)',  labelHi:'ट्रक (5000 किलो)'},
  {id:'tempo',  labelEn:'Tempo (2000kg)',  labelHi:'टेम्पो (2000 किलो)'},
  {id:'tractor',labelEn:'Tractor (1500kg)',labelHi:'ट्रैक्टर (1500 किलो)'},
  {id:'bike',   labelEn:'Bike/Cycle',      labelHi:'बाइक/साइकल'},
]

export default function ProfitTools() {
  const { t, langCode } = useLang()
  const [tab, setTab] = useState('profit')

  // Profit calc
  const [pForm, setPForm] = useState({ crop:'Tomato', qty:500, mandiPrice:26, distanceKm:80, vehicle:'truck' })
  const [pResult, setPResult] = useState(null)
  const [pLoading, setPLoading] = useState(false)

  // Cheat checker
  const [cForm, setCForm] = useState({ crop:'Tomato', agentRate:'', district:'Nagpur' })
  const [cResult, setCResult] = useState(null)
  const [cLoading, setCLoading] = useState(false)

  async function calcProfit() {
    setPLoading(true)
    const r = await calcNetProfit({ ...pForm, language: langCode })
    setPResult(r)
    setPLoading(false)
  }

  async function runCheck() {
    if (!cForm.agentRate) return
    setCLoading(true)
    const r = await checkCheating({ ...cForm, agentRate: Number(cForm.agentRate), language: langCode })
    setCResult(r)
    setCLoading(false)
  }

  const L = (en, hi, mr, pa, ml, ta) => {
    if (langCode==='hi') return hi
    if (langCode==='mr') return mr
    if (langCode==='pa') return pa
    if (langCode==='ml') return ml
    if (langCode==='ta') return ta
    return en
  }

  const vLabel = v => langCode==='hi' ? v.labelHi : v.labelEn

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {L('Smart Farming Tools','स्मार्ट किसान टूल्स','स्मार्ट शेतकरी साधने','ਸਮਾਰਟ ਕਿਸਾਨ ਟੂਲਸ','സ്മാർട്ട് ഫാം ടൂൾസ്','ஸ்மார்ட் விவசாய கருவிகள்')}
        </h1>
        <p className={styles.sub}>
          {L('Know your real profit before travelling + Detect if you\'re being cheated','यात्रा से पहले असली लाभ जानें + धोखा पकड़ें','प्रवासापूर्वी खरा नफा जाणा + फसवणूक पकडा','ਸਫ਼ਰ ਤੋਂ ਪਹਿਲਾਂ ਅਸਲ ਮੁਨਾਫਾ ਜਾਣੋ','യാത്രയ്ക്ക് മുൻപ് ലാഭം അറിയൂ','பயணிக்கும் முன் உண்மையான லாபம் அறிவீர்')}
        </p>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab==='profit'?styles.tabActive:''}`} onClick={()=>setTab('profit')}>
          💰 {L('Net Profit Calculator','लाभ कैलकुलेटर','नफा कॅल्क्युलेटर','ਮੁਨਾਫਾ ਕੈਲਕੁਲੇਟਰ','ലാഭ കാൽക്കുലേറ്റർ','லாப கணக்கிடல்')}
        </button>
        <button className={`${styles.tab} ${tab==='cheat'?styles.tabActive:''}`} onClick={()=>setTab('cheat')}>
          🚨 {L('Am I Being Cheated?','क्या धोखा हो रहा है?','फसवणूक होतेय का?','ਧੋਖਾ ਹੋ ਰਿਹਾ ਹੈ?','ചതിക്കുന്നുണ്ടോ?','ஏமாற்றுகிறார்களா?')}
        </button>
      </div>

      {tab === 'profit' && (
        <div className={styles.toolPanel}>
          <div className={styles.intro}>
            <div className={styles.introIcon}>🧮</div>
            <div>
              <div className={styles.introTitle}>{L('Real profit after ALL costs','सभी खर्चों के बाद असली लाभ','सर्व खर्चानंतर खरा नफा','ਸਾਰੇ ਖਰਚਿਆਂ ਤੋਂ ਬਾਅਦ ਅਸਲ ਮੁਨਾਫਾ','എല്ലാ ചെലവും കഴിഞ്ഞ ലാഭം','அனைத்து செலவுக்கும் பின் உண்மை லாபம்')}</div>
              <div className={styles.introDesc}>{L('Calculates: transport + commission (6.5%) + weighment deduction (5%). Most apps don\'t show this!','गणना: परिवहन + कमीशन (6.5%) + तौल कटौती (5%)। ज़्यादातर ऐप यह नहीं दिखाते!','गणना: वाहतूक + कमिशन (6.5%) + वजन कपात (5%).','ਗਣਨਾ: ਆਵਾਜਾਈ + ਕਮਿਸ਼ਨ (6.5%) + ਵਜ਼ਨ ਕਟੌਤੀ (5%).','ഗണന: ഗതാഗതം + കമ്മീഷൻ (6.5%) + തൂക്ക കിഴിവ് (5%).','கணக்கீடு: போக்குவரத்து + கமிஷன் (6.5%) + நிறை குறைப்பு (5%).')}</div>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>{t.yourCrop}</label>
              <select className={styles.input} value={pForm.crop} onChange={e=>setPForm(p=>({...p,crop:e.target.value}))}>
                {CROPS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t.quantity}</label>
              <input className={styles.input} type="number" min="10" value={pForm.qty} onChange={e=>setPForm(p=>({...p,qty:Number(e.target.value)}))}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{L('Mandi Price (₹/kg)','मंडी भाव (₹/किलो)','मंडी भाव (₹/किलो)','ਮੰਡੀ ਭਾਅ (₹/ਕਿੱਲੋ)','മണ്ടി വില (₹/കിലോ)','மண்டி விலை (₹/கிலோ)')}</label>
              <input className={styles.input} type="number" min="1" value={pForm.mandiPrice} onChange={e=>setPForm(p=>({...p,mandiPrice:Number(e.target.value)}))}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{L('Distance to Mandi (km)','मंडी की दूरी (किमी)','मंडीचे अंतर (किमी)','ਮੰਡੀ ਦੀ ਦੂਰੀ (ਕਿਮੀ)','മണ്ടി ദൂരം (കിമീ)','மண்டி தூரம் (கி.மீ)')}</label>
              <input className={styles.input} type="number" min="1" value={pForm.distanceKm} onChange={e=>setPForm(p=>({...p,distanceKm:Number(e.target.value)}))}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t.transportMode}</label>
              <select className={styles.input} value={pForm.vehicle} onChange={e=>setPForm(p=>({...p,vehicle:e.target.value}))}>
                {VEHICLES.map(v=><option key={v.id} value={v.id}>{vLabel(v)}</option>)}
              </select>
            </div>
          </div>

          <button className="btn-primary" onClick={calcProfit} disabled={pLoading} style={{marginTop:8}}>
            {pLoading ? <><span className="spinner-sm"/>{L('Calculating…','गणना हो रहा है…','गणना चालू…','ਗਣਨਾ ਚੱਲ ਰਹੀ ਹੈ…','കണക്കാക്കുന്നു…','கணக்கிடுகிறது…')}</> : `🧮 ${t.calculateProfit}`}
          </button>

          {pResult && (
            <div className={`${styles.result} ${pResult.profitable ? styles.resultGood : styles.resultBad} fade-up`}>
              <div className={styles.resultMsg}>{pResult.message}</div>
              <div className={styles.breakdown}>
                {[
                  [L('Gross Revenue','कुल आमदनी','एकूण उत्पन्न','ਕੁੱਲ ਆਮਦਨੀ','മൊത്തം വരുമാനം','மொத்த வருமானம்'), `₹${pResult.gross.toLocaleString()}`, '#16a34a'],
                  [L('Transport Cost','परिवहन खर्च','वाहतूक खर्च','ਆਵਾਜਾਈ ਖਰਚ','ഗതാഗത ചെലവ്','போக்குவரத்து செலவு'), `-₹${pResult.fuel.toLocaleString()}`, '#dc2626'],
                  [L('Mandi Commission','मंडी कमीशन','मंडी कमिशन','ਮੰਡੀ ਕਮਿਸ਼ਨ','മണ്ടി കമ്മീഷൻ','மண்டி கமிஷன்'), `-₹${pResult.commission.toLocaleString()}`, '#dc2626'],
                  [L('Weighment Deduction','तौल कटौती','वजन कपात','ਵਜ਼ਨ ਕਟੌਤੀ','തൂക്ക കിഴിവ്','நிறை குறைப்பு'), `-₹${pResult.weighment.toLocaleString()}`, '#dc2626'],
                  [L('NET PROFIT','शुद्ध लाभ','निव्वळ नफा','ਸ਼ੁੱਧ ਮੁਨਾਫਾ','ശുദ്ധ ലാഭം','நிகர லாபம்'), `₹${pResult.net.toLocaleString()}`, pResult.profitable?'#16a34a':'#dc2626'],
                ].map(([label,val,color],i) => (
                  <div key={i} className={`${styles.bRow} ${i===4?styles.bRowTotal:''}`}>
                    <span>{label}</span>
                    <span style={{color,fontWeight:i===4?800:600}}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'cheat' && (
        <div className={styles.toolPanel}>
          <div className={styles.intro}>
            <div className={styles.introIcon}>🕵️</div>
            <div>
              <div className={styles.introTitle}>{L('Is the agent telling you the truth?','क्या एजेंट सच बोल रहा है?','एजंट खरं बोलतोय का?','ਕੀ ਏਜੰਟ ਸੱਚ ਬੋਲ ਰਿਹਾ ਹੈ?','ഏജന്റ് സത്യം പറയുന്നുണ്ടോ?','ஏஜென்ட் உண்மை சொல்கிறாரா?')}</div>
              <div className={styles.introDesc}>{L('We check actual mandi rate vs what agent told you. If difference is more than 8%, you are being cheated.','हम असली मंडी भाव vs एजेंट ने क्या बताया। 8% से ज़्यादा अंतर = धोखा।','आम्ही खरा मंडी भाव vs एजंटने सांगितलेले तपासतो.','ਅਸੀਂ ਅਸਲ ਮੰਡੀ ਭਾਅ ਬਨਾਮ ਏਜੰਟ ਦਾ ਭਾਅ ਜਾਂਚਦੇ ਹਾਂ.','ഏജന്റ് പറഞ്ഞ നിരക്ക് vs യഥാർഥ മണ്ടി നിരക്ക്.','ஏஜென்ட் சொன்ன விலை vs உண்மையான மண்டி விலை.')}</div>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>{t.yourCrop}</label>
              <select className={styles.input} value={cForm.crop} onChange={e=>setCForm(p=>({...p,crop:e.target.value}))}>
                {CROPS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{L('Rate agent told you (₹/kg)','एजेंट ने जो भाव बताया (₹/किलो)','एजंटने सांगितलेला भाव (₹/किलो)','ਏਜੰਟ ਦਾ ਦੱਸਿਆ ਭਾਅ (₹/ਕਿੱਲੋ)','ഏജന്റ് പറഞ്ഞ നിരക്ക് (₹/കിലോ)','ஏஜென்ட் சொன்ன விலை (₹/கிலோ)')}</label>
              <input className={styles.input} type="number" min="1" placeholder={L('Enter rate agent said','एजेंट ने जो बताया','एजंटने सांगितलेला भाव','ਏਜੰਟ ਵੱਲੋਂ ਦੱਸਿਆ ਭਾਅ','ഏജന്റ് പറഞ്ഞ നിരക്ക്','ஏஜென்ட் சொன்ன விலை')} value={cForm.agentRate} onChange={e=>setCForm(p=>({...p,agentRate:e.target.value}))}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t.fromDistrict}</label>
              <select className={styles.input} value={cForm.district} onChange={e=>setCForm(p=>({...p,district:e.target.value}))}>
                {DISTRICTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <button className="btn-primary" style={{background:'#dc2626',marginTop:8}} onClick={runCheck} disabled={cLoading||!cForm.agentRate}>
            {cLoading ? <><span className="spinner-sm"/>{L('Checking…','जाँच हो रही है…','तपासत आहे…','ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ…','പരിശോധിക്കുന്നു…','சரிபார்க்கிறது…')}</> : `🚨 ${t.checkMandiRate}`}
          </button>

          {cResult && (
            <div className={`${styles.result} ${cResult.cheating ? styles.resultBad : styles.resultGood} fade-up`}>
              <div className={styles.resultMsg} style={{fontSize:16,fontWeight:800}}>{cResult.message}</div>
              {cResult.cheating && (
                <div className={styles.showScreen}>
                  📱 {L('Show this screen to the agent to demand correct rate!','यह स्क्रीन एजेंट को दिखाएं — सही भाव मांगें!','ही स्क्रीन एजंटला दाखवा!','ਇਹ ਸਕਰੀਨ ਏਜੰਟ ਨੂੰ ਦਿਖਾਓ!','ഈ സ്ക്രീൻ ഏജന്റിനെ കാണിക്കൂ!','இந்த திரையை ஏஜென்டிடம் காட்டுங்கள்!')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
