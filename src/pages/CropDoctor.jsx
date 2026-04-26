import { useState, useRef } from 'react'
import { analyzeCropDisease } from '../lib/gemini'
import { useLang } from '../lib/LangContext'
import styles from './CropDoctor.module.css'
import { LANGUAGES } from '../lib/i18n'

const SEV_LABELS = ['None','Very Low','Low','Moderate','High','Severe']
const SEV_COLORS = ['#22c55e','#84cc16','#eab308','#f97316','#ef4444','#991b1b']

export default function CropDoctor() {
  const { t, langCode } = useLang()
  const [state, setState] = useState('idle')
  const [result, setResult] = useState(null)
  const [preview, setPreview] = useState(null)
  const [speaking, setSpeaking] = useState(false)
  const fileRef = useRef()

  async function handleImage(file) {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setState('loading')
    const res = await analyzeCropDisease(file, langCode)
    setResult(res)
    setState('result')
  }

  async function handleVoice() {
    setSpeaking(true)
    await new Promise(r => setTimeout(r, 2200))
    setSpeaking(false)
    setState('loading')
    const res = await analyzeCropDisease('voice', langCode)
    setResult(res)
    setState('result')
  }

  function speakResult() {
    if (!result || !window.speechSynthesis) return
    const text = `${result.name}. ${result.cause} ${result.treatment}`
    const u = new SpeechSynthesisUtterance(text)
    const langMap = { hi:'hi-IN', mr:'mr-IN', pa:'pa-IN', ml:'ml-IN', ta:'ta-IN', te:'te-IN', kn:'kn-IN', bn:'bn-IN', gu:'gu-IN' }
    u.lang = langMap[langCode] || 'en-IN'
    window.speechSynthesis.speak(u)
  }

  const sev = result?.severity || 0

  const labels = {
    title:     { en:'🔬 Crop Doctor', hi:'🔬 फसल डॉक्टर', mr:'🔬 पीक डॉक्टर', pa:'🔬 ਫਸਲ ਡਾਕਟਰ', ml:'🔬 വിള ഡോക്ടർ', ta:'🔬 பயிர் மருத்துவர்' },
    sub:       { en:'AI disease detection — photo or voice, any language', hi:'AI रोग पहचान — फोटो या आवाज़, किसी भी भाषा में', mr:'AI रोग निदान — फोटो किंवा आवाज', pa:'AI ਬਿਮਾਰੀ ਪਛਾਣ — ਫੋਟੋ ਜਾਂ ਆਵਾਜ਼', ml:'AI രോഗ നിർണ്ണയം — ഫോട്ടോ അല്ലെങ്കിൽ ശബ്ദം', ta:'AI நோய் கண்டறிதல் — புகைப்படம் அல்லது குரல்' },
    dropTitle: { en:'Drop crop photo here', hi:'फसल की फोटो यहाँ डालें', mr:'पिकाचा फोटो टाका', pa:'ਫਸਲ ਦੀ ਫੋਟੋ ਇੱਥੇ ਪਾਓ', ml:'വിള ഫോട്ടോ ഇവിടെ ഇടുക', ta:'பயிர் புகைப்படம் இங்கே போடுங்கள்' },
    dropSub:   { en:'or click to browse', hi:'या क्लिक करें', mr:'किंवा क्लिक करा', pa:'ਜਾਂ ਕਲਿੱਕ ਕਰੋ', ml:'അല്ലെങ്കിൽ ക്ലിക്ക് ചെയ്യൂ', ta:'அல்லது கிளிக் செய்யுங்கள்' },
    voice:     { en:'🎤 Speak symptoms in your language', hi:'🎤 अपनी भाषा में लक्षण बोलें', mr:'🎤 तुमच्या भाषेत लक्षणे सांगा', pa:'🎤 ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਲੱਛਣ ਦੱਸੋ', ml:'🎤 നിങ്ങളുടെ ഭാഷയിൽ ലക്ഷണങ്ങൾ പറയൂ', ta:'🎤 உங்கள் மொழியில் அறிகுறிகள் சொல்லுங்கள்' },
    listening: { en:'🔴 Listening…', hi:'🔴 सुन रहा हूँ…', mr:'🔴 ऐकतोय…', pa:'🔴 ਸੁਣ ਰਿਹਾ ਹਾਂ…', ml:'🔴 കേൾക്കുന്നു…', ta:'🔴 கேட்கிறேன்…' },
    analyzing: { en:'Gemini Vision is analysing your crop…', hi:'Gemini Vision आपकी फसल का विश्लेषण कर रहा है…', mr:'Gemini Vision तुमच्या पिकाचे विश्लेषण करत आहे…', pa:'Gemini Vision ਤੁਹਾਡੀ ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ…', ml:'Gemini Vision നിങ്ങളുടെ വിള വിശകലനം ചെയ്യുന്നു…', ta:'Gemini Vision உங்கள் பயிரை பகுப்பாய்கிறது…' },
    playAudio: { en:'🔊 Hear diagnosis in your language', hi:'🔊 अपनी भाषा में सुनें', mr:'🔊 तुमच्या भाषेत ऐका', pa:'🔊 ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸੁਣੋ', ml:'🔊 നിങ്ങളുടെ ഭാഷയിൽ കേൾക്കൂ', ta:'🔊 உங்கள் மொழியில் கேளுங்கள்' },
    again:     { en:'Analyse another crop', hi:'दूसरी फसल जाँचें', mr:'दुसरे पीक तपासा', pa:'ਹੋਰ ਫਸਲ ਜਾਂਚੋ', ml:'മറ്റൊരു വിള പരിശോധിക്കൂ', ta:'மற்றொரு பயிரை சோதிக்கவும்' },
    cause:     { en:'Cause', hi:'कारण', mr:'कारण', pa:'ਕਾਰਨ', ml:'കാരണം', ta:'காரணம்' },
    treatment: { en:'Treatment', hi:'उपचार', mr:'उपचार', pa:'ਇਲਾਜ', ml:'ചികിത്സ', ta:'சிகிச்சை' },
    prevention:{ en:'Prevention', hi:'बचाव', mr:'प्रतिबंध', pa:'ਰੋਕਥਾਮ', ml:'പ്രതിരോധം', ta:'தடுப்பு' },
    timeline:  { en:'Timeline', hi:'समय-सीमा', mr:'कालमर्यादा', pa:'ਸਮਾਂ-ਸੀਮਾ', ml:'ടൈംലൈൻ', ta:'காலக்கோடு' },
    market:    { en:'Market Impact', hi:'बाज़ार असर', mr:'बाजार परिणाम', pa:'ਬਾਜ਼ਾਰ ਪ੍ਰਭਾਵ', ml:'വിപണി ഫലം', ta:'சந்தை தாக்கம்' },
    spoil:     { en:'days until spoilage', hi:'दिन बचे हैं', mr:'दिवस शिल्लक', pa:'ਦਿਨ ਬਾਕੀ', ml:'ദിവസം ബാക്കി', ta:'நாட்கள் மீதம்' },
  }
  const L = k => labels[k]?.[langCode] || labels[k]?.en

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{L('title')}</h1>
          <p className={styles.sub}>{L('sub')}</p>
        </div>
        <div className={styles.badges}>
          <span className="chip chip-amber">Gemini Vision</span>
          <span className="chip chip-blue">13 Languages</span>
          <span className="chip chip-green">Voice + Photo</span>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={`card ${styles.dropzone} ${preview?styles.hasPreview:''}`}
            onClick={() => fileRef.current?.click()}
            onDrop={e=>{e.preventDefault();handleImage(e.dataTransfer.files[0])}}
            onDragOver={e=>e.preventDefault()}>
            {preview
              ? <img src={preview} alt="Crop" className={styles.preview}/>
              : <div className={styles.dropContent}>
                  <div className={styles.dropIcon}>📷</div>
                  <div className={styles.dropTitle}>{L('dropTitle')}</div>
                  <div className={styles.dropSub}>{L('dropSub')}</div>
                </div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={e=>handleImage(e.target.files[0])}/>

          <div className={styles.orRow}><span>or</span></div>
          <button className={`${styles.voiceBtn} ${speaking?styles.voiceActive:''}`} onClick={handleVoice} disabled={state==='loading'}>
            {speaking ? L('listening') : L('voice')}
          </button>

          <div className={styles.langNote}>
            🌐 {langCode==='hi'?'13 भाषाओं में उत्तर मिलेगा':langCode==='mr'?'13 भाषांमध्ये उत्तर':langCode==='pa'?'13 ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਜਵਾਬ':langCode==='ml'?'13 ഭാഷകളിൽ ഉത്തരം':langCode==='ta'?'13 மொழிகளில் பதில்':'Answer in 13 Indian languages'}
          </div>
        </div>

        <div className={styles.right}>
          {state==='idle' && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🌱</div>
              <div className={styles.emptyTitle}>{langCode==='hi'?'फोटो लें और तुरंत जानें':langCode==='mr'?'फोटो काढा आणि लगेच जाणा':langCode==='pa'?'ਫੋਟੋ ਲਓ ਅਤੇ ਤੁਰੰਤ ਜਾਣੋ':langCode==='ml'?'ഫോട്ടോ എടുത്ത് ഉടനെ അറിയൂ':langCode==='ta'?'புகைப்படம் எடுத்து உடனே அறியுங்கள்':'Take a photo and know instantly'}</div>
              <div className={styles.emptySub}>{langCode==='hi'?'पत्ती, तना, या फल की फोटो लें — AI तुरंत रोग पहचानेगा और उपचार बताएगा आपकी भाषा में':'Take photo of leaf, stem or fruit — AI detects disease and tells treatment in your language'}</div>
            </div>
          )}

          {state==='loading' && (
            <div className={styles.loading}>
              <div className={styles.spinner}/>
              <div className={styles.loadingText}>{L('analyzing')}</div>
              {['Detecting disease patterns…','Assessing severity…','Generating treatment plan…',`Translating to ${LANGUAGES.find(l=>l.code===langCode)?.native||'your language'}…`].map((s,i)=>(
                <div key={i} className={styles.loadStep} style={{animationDelay:`${i*.4}s`}}>✓ {s}</div>
              ))}
            </div>
          )}

          {state==='result' && result && (
            <div className={`fade-up ${styles.result}`}>
              <div className={styles.diseaseCard} style={{borderLeftColor:SEV_COLORS[sev]}}>
                <div className={styles.diseaseName}>{result.name}</div>
                <div className={styles.diseaseConf}>{langCode==='hi'?'विश्वास':'Confidence'}: {result.confidence}% · {result.spoilDays} {L('spoil')}</div>
              </div>
              <div className={`card ${styles.sevCard}`}>
                <div className={styles.sevLabel}>Severity</div>
                <div className={styles.sevRow}>
                  {[0,1,2,3,4,5].map(n=>(
                    <div key={n} className={styles.sevBlock} style={{background:n<=sev?SEV_COLORS[n]:'#e5e7eb'}}/>
                  ))}
                  <span style={{color:SEV_COLORS[sev],fontSize:12,fontWeight:700,marginLeft:8}}>{SEV_LABELS[sev]}</span>
                </div>
              </div>
              {[['cause',result.cause,'🦠'],['treatment',result.treatment,'💊'],['prevention',result.prevention,'🛡️'],['timeline',result.timeline,'📅'],['market',result.marketImpact,'📊']].map(([k,v,icon])=>(
                <div key={k} className={`card ${styles.infoCard}`}>
                  <div className={styles.infoTitle}>{icon} {L(k)}</div>
                  <div className={styles.infoBody}>{v}</div>
                </div>
              ))}
              <button className="btn-primary" style={{justifyContent:'center'}} onClick={speakResult}>{L('playAudio')}</button>
              <button className={styles.retryBtn} onClick={()=>{setState('idle');setPreview(null);setResult(null)}}>{L('again')}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

