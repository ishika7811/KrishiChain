import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { speakText, startListening, processVoiceQuery, LANG_TTS_MAP } from '../lib/voice'
import styles from './VoiceAssistant.module.css'

// ─── GREETINGS in all 22 Indian languages ──────────────────────────────────────
const GREETINGS = {
  en:  { text: "Namaste! I am KrishiChain, your AI farming assistant. You can ask me about crop prices, disease, government schemes, or loans. How can I help you today?",           short: "How can I help you?" },
  hi:  { text: "नमस्ते! मैं कृषिचेन हूँ, आपका AI किसान सहायक। आप मुझसे फसल के भाव, रोग, सरकारी योजनाएं, या ऋण के बारे में पूछ सकते हैं। आज मैं आपकी क्या मदद करूँ?",           short: "मैं आपकी क्या सेवा करूँ?" },
  mr:  { text: "नमस्कार! मी कृषिचेन आहे, तुमचा AI शेतकरी सहाय्यक। तुम्ही मला पीक भाव, रोग, सरकारी योजना किंवा कर्जाबद्दल विचारू शकता। आज मी तुमची कशी मदत करू?",             short: "मी तुमची कशी सेवा करू?" },
  pa:  { text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਕ੍ਰਿਸ਼ੀਚੇਨ ਹਾਂ, ਤੁਹਾਡਾ AI ਕਿਸਾਨ ਸਹਾਇਕ। ਤੁਸੀਂ ਮੈਨੂੰ ਫਸਲਾਂ ਦੇ ਭਾਅ, ਬਿਮਾਰੀ, ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਜਾਂ ਕਰਜ਼ੇ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰਾਂ?", short: "ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਸੇਵਾ ਕਰਾਂ?" },
  ml:  { text: "നമസ്കാരം! ഞാൻ കൃഷിചെയിൻ ആണ്, നിങ്ങളുടെ AI കർഷക സഹായി. വിള വില, രോഗം, സർക്കാർ പദ്ധതി, വായ്പ എന്നിവ ചോദിക്കാം. ഇന്ന് ഞാൻ എങ്ങനെ സഹായിക്കണം?",                  short: "ഞാൻ എങ്ങനെ സഹായിക്കണം?" },
  ta:  { text: "வணக்கம்! நான் கிருஷிசேன், உங்கள் AI விவசாய உதவியாளர். பயிர் விலை, நோய், அரசு திட்டங்கள் அல்லது கடன் பற்றி கேளுங்கள். இன்று நான் எப்படி உதவலாம்?",              short: "நான் எப்படி உதவலாம்?" },
  te:  { text: "నమస్కారం! నేను కృషిచెయిన్, మీ AI రైతు సహాయకుడు. పంట ధరలు, వ్యాధి, ప్రభుత్వ పథకాలు లేదా రుణాల గురించి అడగండి. ఈరోజు నేను ఏ విధంగా సహాయపడగలను?",              short: "నేను ఎలా సహాయపడగలను?" },
  kn:  { text: "ನಮಸ್ಕಾರ! ನಾನು ಕೃಷಿಚೇನ್, ನಿಮ್ಮ AI ರೈತ ಸಹಾಯಕ. ಬೆಳೆ ಬೆಲೆ, ರೋಗ, ಸರ್ಕಾರಿ ಯೋಜನೆ ಅಥವಾ ಸಾಲದ ಬಗ್ಗೆ ಕೇಳಿ. ಇಂದು ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",                            short: "ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" },
  gu:  { text: "નમસ્તે! હું કૃષિચેન છું, તમારો AI ખેડૂત સહાયક. પાક ભાવ, રોગ, સરકારી યોજના અથવા લોન વિશે પૂછો. આજે હું કેવી રીતે મદદ કરી શકું?",                                   short: "હું કેવી રીતે સેવા કરું?" },
  bn:  { text: "নমস্কার! আমি কৃষিচেন, আপনার AI কৃষক সহকারী। ফসলের দাম, রোগ, সরকারি প্রকল্প বা ঋণ সম্পর্কে জিজ্ঞাসা করুন। আজ আমি কীভাবে সাহায্য করতে পারি?",                   short: "আমি কীভাবে সাহায্য করব?" },
  or:  { text: "ନମସ୍କାର! ମୁଁ କୃଷିଚେନ, ଆପଣଙ୍କ AI କୃଷକ ସହାୟକ। ଫସଲ ମୂଲ୍ୟ, ରୋଗ, ସରକାରୀ ଯୋଜନା ବା ଋଣ ବିଷୟରେ ପ୍ରଶ୍ନ କରନ୍ତୁ। ଆଜି ମୁଁ କିପରି ସାହାଯ୍ୟ କରିବି?",                      short: "ମୁଁ କିପରି ସାହାଯ୍ୟ କରିବି?" },
  as:  { text: "নমস্কাৰ! মই কৃষিচেইন, আপোনাৰ AI কৃষক সহায়ক। শস্যৰ মূল্য, ৰোগ, চৰকাৰী আঁচনি বা ঋণৰ বিষয়ে সোধক। আজি মই কেনেকৈ সহায় কৰিব পাৰো?",                               short: "মই কেনেকৈ সহায় কৰিব?" },
  ur:  { text: "السلام علیکم! میں کرشی چین ہوں، آپ کا AI کسان مددگار۔ فصل کی قیمت، بیماری، سرکاری منصوبے یا قرض کے بارے میں پوچھیں۔ آج میں آپ کی کیا خدمت کر سکتا ہوں؟",       short: "میں آپ کی خدمت کیسے کروں؟" },
  mai: { text: "प्रणाम! हम कृषिचेन छी, अहाँक AI किसान सहायक। फसल भाव, रोग, सरकारी योजना या ऋण के बारे मे पुछि सकैत छी।",                                                             short: "हम अहाँक की सेवा करी?" },
  ne:  { text: "नमस्ते! म कृषिचेन हुँ, तपाईंको AI किसान सहायक। बाली मूल्य, रोग, सरकारी योजना वा ऋणको बारेमा सोध्नुस्।",                                                              short: "म कसरी सेवा गरूँ?" },
  kok: { text: "नमस्कार! हांव कृषिचेन, तुमचो AI शेतकार सहाय्यक। पीक भाव, रोग, सरकारी योजना किंवा कर्जाविशीं विचारात येता.",                                                          short: "हांव तुमची कशी सेवा करूं?" },
  doi: { text: "नमस्ते! मैं कृषिचेन आँ, तुहाडा AI किसान सहायक। फसल दे भाव, रोग, सरकारी योजनाएं दे बारे च पुच्छो।",                                                                   short: "मैं तुहाडी की सेवा करां?" },
  mni: { text: "নমস্কার! মরি কৃষিচেন, নখোয়গী AI চহি থৌদাং। পাম্বৈ লৌ মী, অসুক, সরকারী থবক অমদি খুদোংচাবগী মতাংদা হায়বিয়ু।",                                                        short: "মরি কদায়দা থৌদাং পীব?" },
  sat: { text: "जोहार! ञु कृषिचेन आकाना, आपनाक AI रिलो सहाय। पड़हा दाम, आसोय, सरकार कामी जाना रिन बाबते ते नेञ।",                                                                    short: "ञु लेका सहाय मेनाम?" },
  ks:  { text: "آداب! مۄ کرِشی چَین آسان، تُہُند AI زمیندار مددگار۔ فصل قیمت، بیماری، سرکاری منصوبہ یا قرض بارَس پُچھو۔",                                                             short: "مۄ کَیفیَت خِدمَت کَرہ؟" },
  sd:  { text: "نمستي! مان ڪرشي چين آهيان، توهان جو AI ڪسان مددگار۔ فصل جي قيمت، بيماري، سرڪاري اسڪيم يا قرض بابت پڇو۔",                                                              short: "مان ڪيئن خدمت ڪريان؟" },
  sa:  { text: "नमस्ते! अहं कृषिचेन अस्मि, भवतः AI कृषक सहायकः। फसल मूल्य, रोग, सर्कारयोजना, ऋणविषये पृच्छन्तु।",                                                                   short: "अहं कथं सेवां करोमि?" },
}

// Voice command → route navigation mapping
const VOICE_ROUTES = {
  en: { 'crop doctor': '/crop-doctor', 'disease': '/crop-doctor', 'forecast': '/forecast', 'price': '/forecast', 'cooperative': '/cooperative', 'loan': '/loans', 'scheme': '/schemes', 'government': '/schemes', 'nearby': '/nearby', 'carbon': '/carbon', 'profile': '/profile', 'mandi guard': '/mandiguard', 'cheating': '/tools', 'profit': '/tools', 'map': '/market' },
  hi: { 'फसल डॉक्टर': '/crop-doctor', 'रोग': '/crop-doctor', 'पूर्वानुमान': '/forecast', 'भाव': '/forecast', 'योजना': '/schemes', 'ऋण': '/loans', 'नजदीक': '/nearby', 'प्रोफाइल': '/profile', 'मंडी': '/market', 'धोखा': '/tools', 'लाभ': '/tools', 'सहकारी': '/cooperative' },
  mr: { 'पीक डॉक्टर': '/crop-doctor', 'रोग': '/crop-doctor', 'भाव': '/forecast', 'योजना': '/schemes', 'कर्ज': '/loans', 'जवळ': '/nearby', 'प्रोफाइल': '/profile', 'मंडी': '/market', 'फसवणूक': '/tools', 'नफा': '/tools' },
  pa: { 'ਫਸਲ ਡਾਕਟਰ': '/crop-doctor', 'ਰੋਗ': '/crop-doctor', 'ਭਾਅ': '/forecast', 'ਯੋਜਨਾ': '/schemes', 'ਕਰਜ਼ਾ': '/loans', 'ਨੇੜੇ': '/nearby', 'ਧੋਖਾ': '/tools', 'ਮੁਨਾਫਾ': '/tools' },
  ml: { 'വ്യാധി': '/crop-doctor', 'വില': '/forecast', 'പദ്ധതി': '/schemes', 'വായ്പ': '/loans', 'അടുത്ത': '/nearby', 'ലാഭം': '/tools' },
  ta: { 'நோய்': '/crop-doctor', 'விலை': '/forecast', 'திட்டம்': '/schemes', 'கடன்': '/loans', 'அருகில்': '/nearby', 'லாபம்': '/tools' },
}

export default function VoiceAssistant() {
  const { langCode, t } = useLang()
  const navigate = useNavigate()
  const location = useLocation()

  const [state, setState] = useState('idle') // idle | greeting | listening | thinking | speaking
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [waveActive, setWaveActive] = useState(false)
  const [error, setError] = useState('')
  const [voiceSupported, setVoiceSupported] = useState(true)
  const recognitionRef = useRef(null)
  const greetingDoneRef = useRef(false)

  const greeting = GREETINGS[langCode] || GREETINGS.en
  const ttsApiKey = import.meta.env.VITE_TTS_API_KEY || null

  // ── Auto-greet on page load ────────────────────────────────────────────────
  useEffect(() => {
    const supported = 'speechSynthesis' in window
    setVoiceSupported(supported)

    if (!supported) return
    if (greetingDoneRef.current) return
    greetingDoneRef.current = true

    // Small delay to let page render first
    const timer = setTimeout(async () => {
      setState('greeting')
      setResponse(greeting.text)
      try {
        await speakText(greeting.text, langCode, ttsApiKey)
      } catch (e) { /* silent */ }
      setState('listening')
      setHasGreeted(true)
      startAutoListen()
    }, 1500)

    return () => clearTimeout(timer)
  }, []) // Only run once on mount

  // ── Auto re-greet when language changes ───────────────────────────────────
  useEffect(() => {
    if (!hasGreeted) return
    greetingDoneRef.current = false
    stopListening()
    setTimeout(async () => {
      setState('greeting')
      const g = GREETINGS[langCode] || GREETINGS.en
      setResponse(g.text)
      try { await speakText(g.text, langCode, ttsApiKey) } catch(e){}
      setState('listening')
      startAutoListen()
    }, 500)
  }, [langCode])

  function stopListening() {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch(e){}
      recognitionRef.current = null
    }
    setWaveActive(false)
  }

  function startAutoListen() {
    stopListening()
    setWaveActive(true)
    setTranscript('')
    setError('')

    recognitionRef.current = startListening(
      langCode,
      async (text, isFinal) => {
        setTranscript(text)
        if (isFinal && text.trim()) {
          stopListening()
          await handleQuery(text)
        }
      },
      (err) => {
        setError(err)
        setWaveActive(false)
        setState('idle')
        // Auto retry after error (except permission denied)
        if (!err.includes('permission') && !err.includes('denied')) {
          setTimeout(() => { setState('listening'); startAutoListen() }, 3000)
        }
      },
      () => {
        setWaveActive(false)
        // Auto restart listening after 1s
        setTimeout(() => {
          if (state !== 'thinking' && state !== 'speaking') {
            setState('listening')
            startAutoListen()
          }
        }, 1000)
      }
    )
  }

  async function handleQuery(text) {
    setState('thinking')
    setWaveActive(false)

    // Check for navigation commands
    const routes = VOICE_ROUTES[langCode] || VOICE_ROUTES.en
    let navigated = false
    const lowerText = text.toLowerCase()

    for (const [keyword, route] of Object.entries(routes)) {
      if (lowerText.includes(keyword.toLowerCase())) {
        navigate(route)
        navigated = true
        const navMsg = {
          en: `Opening ${route.replace('/', '').replace('-', ' ')} for you.`,
          hi: `${route.replace('/', '').replace('-', ' ')} खोल रहा हूँ।`,
          mr: `${route.replace('/', '').replace('-', ' ')} उघडत आहे।`,
          pa: `${route.replace('/', '').replace('-', ' ')} ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।`,
          ml: `${route.replace('/', '').replace('-', ' ')} തുറക്കുന്നു.`,
          ta: `${route.replace('/', '').replace('-', ' ')} திறக்கிறேன்.`,
        }
        const msg = navMsg[langCode] || navMsg.en
        setResponse(msg)
        setState('speaking')
        try { await speakText(msg, langCode, ttsApiKey) } catch(e){}
        setState('listening')
        startAutoListen()
        return
      }
    }

    // Process as AI query
    const answer = await processVoiceQuery(text, langCode)
    setResponse(answer)
    setState('speaking')
    try { await speakText(answer, langCode, ttsApiKey) } catch(e){}
    setState('listening')
    startAutoListen()
  }

  function handleManualMic() {
    if (state === 'listening' && waveActive) {
      stopListening()
      setState('idle')
    } else {
      setState('listening')
      startAutoListen()
    }
  }

  async function repeatGreeting() {
    stopListening()
    setState('speaking')
    const g = GREETINGS[langCode] || GREETINGS.en
    setResponse(g.text)
    try { await speakText(g.text, langCode, ttsApiKey) } catch(e){}
    setState('listening')
    startAutoListen()
  }

  // Don't show on language chooser screen
  if (location.pathname === '/lang') return null

  const stateLabel = {
    idle:     t.voiceAssistant || 'Voice Assistant',
    greeting: langCode==='hi' ? 'स्वागत कर रहा हूँ…' : langCode==='mr' ? 'स्वागत करत आहे…' : langCode==='pa' ? 'ਸੁਆਗਤ ਕਰ ਰਿਹਾ ਹਾਂ…' : langCode==='ml' ? 'സ്വാഗതം…' : langCode==='ta' ? 'வரவேற்கிறேன்…' : 'Greeting…',
    listening:langCode==='hi' ? '🎤 सुन रहा हूँ…' : langCode==='mr' ? '🎤 ऐकतोय…' : langCode==='pa' ? '🎤 ਸੁਣ ਰਿਹਾ ਹਾਂ…' : langCode==='ml' ? '🎤 കേൾക്കുന്നു…' : langCode==='ta' ? '🎤 கேட்கிறேன்…' : '🎤 Listening…',
    thinking: langCode==='hi' ? '🤔 सोच रहा हूँ…' : langCode==='mr' ? '🤔 विचार करतोय…' : langCode==='pa' ? '🤔 ਸੋਚ ਰਿਹਾ ਹਾਂ…' : langCode==='ml' ? '🤔 ചിന്തിക്കുന്നു…' : langCode==='ta' ? '🤔 யோசிக்கிறேன்…' : '🤔 Thinking…',
    speaking: langCode==='hi' ? '🔊 बोल रहा हूँ…' : langCode==='mr' ? '🔊 बोलत आहे…' : langCode==='pa' ? '🔊 ਬੋਲ ਰਿਹਾ ਹਾਂ…' : langCode==='ml' ? '🔊 സംസാരിക്കുന്നു…' : langCode==='ta' ? '🔊 பேசுகிறேன்…' : '🔊 Speaking…',
  }

  if (!voiceSupported) return null

  return (
    <div className={`${styles.assistant} ${isMinimized ? styles.minimized : ''} ${styles[state]}`}>
      {/* Header */}
      <div className={styles.header} onClick={() => isMinimized && setIsMinimized(false)}>
        <div className={styles.avatar}>
          <div className={`${styles.avatarInner} ${state==='listening'?styles.avatarPulse:''} ${state==='speaking'?styles.avatarSpeak:''}`}>
            🌾
          </div>
          {state === 'listening' && <div className={styles.listenRing}/>}
        </div>
        <div className={styles.headerText}>
          <div className={styles.name}>KrishiChain {t.voiceAssistant||'Assistant'}</div>
          <div className={styles.status}>{stateLabel[state]}</div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={e => { e.stopPropagation(); repeatGreeting() }} title="Repeat greeting">↺</button>
          <button className={styles.iconBtn} onClick={e => { e.stopPropagation(); setIsMinimized(p => !p) }} title={isMinimized ? 'Expand' : 'Minimize'}>
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Wave visualizer */}
          <div className={styles.waveBox}>
            {waveActive
              ? <div className={styles.wave}>{[...Array(12)].map((_,i) => <div key={i} className={styles.bar} style={{animationDelay:`${i*0.08}s`}}/>)}</div>
              : <div className={styles.waveFlatLine}/>
            }
          </div>

          {/* Transcript */}
          {transcript && (
            <div className={styles.transcript}>
              <span className={styles.transcriptLabel}>You: </span>
              <span className={styles.transcriptText}>{transcript}</span>
            </div>
          )}

          {/* Response */}
          {response && (
            <div className={styles.response}>
              <div className={styles.responseText}>{response}</div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={styles.errorBox}>
              ⚠️ {error}
              <button className={styles.retryBtn} onClick={() => { setError(''); setState('listening'); startAutoListen() }}>
                {langCode==='hi'?'दोबारा कोशिश':'Retry'}
              </button>
            </div>
          )}

          {/* Controls */}
          <div className={styles.controls}>
            <button
              className={`${styles.micBtn} ${state==='listening'&&waveActive ? styles.micActive : ''}`}
              onClick={handleManualMic}
            >
              <span className={styles.micIcon}>{state==='listening'&&waveActive ? '⏹' : '🎤'}</span>
              <span className={styles.micLabel}>
                {state==='listening'&&waveActive
                  ? (langCode==='hi'?'रोकें':langCode==='mr'?'थांबा':langCode==='pa'?'ਰੋਕੋ':langCode==='ml'?'നിർത്തൂ':langCode==='ta'?'நிறுத்து':'Stop')
                  : (langCode==='hi'?'बोलें':langCode==='mr'?'बोला':langCode==='pa'?'ਬੋਲੋ':langCode==='ml'?'സംസാരിക്കൂ':langCode==='ta'?'பேசுங்கள்':'Speak')
                }
              </span>
            </button>

            {/* Quick commands */}
            <div className={styles.quickCmds}>
              {[
                { label: langCode==='hi'?'भाव':langCode==='mr'?'भाव':langCode==='pa'?'ਭਾਅ':langCode==='ml'?'വില':langCode==='ta'?'விலை':'Prices', query: langCode==='hi'?'फसल का भाव बताओ':langCode==='mr'?'पीक भाव सांगा':langCode==='pa'?'ਫਸਲ ਦਾ ਭਾਅ ਦੱਸੋ':langCode==='ml'?'വിള വില':langCode==='ta'?'பயிர் விலை':'crop price' },
                { label: langCode==='hi'?'योजना':langCode==='mr'?'योजना':langCode==='pa'?'ਯੋਜਨਾ':langCode==='ml'?'പദ്ധതി':langCode==='ta'?'திட்டம்':'Schemes', query: langCode==='hi'?'सरकारी योजना':langCode==='mr'?'सरकारी योजना':langCode==='pa'?'ਸਰਕਾਰੀ ਯੋਜਨਾ':langCode==='ml'?'സർക്കാർ പദ്ധതി':langCode==='ta'?'அரசு திட்டம்':'government scheme' },
                { label: langCode==='hi'?'ऋण':langCode==='mr'?'कर्ज':langCode==='pa'?'ਕਰਜ਼ਾ':langCode==='ml'?'വായ്പ':langCode==='ta'?'கடன்':'Loan', query: langCode==='hi'?'सस्ता ऋण चाहिए':langCode==='mr'?'स्वस्त कर्ज हवे':langCode==='pa'?'ਸਸਤਾ ਕਰਜ਼ਾ':langCode==='ml'?'വായ്പ':langCode==='ta'?'கடன்':'cheap loan' },
                { label: langCode==='hi'?'रोग':langCode==='mr'?'रोग':langCode==='pa'?'ਰੋਗ':langCode==='ml'?'രോഗം':langCode==='ta'?'நோய்':'Disease', query: 'disease' },
              ].map((cmd, i) => (
                <button key={i} className={styles.quickBtn} onClick={() => handleQuery(cmd.query)}>
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.hint}>
            {langCode==='hi' ? '💡 बोलें: "भाव बताओ" या "योजना दिखाओ" या "मंडी दिखाओ"'
             : langCode==='mr' ? '💡 बोला: "भाव सांगा" किंवा "योजना दाखवा"'
             : langCode==='pa' ? '💡 ਬੋਲੋ: "ਭਾਅ ਦੱਸੋ" ਜਾਂ "ਯੋਜਨਾ ਦਿਖਾਓ"'
             : langCode==='ml' ? '💡 പറയൂ: "വില പറ" അല്ലെങ്കിൽ "പദ്ധതി കാണിക്കൂ"'
             : langCode==='ta' ? '💡 சொல்லுங்கள்: "விலை சொல்" அல்லது "திட்டம் காட்டு"'
             : '💡 Say: "show prices" or "government scheme" or "nearby mandi"'}
          </div>
        </>
      )}
    </div>
  )
}
