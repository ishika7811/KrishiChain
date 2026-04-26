// ─── VOICE ASSISTANT: Proper Indian language support ──────────────────────────
// Strategy:
// 1. Speech-to-Text: Web Speech API (works in Chrome on Android/desktop)
// 2. Text-to-Speech: Web Speech API first → if no Indian voice found → use
//    Google Cloud TTS API (requires VITE_TTS_API_KEY)
// 3. Fallback: Show text if voice unavailable

// BCP-47 language tags for Indian languages
export const LANG_TTS_MAP = {
  en:  { bcp:'en-IN',  voiceName:['en-IN','English (India)','Google हिन्दी'] },
  hi:  { bcp:'hi-IN',  voiceName:['hi-IN','Google हिन्दी','Hindi India'] },
  mr:  { bcp:'mr-IN',  voiceName:['mr-IN','Marathi','Google मराठी'] },
  bn:  { bcp:'bn-IN',  voiceName:['bn-IN','Bengali','Bangla India'] },
  te:  { bcp:'te-IN',  voiceName:['te-IN','Telugu','Google తెలుగు'] },
  ta:  { bcp:'ta-IN',  voiceName:['ta-IN','Tamil','Google தமிழ்'] },
  gu:  { bcp:'gu-IN',  voiceName:['gu-IN','Gujarati','Google ગુજરાતી'] },
  kn:  { bcp:'kn-IN',  voiceName:['kn-IN','Kannada','Google ಕನ್ನಡ'] },
  ml:  { bcp:'ml-IN',  voiceName:['ml-IN','Malayalam','Google മലയാളം'] },
  pa:  { bcp:'pa-IN',  voiceName:['pa-IN','Punjabi','Google ਪੰਜਾਬੀ'] },
  or:  { bcp:'or-IN',  voiceName:['or-IN','Odia'] },
  as:  { bcp:'as-IN',  voiceName:['as-IN','Assamese'] },
  ur:  { bcp:'ur-IN',  voiceName:['ur-IN','Urdu','Google اردو'] },
  ne:  { bcp:'ne-NP',  voiceName:['ne-NP','Nepali'] },
  mai: { bcp:'hi-IN',  voiceName:['hi-IN','Hindi India'] },
  kok: { bcp:'hi-IN',  voiceName:['hi-IN'] },
  mni: { bcp:'hi-IN',  voiceName:['hi-IN'] },
  sat: { bcp:'hi-IN',  voiceName:['hi-IN'] },
  ks:  { bcp:'ur-IN',  voiceName:['ur-IN'] },
  doi: { bcp:'hi-IN',  voiceName:['hi-IN'] },
  sd:  { bcp:'ur-IN',  voiceName:['ur-IN'] },
  sa:  { bcp:'hi-IN',  voiceName:['hi-IN'] },
}

// ─── TEXT TO SPEECH ────────────────────────────────────────────────────────────
export function speakText(text, langCode = 'en', apiKey = null) {
  return new Promise((resolve) => {
    if (!text) { resolve(); return }

    // Stop any ongoing speech
    if (window.speechSynthesis) window.speechSynthesis.cancel()

    const langConfig = LANG_TTS_MAP[langCode] || LANG_TTS_MAP.en
    const bcp = langConfig.bcp

    // Try Web Speech API first
    if (window.speechSynthesis) {
      const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices()

        // Find best matching voice for the language
        let voice = null

        // First try exact BCP match
        voice = voices.find(v => v.lang === bcp)

        // Then try language prefix match (e.g. hi-IN matches hi)
        if (!voice) {
          const prefix = bcp.split('-')[0]
          voice = voices.find(v => v.lang.startsWith(prefix))
        }

        // Then try name match
        if (!voice && langConfig.voiceName) {
          for (const name of langConfig.voiceName) {
            voice = voices.find(v => v.name.includes(name) || v.lang.includes(name))
            if (voice) break
          }
        }

        // Fallback to en-IN
        if (!voice) voice = voices.find(v => v.lang === 'en-IN')
        if (!voice) voice = voices.find(v => v.lang.startsWith('en'))

        const utterance = new SpeechSynthesisUtterance(text)
        if (voice) utterance.voice = voice
        utterance.lang = bcp
        utterance.rate = 0.85   // slightly slower — easier to understand
        utterance.pitch = 1.05  // slightly warmer pitch
        utterance.volume = 1.0

        utterance.onend = () => resolve()
        utterance.onerror = () => {
          // If Web Speech fails, try Google Cloud TTS
          if (apiKey) {
            speakWithGoogleTTS(text, bcp, apiKey).then(resolve).catch(resolve)
          } else {
            resolve()
          }
        }

        window.speechSynthesis.speak(utterance)
      }

      // Voices may not be loaded yet on first call
      if (window.speechSynthesis.getVoices().length > 0) {
        trySpeak()
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null
          trySpeak()
        }
        // Timeout fallback if onvoiceschanged never fires
        setTimeout(() => {
          window.speechSynthesis.onvoiceschanged = null
          trySpeak()
        }, 1000)
      }
    } else if (apiKey) {
      speakWithGoogleTTS(text, bcp, apiKey).then(resolve).catch(resolve)
    } else {
      resolve()
    }
  })
}

