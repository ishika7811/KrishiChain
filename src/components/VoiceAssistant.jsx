
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { speakText, listenOnce, answerQuery, LANG_BCP } from '../lib/voice'
import styles from './VoiceAssistant.module.css'

// Greetings in all 22 Indian languages
const GREETINGS = {
  en:  "Namaste! I am KrishiChain, your AI farming assistant. Ask me about crop prices, disease, government schemes or loans. How can I help you today?",
  hi:  "नमस्ते! मैं कृषिचेन हूँ, आपका AI किसान सहायक। फसल भाव, रोग, सरकारी योजना या ऋण के बारे में पूछें।",
  mr:  "नमस्कार! मी कृषिचेन आहे. पीक भाव, रोग, सरकारी योजना किंवा कर्जाबद्दल विचारा.",
  pa:  "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਕ੍ਰਿਸ਼ੀਚੇਨ ਹਾਂ। ਫਸਲ ਭਾਅ, ਰੋਗ, ਸਰਕਾਰੀ ਯੋਜਨਾ ਜਾਂ ਕਰਜ਼ੇ ਬਾਰੇ ਪੁੱਛੋ।",
  ml:  "നമസ്കാരം! ഞാൻ കൃഷിചെയിൻ ആണ്. വിള വില, രോഗം, സർക്കാർ പദ്ധതി, വായ്പ — എന്തും ചോദിക്കൂ.",
  ta:  "வணக்கம்! நான் கிருஷிசேன். பயிர் விலை, நோய், அரசு திட்டங்கள், கடன் — எதுவும் கேளுங்கள்.",
  te:  "నమస్కారం! నేను కృషిచెయిన్. పంట ధరలు, వ్యాధి, పథకాలు, రుణాలు — ఏదైనా అడగండి.",
  kn:  "ನಮಸ್ಕಾರ! ನಾನು ಕೃಷಿಚೇನ್. ಬೆಳೆ ಬೆಲೆ, ರೋಗ, ಯೋಜನೆ, ಸಾಲ — ಏನಾದರೂ ಕೇಳಿ.",
  gu:  "નમસ્તે! હું કૃષિચેન. ભાવ, રોગ, સરકારી યોજના, લોન — કંઈ પૂછો.",
  bn:  "নমস্কার! আমি কৃষিচেন। ফসলের দাম, রোগ, প্রকল্প, ঋণ — যা খুশি জিজ্ঞাসা করুন।",
  or:  "ନମସ୍କାର! ମୁଁ କୃଷିଚେନ। ଫସଲ ମୂଲ୍ୟ, ରୋଗ, ଯୋଜନା, ଋଣ — ପ୍ରଶ୍ନ କରନ୍ତୁ।",
  as:  "নমস্কাৰ! মই কৃষিচেইন। শস্য দাম, ৰোগ, আঁচনি, ঋণ — যি সোধিব সুধক।",
  ur:  "السلام علیکم! میں کرشی چین ہوں۔ فصل قیمت، بیماری، سرکاری منصوبے، قرض — کچھ بھی پوچھیں۔",
  mai: "प्रणाम! हम कृषिचेन छी। फसल भाव, रोग, योजना या ऋणक बारे पुछि सकैत छी।",
  ne:  "नमस्ते! म कृषिचेन। बाली मूल्य, रोग, योजना, ऋण — जे चाहे सोध्नुस्।",
  kok: "नमस्कार! हांव कृषिचेन. पीक भाव, रोग, योजना विशीं विचारात येता.",
  doi: "नमस्ते! मैं कृषिचेन आँ. फसल भाव, रोग, योजना बारे पुच्छो.",
  mni: "নমস্কার! মরি কৃষিচেন। পাম্বৈ মী, অসুক, পথকং মতাংদা হায়বিয়ু।",
  sat: "जोहार! ञु कृषिचेन। पड़हा दाम, आसोय, सरकार कामी बाबते नेञ।",
  ks:  "آداب! مۄ کرِشی چَین۔ فصل قیمت، بیماری، یوجنا پُچھو۔",
  sd:  "نمستي! مان ڪرشي چين. فصل قيمت، بيماري، اسڪيم پڇو.",
  sa:  "नमस्ते! अहं कृषिचेन। फसल मूल्य, रोग, योजना पृच्छन्तु।",
}

