
// KrishiChain Voice Engine - Fixed & Simplified
// Supports all 22 Indian languages

// BCP-47 language codes for speech APIs
export const LANG_BCP = {
  en:'en-IN', hi:'hi-IN', mr:'mr-IN', bn:'bn-IN', te:'te-IN',
  ta:'ta-IN', gu:'gu-IN', kn:'kn-IN', ml:'ml-IN', pa:'pa-IN',
  or:'or-IN', as:'as-IN', ur:'ur-IN', ne:'ne-NP',
  mai:'hi-IN', kok:'hi-IN', mni:'bn-IN', sat:'hi-IN',
  ks:'ur-IN', doi:'hi-IN', sd:'ur-IN', sa:'hi-IN',
}

// Detect language from Unicode script
export function detectScript(text) {
  if (!text) return null
  if (/[\u0900-\u097F]/.test(text)) return 'hi'   // Devanagari
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'   // Gurmukhi
  if (/[\u0980-\u09FF]/.test(text)) return 'bn'   // Bengali/Assamese
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'   // Telugu
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'   // Tamil
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'   // Gujarati
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'   // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'   // Malayalam
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or'   // Odia
  if (/[\u0600-\u06FF]/.test(text)) return 'ur'   // Arabic/Urdu
  return null
}

// ── SPEAK TEXT ──────────────────────────────────────────────────────────────
export function speakText(text, langCode) {
  return new Promise((resolve) => {
    if (!text || !window.speechSynthesis) { resolve(); return }

    // Cancel anything playing
    window.speechSynthesis.cancel()

    const bcp = LANG_BCP[langCode] || 'hi-IN'

    const doUtter = () => {
      const voices = window.speechSynthesis.getVoices()
      const prefix = bcp.split('-')[0]

      // Find best voice: exact match → prefix match → any English
      const voice =
        voices.find(v => v.lang === bcp) ||
        voices.find(v => v.lang.startsWith(prefix)) ||
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.lang.startsWith('en')) ||
        null

      const utt = new SpeechSynthesisUtterance(text.slice(0, 2000))
      utt.lang   = bcp
      utt.rate   = 0.88
      utt.pitch  = 1.0
      utt.volume = 1.0
      if (voice) utt.voice = voice

      utt.onend   = () => resolve()
      utt.onerror = () => resolve()
      setTimeout(resolve, 25000) // safety

      window.speechSynthesis.speak(utt)
    }

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      doUtter()
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null
        doUtter()
      }
      setTimeout(() => {
        window.speechSynthesis.onvoiceschanged = null
        doUtter()
      }, 1500)
    }
  })
}

// ── LISTEN ──────────────────────────────────────────────────────────────────
export function listenOnce(langCode, onResult, onError, onEnd) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) {
    onError('Please open this app in Google Chrome for voice support.')
    return null
  }

  const bcp = LANG_BCP[langCode] || 'hi-IN'
  const r   = new SR()
  r.lang              = bcp
  r.continuous        = false
  r.interimResults    = true
  r.maxAlternatives   = 3

  let gotFinal = false

  r.onresult = (e) => {
    let fin = '', interim = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) fin += e.results[i][0].transcript
      else interim += e.results[i][0].transcript
    }
    if (fin) { gotFinal = true; onResult(fin.trim(), true) }
    else if (interim) onResult(interim.trim(), false)
  }

  r.onerror = (e) => {
    const MAP = {
      'not-allowed' : 'Microphone blocked. Please allow microphone in browser settings.',
      'no-speech'   : 'No speech heard. Please speak clearly.',
      'network'     : 'Network issue. Check your internet.',
      'audio-capture': 'No microphone found.',
      'aborted'     : '',
    }
    const msg = MAP[e.error] || ''
    if (msg) onError(msg)
  }

  r.onend = () => onEnd(gotFinal)

  try { r.start() } catch (e) { onError('Cannot start microphone: ' + e.message) }
  return r
}