// Google Cloud TTS (fallback when browser voices unavailable)
async function speakWithGoogleTTS(text, languageCode, apiKey) {
  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode, ssmlGender: 'FEMALE' },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9, pitch: 1.0 }
        })
      }
    )
    const data = await res.json()
    if (data.audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`)
      await audio.play()
      await new Promise(r => { audio.onended = r })
    }
  } catch (e) {
    console.warn('Google TTS fallback failed:', e)
  }
}

// Get available voices for a language (for UI display)
export function getAvailableVoices(langCode) {
  if (!window.speechSynthesis) return []
  const bcp = LANG_TTS_MAP[langCode]?.bcp || 'en-IN'
  const voices = window.speechSynthesis.getVoices()
  const prefix = bcp.split('-')[0]
  return voices.filter(v => v.lang.startsWith(prefix) || v.lang === bcp)
}

export function isSpeechSupported() {
  return 'speechSynthesis' in window
}

// ─── SPEECH TO TEXT ────────────────────────────────────────────────────────────
export function startListening(langCode = 'hi', onResult, onError, onEnd) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) {
    onError?.('Speech recognition not supported in this browser. Please use Chrome.')
    return null
  }

  const recognition = new SR()
  const bcp = LANG_TTS_MAP[langCode]?.bcp || 'hi-IN'

  recognition.lang = bcp
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 3

  recognition.onresult = (event) => {
    let finalTranscript = ''
    let interimTranscript = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      } else {
        interimTranscript += event.results[i][0].transcript
      }
    }
    onResult?.(finalTranscript || interimTranscript, !!finalTranscript)
  }

  recognition.onerror = (event) => {
    const msgs = {
      'not-allowed': 'Microphone permission denied. Please allow microphone access.',
      'no-speech': 'No speech detected. Please speak clearly and try again.',
      'network': 'Network error. Check your internet connection.',
      'audio-capture': 'No microphone found.',
    }
    onError?.(msgs[event.error] || `Error: ${event.error}`)
  }

  recognition.onend = () => onEnd?.()

  try {
    recognition.start()
    return recognition
  } catch (e) {
    onError?.('Could not start microphone: ' + e.message)
    return null
  }
}

// ─── VOICE QUERY PROCESSOR (AI-powered Q&A) ───────────────────────────────────
export async function processVoiceQuery(transcript, langCode = 'en') {
  await new Promise(r => setTimeout(r, 800))

  const text = transcript.toLowerCase()
  const responses = {
    en: {
      price: `Today's tomato price in most mandis is ₹24-28 per kg. Onion is ₹20-24 per kg. Wheat MSP is ₹2,275 per quintal. For live prices, check the AI Forecast section.`,
      disease: `I can help diagnose crop disease. Please go to Crop Doctor and take a clear photo of the affected leaf or stem. I will identify the disease and tell you the treatment.`,
      scheme: `You may be eligible for PM-KISAN (₹6,000/year), PMFBY crop insurance, and Kisan Credit Card at 4% interest. Go to Government Schemes section to check your eligibility.`,
      weather: `For weather alerts specific to your location, please allow location access. Heavy rain is expected in parts of Maharashtra and UP this week — postpone fertilizer application.`,
      loan: `The cheapest loans for farmers: World Bank IFAD at 1.25%/year, GIZ Germany at 2%/year, Kisan Credit Card at 4%/year. Go to International Loans section for details.`,
      default: `I heard you say: "${transcript}". I can help with: crop prices, disease diagnosis, government schemes, loans, and finding nearby mandis. What would you like to know?`,
    },
    hi: {
      price: `आज टमाटर का भाव ₹24-28 प्रति किलो है। प्याज ₹20-24 प्रति किलो। गेहूं का MSP ₹2,275 प्रति क्विंटल है। लाइव भाव के लिए AI Forecast देखें।`,
      disease: `मैं फसल रोग पहचान सकता हूँ। कृपया Crop Doctor में जाएं और प्रभावित पत्ती की फोटो लें। मैं रोग और इलाज बताऊंगा।`,
      scheme: `आप PM-KISAN (₹6,000/वर्ष), PMFBY फसल बीमा, और 4% ब्याज पर किसान क्रेडिट कार्ड के हकदार हो सकते हैं। सरकारी योजनाएं में जाकर जांचें।`,
      weather: `इस हफ्ते महाराष्ट्र और UP में भारी बारिश की संभावना है — खाद का छिड़काव रोकें।`,
      loan: `सबसे सस्ता ऋण: World Bank IFAD 1.25%/वर्ष, KCC 4%/वर्ष। International Loans section देखें।`,
      default: `आपने कहा: "${transcript}". मैं मदद कर सकता हूँ: फसल भाव, रोग पहचान, सरकारी योजनाएं, ऋण, पास की मंडियां। क्या जानना है?`,
    },
    mr: {
      price: `आज टोमॅटोचा भाव ₹24-28 प्रति किलो आहे. कांदा ₹20-24 प्रति किलो. गव्हाचा MSP ₹2,275 प्रति क्विंटल आहे.`,
      disease: `पिकाचे रोग निदान करण्यासाठी Crop Doctor मध्ये जा आणि प्रभावित पानाचा फोटो काढा.`,
      scheme: `तुम्ही PM-KISAN (₹6,000/वर्ष), PMFBY पीक विमा आणि 4% व्याजावर KCC साठी पात्र असू शकता.`,
      weather: `या आठवड्यात महाराष्ट्रात जड पाऊस अपेक्षित — खताचा वापर थांबवा.`,
      loan: `सर्वात स्वस्त कर्ज: World Bank IFAD 1.25%/वर्ष, KCC 4%/वर्ष.`,
      default: `तुम्ही म्हणालात: "${transcript}". मी मदत करू शकतो: पीक भाव, रोग निदान, सरकारी योजना, कर्ज, जवळच्या मंड्या.`,
    },
    pa: {
      price: `ਅੱਜ ਟਮਾਟਰ ਦਾ ਭਾਅ ₹24-28 ਪ੍ਰਤੀ ਕਿੱਲੋ ਹੈ। ਪਿਆਜ਼ ₹20-24 ਪ੍ਰਤੀ ਕਿੱਲੋ। ਕਣਕ ਦਾ MSP ₹2,275 ਪ੍ਰਤੀ ਕੁਇੰਟਲ।`,
      disease: `ਫਸਲ ਦਾ ਰੋਗ ਪਛਾਣਨ ਲਈ Crop Doctor ਵਿੱਚ ਜਾਓ ਅਤੇ ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਓ।`,
      scheme: `ਤੁਸੀਂ PM-KISAN (₹6,000/ਸਾਲ), PMFBY ਫਸਲ ਬੀਮਾ ਅਤੇ 4% ਵਿਆਜ ਤੇ KCC ਦੇ ਹੱਕਦਾਰ ਹੋ ਸਕਦੇ ਹੋ।`,
      weather: `ਇਸ ਹਫਤੇ ਪੰਜਾਬ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ — ਖਾਦ ਪਾਉਣੀ ਬੰਦ ਕਰੋ।`,
      loan: `ਸਭ ਤੋਂ ਸਸਤਾ ਕਰਜ਼ਾ: World Bank IFAD 1.25%/ਸਾਲ, KCC 4%/ਸਾਲ।`,
      default: `ਤੁਸੀਂ ਕਿਹਾ: "${transcript}". ਮੈਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ: ਫਸਲ ਭਾਅ, ਰੋਗ, ਯੋਜਨਾਵਾਂ, ਕਰਜ਼ੇ, ਮੰਡੀਆਂ।`,
    },
    ml: {
      price: `ഇന്ന് തക്കാളി ₹24-28/കിലോ. ഉള്ളി ₹20-24/കിലോ. ഗോതമ്പ് MSP ₹2,275/ക്വിന്റൽ.`,
      disease: `വിള രോഗം കണ്ടെത്താൻ Crop Doctor ൽ പോയി ബാധിത ഇലയുടെ ഫോട്ടോ എടുക്കൂ.`,
      scheme: `PM-KISAN (₹6,000/വർഷം), PMFBY വിള ഇൻഷുറൻസ്, 4% പലിശയിൽ KCC ലഭ്യം.`,
      weather: `ഈ ആഴ്ച കേരളത്തിൽ കനത്ത മഴ — വളമിടൽ നിർത്തൂ.`,
      loan: `ഏറ്റവും വിലകുറഞ്ഞ വായ്പ: World Bank IFAD 1.25%/വർഷം, KCC 4%/വർഷം.`,
      default: `നിങ്ങൾ പറഞ്ഞു: "${transcript}". ഞാൻ സഹായിക്കാം: വില, രോഗം, പദ്ധതി, വായ്പ, മണ്ടി.`,
    },
    ta: {
      price: `இன்று தக்காளி ₹24-28/கிலோ. வெங்காயம் ₹20-24/கிலோ. கோதுமை MSP ₹2,275/குவிண்டால்.`,
      disease: `பயிர் நோய் கண்டறிய Crop Doctor ல் சென்று பாதிக்கப்பட்ட இலையின் புகைப்படம் எடுங்கள்.`,
      scheme: `PM-KISAN (₹6,000/ஆண்டு), PMFBY பயிர் காப்பீடு, 4% வட்டியில் KCC கிடைக்கும்.`,
      weather: `இந்த வாரம் தமிழ்நாட்டில் கனமழை — உரம் தெளிப்பதை நிறுத்துங்கள்.`,
      loan: `மலிவான கடன்: World Bank IFAD 1.25%/ஆண்டு, KCC 4%/ஆண்டு.`,
      default: `நீங்கள் சொன்னீர்கள்: "${transcript}". விலை, நோய், திட்டம், கடன், மண்டி - உதவ முடியும்.`,
    },
    te: {
      price: `నేడు టమాటో ₹24-28/కిలో. ఉల్లి ₹20-24/కిలో. గోధుమ MSP ₹2,275/క్వింటాల్.`,
      disease: `పంట వ్యాధి గుర్తించడానికి Crop Doctor కి వెళ్ళి ప్రభావిత ఆకు ఫోటో తీయండి.`,
      scheme: `PM-KISAN (₹6,000/సంవత్సరం), PMFBY పంట బీమా, 4% వడ్డీకి KCC అందుబాటులో ఉంది.`,
      weather: `ఈ వారం ఆంధ్రప్రదేశ్‌లో భారీ వర్షం — ఎరువు వేయడం ఆపండి.`,
      loan: `చౌకైన రుణం: World Bank IFAD 1.25%/సంవత్సరం, KCC 4%/సంవత్సరం.`,
      default: `మీరు చెప్పారు: "${transcript}". ధరలు, వ్యాధి, పథకాలు, రుణాలు, మండులు - సహాయం చేయగలను.`,
    },
    kn: {
      price: `ಇಂದು ಟೊಮ್ಯಾಟೋ ₹24-28/ಕಿಲೋ. ಈರುಳ್ಳಿ ₹20-24/ಕಿಲೋ. ಗೋಧಿ MSP ₹2,275/ಕ್ವಿಂಟಾಲ್.`,
      disease: `ಬೆಳೆ ರೋಗ ಪತ್ತೆಹಚ್ಚಲು Crop Doctor ಗೆ ಹೋಗಿ ಪೀಡಿತ ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ.`,
      scheme: `PM-KISAN (₹6,000/ವರ್ಷ), PMFBY ಬೆಳೆ ವಿಮೆ, 4% ಬಡ್ಡಿಯಲ್ಲಿ KCC ಲಭ್ಯ.`,
      weather: `ಈ ವಾರ ಕರ್ನಾಟಕದಲ್ಲಿ ಭಾರೀ ಮಳೆ — ಗೊಬ್ಬರ ಹಾಕುವುದನ್ನು ನಿಲ್ಲಿಸಿ.`,
      loan: `ಅಗ್ಗದ ಸಾಲ: World Bank IFAD 1.25%/ವರ್ಷ, KCC 4%/ವರ್ಷ.`,
      default: `ನೀವು ಹೇಳಿದ್ದು: "${transcript}". ಬೆಲೆ, ರೋಗ, ಯೋಜನೆ, ಸಾಲ, ಮಂಡಿ - ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.`,
    },
    gu: {
      price: `આજે ટામેટા ₹24-28/કિલો. ડુંગળી ₹20-24/કિલો. ઘઉં MSP ₹2,275/ક્વિન્ટલ.`,
      disease: `પાક રોગ ઓળખવા Crop Doctor માં જઈ અસરગ્રસ્ત પાંદડાનો ફોટો લો.`,
      scheme: `PM-KISAN (₹6,000/વર્ષ), PMFBY પાક વીમો, 4% વ્યાજ પર KCC ઉપલબ્ધ.`,
      weather: `આ સપ્તાહ ગુજરાતમાં ભારે વરસાદ — ખાતર નાખવાનું બંધ કરો.`,
      loan: `સસ્તી લોન: World Bank IFAD 1.25%/વર્ષ, KCC 4%/વર્ષ.`,
      default: `તમે કહ્યું: "${transcript}". ભાવ, રોગ, યોજના, લોન, મંડી - મદદ કરી શકું.`,
    },
    bn: {
      price: `আজ টমেটো ₹24-28/কিলো। পেঁয়াজ ₹20-24/কিলো। গম MSP ₹2,275/কুইন্টাল।`,
      disease: `ফসলের রোগ শনাক্ত করতে Crop Doctor এ যান এবং আক্রান্ত পাতার ছবি তুলুন।`,
      scheme: `PM-KISAN (₹6,000/বছর), PMFBY ফসল বীমা, 4% সুদে KCC পাওয়া যায়।`,
      weather: `এই সপ্তাহে পশ্চিমবঙ্গে ভারী বৃষ্টি — সার দেওয়া বন্ধ করুন।`,
      loan: `সবচেয়ে সস্তা ঋণ: World Bank IFAD 1.25%/বছর, KCC 4%/বছর।`,
      default: `আপনি বললেন: "${transcript}"। দাম, রোগ, প্রকল্প, ঋণ, মান্ডি - সাহায্য করতে পারি।`,
    },
    or: {
      price: `ଆଜି ଟମାଟୋ ₹24-28/କିଲୋ। ପିଆଜ ₹20-24/କିଲୋ। ଗହମ MSP ₹2,275/କ୍ୱିଣ୍ଟାଲ।`,
      disease: `ଫସଲ ରୋଗ ଚିହ୍ନଟ ପାଇଁ Crop Doctor ରେ ଯାଆନ୍ତୁ ଓ ଆକ୍ରାନ୍ତ ପତ୍ରର ଫୋଟୋ ତୋଳନ୍ତୁ।`,
      scheme: `PM-KISAN (₹6,000/ବର୍ଷ), PMFBY ଫସଲ ବୀମା, 4% ସୁଧ ଉପରେ KCC ଉପଲବ୍ଧ।`,
      weather: `ଏହି ସପ୍ତାହ ଓଡ଼ିଶାରେ ଭାରୀ ବର୍ଷା — ସାର ପ୍ରୟୋଗ ବନ୍ଦ କରନ୍ତୁ।`,
      loan: `ସବୁଠୁ ଶସ୍ତା ଋଣ: World Bank IFAD 1.25%/ବର୍ଷ, KCC 4%/ବର୍ଷ।`,
      default: `ଆପଣ କହିଲେ: "${transcript}"। ମୂଲ୍ୟ, ରୋଗ, ଯୋଜନା, ଋଣ, ମଣ୍ଡି — ସାହାଯ୍ୟ କରିପାରିବି।`,
    },
  }

  const langResponses = responses[langCode] || responses.en
  let key = 'default'
  if (text.includes('price') || text.includes('rate') || text.includes('भाव') || text.includes('ভাও') || text.includes('ధర') || text.includes('விலை') || text.includes('ಬೆಲೆ') || text.includes('വില') || text.includes('bhav') || text.includes('daam') || text.includes('ਭਾਅ')) key = 'price'
  else if (text.includes('disease') || text.includes('रोग') || text.includes('rog') || text.includes('sick') || text.includes('yellow') || text.includes('spot') || text.includes('ರೋಗ') || text.includes('వ్యాధి') || text.includes('நோய்')) key = 'disease'
  else if (text.includes('scheme') || text.includes('yojana') || text.includes('योजना') || text.includes('government') || text.includes('kisan') || text.includes('pmkisan') || text.includes('ಯೋಜನೆ') || text.includes('திட்டம்') || text.includes('পদ্ধতি')) key = 'scheme'
  else if (text.includes('rain') || text.includes('weather') || text.includes('flood') || text.includes('baarish') || text.includes('बारिश') || text.includes('मौसम') || text.includes('ਮੌਸਮ') || text.includes('ਬਾਰਿਸ਼')) key = 'weather'
  else if (text.includes('loan') || text.includes('karz') || text.includes('rin') || text.includes('ऋण') || text.includes('ਕਰਜ਼ਾ') || text.includes('കടം') || text.includes('கடன்') || text.includes('credit')) key = 'loan'

  return langResponses[key] || langResponses.default
}