// Navigation keyword map
const NAV_MAP = {
  '/crop-doctor': ['crop doctor','disease','rrog','rog','रोग','बीमारी','ਰੋਗ','రోగ','நோய்','ರೋಗ','രോഗ','রোগ'],
  '/forecast':    ['forecast','price','bhav','daam','भाव','दाम','ਭਾਅ','ధర','விலை','ಬೆಲೆ','വില','ভাও'],
  '/tools':       ['profit','cheat','fraud','dhokha','लाभ','धोखा','ਮੁਨਾਫਾ','ਧੋਖਾ','లాభ','மோசடி','ಲಾಭ','ലാഭ','नफा','फसवणूक'],
  '/schemes':     ['scheme','yojana','government','योजना','ਯੋਜਨਾ','పథకం','திட்டம்','ಯೋಜನೆ','പദ്ധതി','শেখান'],
  '/loans':       ['loan','karz','rin','ऋण','कर्ज','ਕਰਜ਼ਾ','రుణ','கடன்','ಸಾಲ','വായ്പ'],
  '/nearby':      ['nearby','hospital','bank','nearest','नजदीक','ਨੇੜੇ','అడుత','அருகில்','ಹತ್ತಿರ','അടുത്ത'],
  '/market':      ['mandi','market','map','मंडी','बाजार','ਮੰਡੀ','మండి','சந்தை','ಮಂಡಿ','മണ്ടി'],
  '/cooperative': ['cooperative','group','bulk','सहकारी','ਸਹਿਕਾਰੀ','సహకారం','கூட்டுறவு'],
  '/mandiguard':  ['mandiguard','cartel','manipulation','मंडी गार्ड'],
  '/profile':     ['profile','प्रोफाइल','ਪ੍ਰੋਫਾਈਲ','ప్రొఫైల్'],
}