// ── ANSWER QUERY ────────────────────────────────────────────────────────────
export function answerQuery(text, appLang) {
  const lower = text.toLowerCase()

  // Detect language from script; fall back to app language
  const detectedLang = detectScript(text) || appLang
  const lang = detectedLang

  // Intent detection — multi-language keywords
  const is = (...words) => words.some(w => lower.includes(w))

  let intent = 'help'
  if (is('price','rate','bhav','भाव','दाम','ਭਾਅ','ధర','விலை','ಬೆಲೆ','വില','মোল','ভাও','ਦਾਮ','mol','mandi rate','narakh'))
    intent = 'price'
  else if (is('disease','sick','yellow','spot','rot','blight','रोग','बीमारी','ਰੋਗ','రోగ','நோய்','ರೋಗ','രോഗ','रोग','পীক','rog','keeda','kida'))
    intent = 'disease'
  else if (is('scheme','yojana','government','subsidy','kisan','pmkisan','insurance','pmfby','योजना','सरकार','ਯੋਜਨਾ','పథకం','திட்டம்','ಯೋಜನೆ','പദ്ധതി','योजना','প্রকল্প'))
    intent = 'scheme'
  else if (is('loan','karz','rin','credit','bank','borrow','ऋण','कर्ज','ब्याज','ਕਰਜ਼ਾ','రుణ','கடன்','ಸಾಲ','വായ്പ','कर्ज','ঋণ'))
    intent = 'loan'
  else if (is('weather','rain','baarish','flood','मौसम','बारिश','ਮੌਸਮ','వాతావరణ','வானிலை','ಹವಾಮಾನ','കാലാവസ്ഥ','हवामान','আবহাওয়া'))
    intent = 'weather'
  else if (is('mandi','market','nearby','nearest','sell','मंडी','बाजार','ਮੰਡੀ','మార్కెట్','சந்தை','ಮಾರ್ಕೆಟ್','ചന്ത','बाजार','মান্ডি'))
    intent = 'mandi'
  else if (is('cheat','fraud','dhokha','wrong rate','low price','धोखा','ठगी','ਧੋਖਾ','మోసం','மோசடி','ಮೋಸ','ചതി','फसवणूक','প্রতারণা'))
    intent = 'cheat'
  else if (is('profit','transport','cost','loss','calculate','लाभ','ਮੁਨਾਫਾ','లాభ','லாபம்','ಲಾಭ','ലാഭ','नफा','লাভ'))
    intent = 'profit'

  const DB = {
    price: {
      en: 'Today\'s prices: Tomato ₹24-28 per kg. Onion ₹20-24. Potato ₹16-20. Wheat MSP ₹2275 per quintal. Cotton MSP ₹6620. Go to AI Forecast for live mandi prices.',
      hi: 'आज के भाव: टमाटर ₹24-28 प्रति किलो। प्याज ₹20-24। आलू ₹16-20। गेहूं MSP ₹2275 प्रति क्विंटल। कपास ₹6620। लाइव भाव के लिए AI Forecast देखें।',
      mr: 'आजचे भाव: टोमॅटो ₹24-28 किलो। कांदा ₹20-24। बटाटा ₹16-20। गहू MSP ₹2275 क्विंटल। AI Forecast मध्ये लाइव भाव पहा।',
      pa: 'ਅੱਜ ਦੇ ਭਾਅ: ਟਮਾਟਰ ₹24-28 ਕਿੱਲੋ। ਪਿਆਜ਼ ₹20-24। ਆਲੂ ₹16-20। ਕਣਕ MSP ₹2275 ਕੁਇੰਟਲ। AI Forecast ਵਿੱਚ ਜਾਓ।',
      ml: 'ഇന്നത്തെ വില: തക്കാളി ₹24-28/കിലോ. ഉള്ളി ₹20-24. ഉരുളക്കിഴങ്ങ് ₹16-20. ഗോതമ്പ് MSP ₹2275. AI Forecast തുറക്കൂ.',
      ta: 'இன்றைய விலை: தக்காளி ₹24-28/கிலோ. வெங்காயம் ₹20-24. உருளை ₹16-20. கோதுமை MSP ₹2275. AI Forecast பாருங்கள்.',
      te: 'నేటి ధరలు: టమాటో ₹24-28/కిలో. ఉల్లి ₹20-24. బంగాళాదుంప ₹16-20. గోధుమ MSP ₹2275. AI Forecast తెరవండి.',
      kn: 'ಇಂದಿನ ಬೆಲೆ: ಟೊಮ್ಯಾಟೋ ₹24-28/ಕಿಲೋ. ಈರುಳ್ಳಿ ₹20-24. ಆಲೂ ₹16-20. ಗೋಧಿ MSP ₹2275. AI Forecast ತೆರೆಯಿರಿ.',
      gu: 'આજના ભાવ: ટામેટા ₹24-28/કિલો. ડુંગળી ₹20-24. બટેટા ₹16-20. ઘઉં MSP ₹2275. AI Forecast ખોલો.',
      bn: 'আজকের দাম: টমেটো ₹24-28/কিলো. পেঁয়াজ ₹20-24. আলু ₹16-20. গম MSP ₹2275. AI Forecast দেখুন।',
      ur: 'آج کی قیمتیں: ٹماٹر ₹24-28/کلو۔ پیاز ₹20-24۔ آلو ₹16-20۔ گندم MSP ₹2275۔ AI Forecast دیکھیں۔',
      or: 'ଆଜିର ମୂଲ୍ୟ: ଟମାଟୋ ₹24-28/କିଲୋ. ପିଆଜ ₹20-24. ଆଳୁ ₹16-20. ଗହମ MSP ₹2275.',
      as: 'আজিৰ দাম: টমেটো ₹24-28/কিলো. পিঁয়াজ ₹20-24. আলু ₹16-20.',
      ne: 'आजको भाउ: गोलभेडा ₹24-28/किलो. प्याज ₹20-24. आलु ₹16-20. गहुँ MSP ₹2275.',
    },
    disease: {
      en: 'I can diagnose crop disease from a photo. Open Crop Doctor, take a clear photo of the sick leaf or stem, and I will tell you the disease name, cause, treatment, and how many days until spoilage — in your language with voice.',
      hi: 'मैं फोटो से फसल का रोग पहचान सकता हूँ। Crop Doctor खोलें, बीमार पत्ती की साफ फोटो लें। मैं रोग, कारण, इलाज और कितने दिन बचे हैं — हिंदी में बोलकर बताऊंगा।',
      mr: 'मी फोटोवरून पीक रोग ओळखतो. Crop Doctor उघडा, आजारी पानाचा फोटो काढा. रोग, कारण, उपाय मराठीत सांगेन.',
      pa: 'ਮੈਂ ਫੋਟੋ ਤੋਂ ਫਸਲ ਦਾ ਰੋਗ ਪਛਾਣਦਾ ਹਾਂ। Crop Doctor ਖੋਲ੍ਹੋ, ਬਿਮਾਰ ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਓ। ਰੋਗ, ਕਾਰਨ, ਇਲਾਜ ਪੰਜਾਬੀ ਵਿੱਚ ਦੱਸਾਂਗਾ।',
      ml: 'ഫോട്ടോ വഴി ഞാൻ വിള രോഗം കണ്ടെത്തും. Crop Doctor തുറക്കൂ, രോഗബാധിത ഇലയുടെ ഫോട്ടോ എടുക്കൂ. രോഗം, കാരണം, ചികിത്സ മലയാളത്തിൽ പറയും.',
      ta: 'புகைப்படத்திலிருந்து நோயை கண்டறிவேன். Crop Doctor திறக்கவும், நோயுற்ற இலையின் புகைப்படம் எடுக்கவும். நோய், காரணம், சிகிச்சை தமிழில் சொல்வேன்.',
      te: 'ఫోటో ద్వారా పంట వ్యాధి గుర్తిస్తాను. Crop Doctor తెరవండి, జబ్బుపడిన ఆకు ఫోటో తీయండి. వ్యాధి, కారణం, చికిత్స తెలుగులో చెబుతాను.',
      kn: 'ಫೋಟೋ ಮೂಲಕ ಬೆಳೆ ರೋಗ ಗುರುತಿಸುತ್ತೇನೆ. Crop Doctor ತೆರೆಯಿರಿ. ರೋಗ, ಕಾರಣ, ಚಿಕಿತ್ಸೆ ಕನ್ನಡದಲ್ಲಿ ಹೇಳುತ್ತೇನೆ.',
      gu: 'ફોટોથી પાક રોગ ઓળખું. Crop Doctor ખોલો, બીમાર પાંદડાનો ફોટો લો. રોગ, કારણ, ઉપચાર ગુજરાતીમાં.',
      bn: 'ছবি থেকে ফসলের রোগ চিনি। Crop Doctor খুলুন, অসুস্থ পাতার ছবি তুলুন। বাংলায় বলব।',
      ur: 'تصویر سے فصل کی بیماری پہچانتا ہوں۔ Crop Doctor کھولیں، بیمار پتے کی تصویر لیں۔',
      or: 'ଫୋଟୋ ଦ୍ୱାରା ପାକ ରୋଗ ଚିହ୍ନଟ କରୁ। Crop Doctor ଖୋଲନ୍ତୁ।',
      as: 'ফটোৰ পৰা শস্যৰ ৰোগ চিনাক্ত কৰো। Crop Doctor খোলক।',
    },
    scheme: {
      en: 'Key government schemes for you: PM-KISAN gives ₹6000 per year to your bank account. PMFBY crop insurance at only 1.5% premium. Kisan Credit Card at 4% interest. Over ₹14000 crore is unclaimed. Open Government Schemes to check your eligibility.',
      hi: 'मुख्य सरकारी योजनाएं: PM-KISAN से ₹6000/वर्ष सीधे बैंक में। PMFBY फसल बीमा सिर्फ 1.5% प्रीमियम। किसान क्रेडिट कार्ड 4% ब्याज। ₹14000 करोड़ अनक्लेम्ड है। सरकारी योजनाएं खोलें।',
      mr: 'PM-KISAN: ₹6000/वर्ष थेट बँकेत. PMFBY: 1.5% प्रीमियम. KCC: 4% व्याज. ₹14000 कोटी अनक्लेम्ड. सरकारी योजना उघडा.',
      pa: 'PM-KISAN: ₹6000/ਸਾਲ ਸਿੱਧਾ ਬੈਂਕ ਵਿੱਚ. PMFBY: 1.5% ਪ੍ਰੀਮੀਅਮ. KCC: 4% ਵਿਆਜ. ₹14000 ਕਰੋੜ ਅਨਕਲੇਮਡ. ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਖੋਲ੍ਹੋ.',
      ml: 'PM-KISAN: ₹6000/വർഷം ബാങ്കിൽ. PMFBY: 1.5% പ്രീമിയം. KCC: 4% പലിശ. ₹14000 കോടി ക്ലെയിം ചെയ്യാത്തത്. സർക്കാർ പദ്ധതി തുറക്കൂ.',
      ta: 'PM-KISAN: ₹6000/ஆண்டு வங்கியில். PMFBY: 1.5% பிரீமியம். KCC: 4% வட்டி. ₹14000 கோடி கோரப்படாதது. அரசு திட்டங்கள் திறக்கவும்.',
      te: 'PM-KISAN: ₹6000/సంవత్సరం బ్యాంకుకు. PMFBY: 1.5% ప్రీమియం. KCC: 4% వడ్డీ. ₹14000 కోటి క్లెయిమ్ చేయలేదు. ప్రభుత్వ పథకాలు తెరవండి.',
      kn: 'PM-KISAN: ₹6000/ವರ್ಷ ಬ್ಯಾಂಕಿಗೆ. PMFBY: 1.5% ಪ್ರೀಮಿಯಂ. KCC: 4% ಬಡ್ಡಿ. ₹14000 ಕೋಟಿ ಕ್ಲೇಮ್ ಆಗಿಲ್ಲ. ಸರ್ಕಾರಿ ಯೋಜನೆ ತೆರೆಯಿರಿ.',
      gu: 'PM-KISAN: ₹6000/વર્ષ. PMFBY: 1.5% પ્રીમિયમ. KCC: 4% વ્યાજ. ₹14000 કરોડ અનક્લેઇમ. સરકારી યોજના ખોલો.',
      bn: 'PM-KISAN: ₹6000/বছর। PMFBY: 1.5% প্রিমিয়াম। KCC: 4% সুদ। ₹14000 কোটি দাবিহীন। সরকারি প্রকল্প খুলুন।',
      ur: 'PM-KISAN: ₹6000/سال۔ PMFBY: 1.5% پریمیم۔ KCC: 4% سود۔ ₹14000 کروڑ غیر دعویٰ۔ سرکاری منصوبے کھولیں۔',
      or: 'PM-KISAN: ₹6000/ବର୍ଷ. PMFBY: 1.5% ପ୍ରିମିୟମ. KCC: 4% ସୁଧ. ₹14000 କୋଟି ଅଦାବି.',
      as: 'PM-KISAN: ₹6000/বছৰ. PMFBY: 1.5% প্ৰিমিয়াম. KCC: 4% সুদ.',
    },
    loan: {
      en: 'Cheapest loans for farmers: World Bank IFAD at 1.25% per year, GIZ Germany at 2%, Kisan Credit Card at 4%. Moneylenders charge 40-60%. Open International Loans for step by step application.',
      hi: 'सबसे सस्ते ऋण: World Bank IFAD 1.25%/वर्ष, GIZ जर्मनी 2%, किसान क्रेडिट कार्ड 4%। साहूकार 40-60% लेते हैं। International Loans खोलें।',
      mr: 'सर्वात स्वस्त कर्ज: IFAD 1.25%/वर्ष, GIZ जर्मनी 2%, KCC 4%. सावकार 40-60% घेतात. International Loans उघडा.',
      pa: 'ਸਭ ਤੋਂ ਸਸਤੇ ਕਰਜ਼ੇ: IFAD 1.25%/ਸਾਲ, GIZ ਜਰਮਨੀ 2%, KCC 4%. ਸ਼ਾਹੂਕਾਰ 40-60% ਲੈਂਦੇ ਹਨ. International Loans ਖੋਲ੍ਹੋ.',
      ml: 'ഏറ്റവും വിലകുറഞ്ഞ വായ്പ: IFAD 1.25%/വർഷം, GIZ 2%, KCC 4%. International Loans തുറക്കൂ.',
      ta: 'மிக குறைந்த கடன்: IFAD 1.25%/ஆண்டு, GIZ 2%, KCC 4%. International Loans திறக்கவும்.',
      te: 'అత్యంత చౌకైన రుణాలు: IFAD 1.25%/సంవత్సరం, GIZ 2%, KCC 4%. International Loans తెరవండి.',
      kn: 'ಅಗ್ಗದ ಸಾಲ: IFAD 1.25%/ವರ್ಷ, GIZ 2%, KCC 4%. International Loans ತೆರೆಯಿರಿ.',
      gu: 'સસ્તી લોન: IFAD 1.25%/વર્ષ, GIZ 2%, KCC 4%. International Loans ખોલો.',
      bn: 'সস্তা ঋণ: IFAD 1.25%/বছর, GIZ 2%, KCC 4%. International Loans খুলুন।',
      ur: 'سستا قرض: IFAD 1.25%/سال، GIZ 2%، KCC 4%۔ International Loans کھولیں۔',
      or: 'ଶସ୍ତା ଋଣ: IFAD 1.25%/ବର୍ଷ, GIZ 2%, KCC 4%.',
      as: 'সস্তা ঋণ: IFAD 1.25%/বছৰ, GIZ 2%, KCC 4%.',
    },
    weather: {
      en: 'Weather alert this week: Heavy rain expected in Maharashtra, Punjab and West Bengal. Postpone fertilizer application for 48 hours to avoid wastage. If hail warning in your district, cover vegetables with nets immediately.',
      hi: 'मौसम अलर्ट: महाराष्ट्र, पंजाब और पश्चिम बंगाल में भारी बारिश। 48 घंटे खाद न डालें। ओले की चेतावनी हो तो सब्जियां ढकें।',
      mr: 'हवामान सूचना: महाराष्ट्र, पंजाब, पश्चिम बंगालमध्ये जड पाऊस. 48 तास खत टाकू नका. गारपीट असल्यास भाज्या झाका.',
      pa: 'ਮੌਸਮ ਚੇਤਾਵਨੀ: ਮਹਾਰਾਸ਼ਟਰ, ਪੰਜਾਬ, ਪੱਛਮੀ ਬੰਗਾਲ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ. 48 ਘੰਟੇ ਖਾਦ ਨਾ ਪਾਓ.',
      ml: 'കാലാവസ്ഥ: മഹാരാഷ്ട്ര, പഞ്ചാബ്, ബംഗാളിൽ കനത്ത മഴ. 48 മണിക്കൂർ വളം ഇടരുത്.',
      ta: 'வானிலை: மகாராஷ்டிரா, பஞ்சாப், மேற்கு வங்காளத்தில் கனமழை. 48 மணி நேரம் உரம் போடாதீர்கள்.',
      te: 'వాతావరణం: మహారాష్ట్ర, పంజాబ్, పశ్చిమ బెంగాల్‌లో భారీ వర్షం. 48 గంటలు ఎరువు వేయకండి.',
      kn: 'ಹವಾಮಾನ: ಮಹಾರಾಷ್ಟ್ರ, ಪಂಜಾಬ್, ಪಶ್ಚಿಮ ಬಂಗಾಳದಲ್ಲಿ ಭಾರಿ ಮಳೆ. 48 ಗಂಟೆ ಗೊಬ್ಬರ ಹಾಕಬೇಡಿ.',
      gu: 'હવામાન: મહારાષ્ટ્ર, પંજાબ, પ. બંગાળ ભારે વરસાદ. 48 કલાક ખાતર ન નાખો.',
      bn: 'আবহাওয়া: মহারাষ্ট্র, পাঞ্জাব, পশ্চিমবঙ্গে ভারী বৃষ্টি. ৪৮ ঘণ্টা সার দেবেন না.',
      ur: 'موسم: مہاراشٹر، پنجاب، مغربی بنگال میں بھاری بارش. ۴۸ گھنٹے کھاد نہ ڈالیں.',
      or: 'ଆବହାୱା: ମହାରାଷ୍ଟ୍ର, ପଞ୍ଜାବ, ପ. ବଙ୍ଗ ଭାରୀ ବର୍ଷା.',
      as: 'বতৰ: মহাৰাষ্ট্ৰ, পঞ্জাব, পশ্চিমবংগত ভাৰী বৰষুণ.',
    },
    mandi: {
      en: 'KrishiChain has 55 mandis mapped across all Indian states. Open Market Map to find mandis near you. Filter by state, crop or district. Azadpur Delhi is Asia largest. Koyambedu Chennai, Bowenpally Hyderabad, APMC Nagpur are also available.',
      hi: 'KrishiChain में पूरे भारत की 55 मंडियां हैं। Market Map खोलें। राज्य, फसल या जिले से फिल्टर करें। आजादपुर दिल्ली — एशिया की सबसे बड़ी मंडी।',
      mr: 'KrishiChain मध्ये संपूर्ण भारतातील 55 मंड्या आहेत. Market Map उघडा. राज्य, पीक किंवा जिल्ह्यानुसार फिल्टर करा.',
      pa: 'KrishiChain ਵਿੱਚ ਪੂਰੇ ਭਾਰਤ ਦੀਆਂ 55 ਮੰਡੀਆਂ ਹਨ. Market Map ਖੋਲ੍ਹੋ. ਰਾਜ, ਫਸਲ ਜਾਂ ਜ਼ਿਲੇ ਨਾਲ ਫਿਲਟਰ ਕਰੋ.',
      ml: 'KrishiChain-ൽ 55 മണ്ടി ഉണ്ട്. Market Map തുറക്കൂ. സംസ്ഥാനം, വിള, ജില്ല ഫിൽറ്റർ.',
      ta: 'KrishiChain-ல் 55 மண்டிகள் உள்ளன. Market Map திறக்கவும். மாநிலம், பயிர், மாவட்டம் வடிகட்டவும்.',
      te: 'KrishiChain-లో 55 మండులు ఉన్నాయి. Market Map తెరవండి. రాష్ట్రం, పంట, జిల్లా ఫిల్టర్.',
      kn: 'KrishiChain-ನಲ್ಲಿ 55 ಮಂಡಿ ಇದೆ. Market Map ತೆರೆಯಿರಿ.',
      gu: 'KrishiChain-માં 55 મંડી. Market Map ખોલો.',
      bn: 'KrishiChain-এ 55টি মান্ডি। Market Map খুলুন।',
      ur: 'KrishiChain میں 55 مندیاں۔ Market Map کھولیں۔',
      or: 'KrishiChain ରେ 55 ମଣ୍ଡି। Market Map ଖୋଲନ୍ତୁ।',
      as: 'KrishiChain-ত 55 মান্ডি। Market Map খোলক।',
    },
    cheat: {
      en: 'To check if the agent is cheating you, open Smart Tools and use the Cheat Detector. Enter the rate the agent told you. If the difference from actual mandi rate is more than 8 percent, you will see a red alert. Show that screen to the agent and demand the correct rate.',
      hi: 'एजेंट धोखा दे रहा है? Smart Tools खोलें, Cheat Detector में एजेंट का भाव डालें। 8% से ज़्यादा अंतर हो तो लाल अलर्ट आएगा। वो स्क्रीन एजेंट को दिखाएं।',
      mr: 'एजंट फसवत आहे? Smart Tools उघडा, Cheat Detector मध्ये एजंटचा भाव टाका. 8% पेक्षा जास्त फरक असल्यास लाल अलर्ट. ती स्क्रीन एजंटला दाखवा.',
      pa: 'ਏਜੰਟ ਧੋਖਾ ਦੇ ਰਿਹਾ ਹੈ? Smart Tools ਖੋਲ੍ਹੋ. ਏਜੰਟ ਦਾ ਭਾਅ ਦਰਜ ਕਰੋ. 8% ਤੋਂ ਵੱਧ ਫ਼ਰਕ ਤੇ ਲਾਲ ਅਲਰਟ ਆਵੇਗਾ.',
      ml: 'ഏജന്റ് ചതിക്കുന്നോ? Smart Tools തുറക്കൂ. ഏജന്റ് പറഞ്ഞ നിരക്ക് നൽകൂ. 8% വ്യത്യാസം ഉണ്ടെങ്കിൽ ചുവപ്പ് അലർട്ട്.',
      ta: 'ஏஜென்ட் ஏமாற்றுகிறாரா? Smart Tools திற, Cheat Detector-ல் ரேட் போடு. 8% வித்தியாசம் இருந்தால் சிவப்பு எச்சரிக்கை.',
      te: 'ఏజెంట్ మోసం చేస్తున్నారా? Smart Tools తెరవండి. ఏజెంట్ రేటు నమోదు చేయండి. 8% తేడా ఉంటే ఎరుపు హెచ్చరిక.',
      kn: 'ಏಜೆಂಟ್ ಮೋಸ ಮಾಡುತ್ತಿದ್ದಾರೆಯೇ? Smart Tools ತೆರೆಯಿರಿ. 8% ವ್ಯತ್ಯಾಸ ಇದ್ದರೆ ಕೆಂಪು ಎಚ್ಚರಿಕೆ.',
      gu: 'એજન્ટ ઠગ કરે? Smart Tools ખોલો. 8% ફ઼erse rie.',
      bn: 'এজেন্ট ঠকাচ্ছে? Smart Tools খুলুন. 8% বেশি পার্থক্যে লাল অ্যালার্ট।',
      ur: 'ایجنٹ دھوکہ دے رہا ہے؟ Smart Tools کھولیں۔ 8% سے زیادہ فرق پر سرخ الرٹ۔',
      or: 'ଏଜେଣ୍ଟ ଠକ କରୁଛି? Smart Tools ଖୋଲନ୍ତୁ.',
      as: 'এজেন্ট প্ৰতাৰণা কৰিছে? Smart Tools খোলক.',
    },
    profit: {
      en: 'Before travelling to any mandi, use the Profit Calculator in Smart Tools. It subtracts transport cost, mandi commission at 6.5 percent, and weighment deduction at 5 percent, and shows your real profit. Many farmers lose money by not calculating first.',
      hi: 'किसी मंडी जाने से पहले Smart Tools में Profit Calculator खोलें। परिवहन, 6.5% कमीशन और 5% तौल कटौती काटकर असली लाभ बताता है।',
      mr: 'कोणत्याही मंडीत जाण्यापूर्वी Smart Tools मधील Profit Calculator वापरा. वाहतूक, 6.5% कमिशन, 5% वजन कपात वजा करून खरा नफा दाखवतो.',
      pa: 'ਕਿਸੇ ਮੰਡੀ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ Smart Tools ਵਿੱਚ Profit Calculator ਵਰਤੋ.',
      ml: 'ഏതെങ്കിലും മണ്ടിയിൽ പോകുന്നതിന് മുൻപ് Smart Tools-ൽ Profit Calculator ഉപയോഗിക്കൂ.',
      ta: 'மண்டிக்கு செல்வதற்கு முன் Smart Tools-ல் Profit Calculator பயன்படுத்துங்கள்.',
      te: 'మండికి వెళ్ళే ముందు Smart Tools లో Profit Calculator వాడండి.',
      kn: 'ಮಂಡಿಗೆ ಹೋಗುವ ಮೊದಲು Smart Tools ನಲ್ಲಿ Profit Calculator ಬಳಸಿ.',
      gu: 'મંડી જતા પહેલા Smart Tools-માં Profit Calculator વાપરો.',
      bn: 'মান্ডিতে যাওয়ার আগে Smart Tools-এ Profit Calculator ব্যবহার করুন।',
      ur: 'منڈی جانے سے پہلے Smart Tools میں Profit Calculator استعمال کریں۔',
      or: 'ମଣ୍ଡି ଯିବା ପୂର୍ବ Smart Tools ରେ Profit Calculator ଖୋଲନ୍ତୁ.',
      as: 'মান্ডিলৈ যোৱাৰ আগতে Smart Tools-ত Profit Calculator খোলক.',
    },
    help: {
      en: 'I can help you with crop prices, disease diagnosis, government schemes, cheap loans, weather alerts, nearby mandis, and profit calculation. Just say what you want to know.',
      hi: 'मैं इनमें मदद कर सकता हूँ: फसल भाव, रोग पहचान, सरकारी योजनाएं, सस्ते ऋण, मौसम, पास की मंडी, लाभ गणना। बस बोलें क्या जानना है।',
      mr: 'मी मदत करतो: पीक भाव, रोग, सरकारी योजना, स्वस्त कर्ज, हवामान, जवळची मंडी, नफा. काय सांगू?',
      pa: 'ਮੈਂ ਮਦਦ ਕਰਦਾ ਹਾਂ: ਫਸਲ ਭਾਅ, ਰੋਗ, ਸਰਕਾਰੀ ਯੋਜਨਾ, ਸਸਤਾ ਕਰਜ਼ਾ, ਮੌਸਮ, ਮੰਡੀ, ਮੁਨਾਫਾ.',
      ml: 'ഞാൻ സഹായിക്കും: വിള വില, രോഗം, സർക്കാർ പദ്ധതി, വായ്പ, കാലാവസ്ഥ, മണ്ടി, ലാഭം.',
      ta: 'நான் உதவுவேன்: பயிர் விலை, நோய், அரசு திட்டம், கடன், வானிலை, மண்டி, லாபம்.',
      te: 'నేను సహాయపడతాను: పంట ధర, వ్యాధి, పథకాలు, రుణాలు, వాతావరణం, మండి, లాభం.',
      kn: 'ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ: ಬೆಳೆ ಬೆಲೆ, ರೋಗ, ಯೋಜನೆ, ಸಾಲ, ಹವಾಮಾನ, ಮಂಡಿ, ಲಾಭ.',
      gu: 'હું મદદ કરીશ: ભાવ, રોગ, યોજના, લોન, હવામાન, મંડી, નફો.',
      bn: 'আমি সাহায্য করব: দাম, রোগ, প্রকল্প, ঋণ, আবহাওয়া, মান্ডি, লাভ.',
      ur: 'میں مدد کروں گا: قیمت، بیماری، منصوبہ، قرض، موسم، منڈی، منافع.',
      or: 'ମୁଁ ସାହାଯ୍ୟ କରିବି: ମୂଲ୍ୟ, ରୋଗ, ଯୋଜନା, ଋଣ, ଆବହାୱା, ମଣ୍ଡି, ଲାଭ.',
      as: 'মই সহায় কৰিম: দাম, ৰোগ, আঁচনি, ঋণ, বতৰ, মান্ডি, লাভ.',
    },
  }

  const replies = DB[intent] || DB.help
  const answer  = replies[lang] || replies[lang.split('-')[0]] || replies.en

  return { text: answer, lang, intent }
}