export default function VoiceAssistant() {
  const { langCode } = useLang()
  const navigate     = useNavigate()
  const location     = useLocation()

  const [phase,      setPhase]      = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [reply,      setReply]      = useState('')
  const [replyLang,  setReplyLang]  = useState(langCode)
  const [minimized,  setMinimized]  = useState(false)
  const [error,      setError]      = useState('')
  const [waving,     setWaving]     = useState(false)
  const [hasSupport, setHasSupport] = useState(true)

  const recogRef   = useRef(null)
  const didGreet   = useRef(false)
  const mountedRef = useRef(true)
  const langRef    = useRef(langCode)

  useEffect(() => { langRef.current = langCode }, [langCode])

  // Check browser support once
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const hasTTS = !!window.speechSynthesis
    if (!SR || !hasTTS) setHasSupport(false)
  }, [])

  // Auto-greet on first mount
  useEffect(() => {
    if (!hasSupport) return
    if (didGreet.current) return
    didGreet.current = true
    const t = setTimeout(() => { if (mountedRef.current) startGreet(langCode) }, 1800)
    return () => clearTimeout(t)
  }, [hasSupport])

  // Re-greet when language changes (only after first greet)
  const prevLang = useRef(langCode)
  useEffect(() => {
    if (prevLang.current === langCode) return
    prevLang.current = langCode
    if (!didGreet.current || !hasSupport) return
    stopRecog()
    if (window.speechSynthesis) window.speechSynthesis.cancel()
    const t = setTimeout(() => { if (mountedRef.current) startGreet(langCode) }, 600)
    return () => clearTimeout(t)
  }, [langCode])

  useEffect(() => {
    return () => {
      mountedRef.current = false
      stopRecog()
      if (window.speechSynthesis) window.speechSynthesis.cancel()
    }
  }, [])

  function stopRecog() {
    if (recogRef.current) {
      try { recogRef.current.stop() } catch {}
      recogRef.current = null
    }
    setWaving(false)
  }

  async function startGreet(lc) {
    if (!mountedRef.current) return
    const text = GREETINGS[lc] || GREETINGS.en
    setPhase('greeting')
    setReply(text)
    setReplyLang(lc)
    setTranscript('')
    setError('')
    await speakText(text, lc)
    if (!mountedRef.current) return
    beginListen(lc)
  }

  function beginListen(lc) {
    if (!mountedRef.current) return
    stopRecog()
    setPhase('listening')
    setWaving(true)
    setError('')

    recogRef.current = listenOnce(
      lc,
      // onResult
      async (text, isFinal) => {
        if (!mountedRef.current) return
        setTranscript(text)
        if (isFinal && text.trim().length > 1) {
          stopRecog()
          await processQuery(text, lc)
        }
      },
      // onError
      (msg) => {
        if (!mountedRef.current) return
        stopRecog()
        if (msg) setError(msg)
        setPhase('idle')
        // Auto-retry after 4s unless it was a permission error
        if (msg && !msg.toLowerCase().includes('blocked') && !msg.toLowerCase().includes('denied')) {
          setTimeout(() => {
            if (mountedRef.current) beginListen(langRef.current)
          }, 4000)
        }
      },
      // onEnd
      (hadFinal) => {
        if (!mountedRef.current) return
        setWaving(false)
        if (!hadFinal) {
          // restart listening after short pause
          setTimeout(() => {
            if (mountedRef.current) beginListen(langRef.current)
          }, 1000)
        }
      }
    )
  }

  async function processQuery(text, lc) {
    if (!mountedRef.current) return
    setPhase('thinking')

    // Check for navigation intent first
    const lower = text.toLowerCase()
    for (const [route, keywords] of Object.entries(NAV_MAP)) {
      if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
        const msgs = {
          en:`Opening ${route.replace('/', '').replace(/-/g,' ')} for you.`,
          hi:`${route.replace('/', '')} खोल रहा हूँ।`,
          mr:`${route.replace('/', '')} उघडत आहे.`,
          pa:`${route.replace('/', '')} ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।`,
          ml:`${route.replace('/', '')} തുറക്കുന്നു.`,
          ta:`${route.replace('/', '')} திறக்கிறேன்.`,
          te:`${route.replace('/', '')} తెరుస్తున్నాను.`,
          kn:`${route.replace('/', '')} ತೆರೆಯುತ್ತಿದ್ದೇನೆ.`,
          gu:`${route.replace('/', '')} ખોલી રહ્યો છું.`,
          bn:`${route.replace('/', '')} খুলছি।`,
          ur:`${route.replace('/', '')} کھول رہا ہوں۔`,
        }
        const msg = msgs[lc] || msgs.en
        navigate(route)
        setReply(msg)
        setReplyLang(lc)
        setPhase('responding')
        await speakText(msg, lc)
        if (mountedRef.current) beginListen(langRef.current)
        return
      }
    }

    // AI answer
    const result = await answerQuery(text, lc)
    if (!mountedRef.current) return

    setReply(result.text)
    setReplyLang(result.lang)
    setPhase('responding')
    await speakText(result.text, result.lang)
    if (mountedRef.current) beginListen(langRef.current)
  }

  // Manual mic toggle
  function toggleMic() {
    if (phase === 'listening' && waving) {
      stopRecog()
      setPhase('idle')
      setWaving(false)
    } else {
      setError('')
      beginListen(langCode)
    }
  }

  // Quick command tap
  async function quickCmd(q) {
    stopRecog()
    setTranscript(q)
    await processQuery(q, langCode)
  }

  // Don't show on language chooser screen or if not supported
  if (!hasSupport) return null
  if (location.pathname === '/lang') return null

  // Status label per phase and language
  const STATUS = {
    idle:      { en:'Voice Assistant',  hi:'आवाज़ सहायक',   mr:'आवाज सहाय्यक',  pa:'ਆਵਾਜ਼ ਸਹਾਇਕ', ml:'ശബ്ദ സഹായി',    ta:'குரல் உதவியாளர்' },
    greeting:  { en:'Greeting…',        hi:'स्वागत…',        mr:'स्वागत…',        pa:'ਸੁਆਗਤ…',       ml:'സ്വാഗതം…',      ta:'வரவேற்கிறேன்…' },
    listening: { en:'🎤 Listening…',     hi:'🎤 सुन रहा हूँ…', mr:'🎤 ऐकतोय…',      pa:'🎤 ਸੁਣ ਰਿਹਾ ਹਾਂ…',ml:'🎤 കേൾക്കുന്നു…',ta:'🎤 கேட்கிறேன்…' },
    thinking:  { en:'🤔 Thinking…',      hi:'🤔 सोच रहा हूँ…',mr:'🤔 विचार करतो…', pa:'🤔 ਸੋਚ ਰਿਹਾ…',  ml:'🤔 ചിന്തിക്കുന്നു…',ta:'🤔 யோசிக்கிறேன்…'},
    responding:{ en:'🔊 Speaking…',      hi:'🔊 बोल रहा हूँ…', mr:'🔊 बोलत आहे…',  pa:'🔊 ਬੋਲ ਰਿਹਾ ਹਾਂ…',ml:'🔊 സംസാരിക്കുന്നു…',ta:'🔊 பேசுகிறேன்…'},
  }
  const statusText = (STATUS[phase] || STATUS.idle)[langCode] || (STATUS[phase] || STATUS.idle).en

  const QUICK = [
    { en:'Prices',  hi:'भाव',   mr:'भाव',  pa:'ਭਾਅ', ml:'വില',  ta:'விலை',te:'ధర',  kn:'ಬೆಲೆ',gu:'ભાવ',bn:'দাম',ur:'قیمت',  q:'price'   },
    { en:'Schemes', hi:'योजना', mr:'योजना',pa:'ਯੋਜਨਾ',ml:'പദ്ധതി',ta:'திட்டம்',te:'పథకం',kn:'ಯೋಜನೆ',gu:'યોજના',bn:'প্রকল্প',ur:'منصوبہ', q:'scheme'  },
    { en:'Loan',    hi:'ऋण',    mr:'कर्ज', pa:'ਕਰਜ਼ਾ',ml:'വായ്പ',ta:'கடன்',  te:'రుణం', kn:'ಸಾಲ', gu:'લોન', bn:'ঋণ',   ur:'قرض',    q:'loan'    },
    { en:'Disease', hi:'रोग',   mr:'रोग',  pa:'ਰੋਗ', ml:'രോഗം', ta:'நோய்',  te:'వ్యాధి',kn:'ರೋಗ',gu:'રોગ',bn:'রোগ',  ur:'بیماری', q:'disease' },
    { en:'Mandi',   hi:'मंडी',  mr:'मंडी', pa:'ਮੰਡੀ',ml:'മണ്ടി', ta:'மண்டி', te:'మండి', kn:'ಮಂಡಿ',gu:'મંડી',bn:'মান্ডি',ur:'منڈی',  q:'mandi'   },
    { en:'Profit',  hi:'लाभ',   mr:'नफा',  pa:'ਮੁਨਾਫਾ',ml:'ലാഭം',ta:'லாபம்',te:'లాభం',kn:'ಲಾಭ',gu:'નફો',bn:'লাভ',  ur:'منافع', q:'profit'  },
  ]

  const HINTS = {
    en:'💡 Say: "show prices" · "crop disease" · "govt scheme" · "nearby mandi"',
    hi:'💡 बोलें: "भाव बताओ" · "रोग पहचानो" · "योजना दिखाओ" · "मंडी कहाँ"',
    mr:'💡 बोला: "भाव सांगा" · "रोग ओळखा" · "योजना दाखवा"',
    pa:'💡 ਬੋਲੋ: "ਭਾਅ ਦੱਸੋ" · "ਰੋਗ ਦੱਸੋ" · "ਯੋਜਨਾ ਦਿਖਾਓ"',
    ml:'💡 പറയൂ: "വില പറ" · "രോഗം" · "പദ്ധതി" · "മണ്ടി"',
    ta:'💡 சொல்லுங்கள்: "விலை" · "நோய்" · "திட்டம்" · "மண்டி"',
    te:'💡 చెప్పండి: "ధర" · "వ్యాధి" · "పథకం" · "మండి"',
    kn:'💡 ಹೇಳಿ: "ಬೆಲೆ" · "ರೋಗ" · "ಯೋಜನೆ" · "ಮಂಡಿ"',
    gu:'💡 બોલો: "ભાવ" · "રોગ" · "યોજના" · "મંડી"',
    bn:'💡 বলুন: "দাম" · "রোগ" · "প্রকল্প" · "মান্ডি"',
    ur:'💡 کہیں: "قیمت" · "بیماری" · "منصوبہ" · "منڈی"',
  }
  const hint = HINTS[langCode] || HINTS.en

  const MIC_STOP  = {en:'Stop', hi:'रोकें',mr:'थांबा',pa:'ਰੋਕੋ',ml:'നിർ.',ta:'நிறு.',te:'ఆపు',kn:'ನಿಲ್ಲಿ',gu:'રોકો',bn:'থামুন',ur:'روکیں'}
  const MIC_SPEAK = {en:'Speak',hi:'बोलें',mr:'बोला',pa:'ਬੋਲੋ',ml:'സംസാ.',ta:'பேசுங்..',te:'మాట్లా.',kn:'ಮಾತಾ.',gu:'બોલો',bn:'বলুন',ur:'بولیں'}
  const micLabel = (phase==='listening'&&waving) ? (MIC_STOP[langCode]||'Stop') : (MIC_SPEAK[langCode]||'Speak')

  return (
    <div className={`${styles.va} ${minimized?styles.min:''} ${styles['s_'+phase]}`}>

      {/* Header */}
      <div className={styles.hd} onClick={() => minimized && setMinimized(false)}>
        <div className={`${styles.av} ${phase==='listening'?styles.avL:''} ${phase==='responding'?styles.avS:''}`}>
          🌾
        </div>
        {!minimized && (
          <div className={styles.hdTxt}>
            <div className={styles.hdName}>KrishiChain AI</div>
            <div className={styles.hdSt}>{statusText}</div>
          </div>
        )}
        <div className={styles.hdBtns}>
          {!minimized && (
            <button className={styles.hBtn} title="Repeat"
              onClick={e => { e.stopPropagation(); stopRecog(); if(window.speechSynthesis) window.speechSynthesis.cancel(); startGreet(langCode) }}>
              ↺
            </button>
          )}
          <button className={styles.hBtn} onClick={e => { e.stopPropagation(); setMinimized(p=>!p) }}>
            {minimized ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {!minimized && (
        <div className={styles.body}>

          {/* Wave visualizer */}
          <div className={styles.wRow}>
            {waving
              ? <div className={styles.wBars}>
                  {Array.from({length:14},(_,i) => (
                    <div key={i} className={styles.wBar}
                      style={{animationDelay:`${i*0.07}s`, animationDuration:`${0.45+((i*7)%5)*0.08}s`}}/>
                  ))}
                </div>
              : <div className={styles.flat}/>
            }
          </div>

          {/* Detected different language badge */}
          {replyLang && replyLang !== langCode && (
            <div className={styles.detLang}>
              🌐 Detected: {replyLang.toUpperCase()} · Responding in same language
            </div>
          )}

          {/* User transcript */}
          {transcript && (
            <div className={styles.uBubble}>
              <span className={styles.bLabel}>You:</span>
              <span className={styles.bText}>{transcript}</span>
            </div>
          )}

          {/* AI reply */}
          {reply && (
            <div className={styles.aiBubble}>
              <span className={styles.bLabel}>KrishiChain:</span>
              <span className={styles.bText}>{reply}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={styles.errBox}>
              ⚠️ {error}
              <button className={styles.retryBtn}
                onClick={() => { setError(''); beginListen(langCode) }}>
                {({hi:'फिर',mr:'पुन्हा',pa:'ਦੁਬਾਰਾ',ml:'വീണ്ടും',ta:'மீண்டும்',te:'మళ్ళీ',kn:'ಮತ್ತೆ',gu:'ફરી',bn:'আবার',ur:'دوبارہ'})[langCode] || 'Retry'}
              </button>
            </div>
          )}

          {/* Mic toggle button */}
          <button
            className={`${styles.micBtn} ${phase==='listening'&&waving ? styles.micOn : ''}`}
            onClick={toggleMic}
          >
            <span className={styles.micIco}>{phase==='listening'&&waving ? '⏹' : '🎤'}</span>
            <span className={styles.micLbl}>{micLabel}</span>
          </button>

          {/* Quick chips */}
          <div className={styles.chips}>
            {QUICK.map(c => (
              <button key={c.q} className={styles.chip} onClick={() => quickCmd(c.q)}>
                {c[langCode] || c.en}
              </button>
            ))}
          </div>

          <div className={styles.hint}>{hint}</div>
        </div>
      )}
    </div>
  )
}