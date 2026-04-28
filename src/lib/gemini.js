const delay = ms => new Promise(r => setTimeout(r, ms))

export async function analyzeCropDisease(imageFile, language = 'en') {
  await delay(2000)
  const diseases = [
    {
      nameMap: { en:'Early Blight (Alternaria solani)', hi:'प्रारंभिक झुलसा रोग', mr:'आरंभिक करपा', pa:'ਸ਼ੁਰੂਆਤੀ ਝੁਲਸ', ml:'ഒൻപതാം ദ്രവം', ta:'ஆரம்ப கருகல்', te:'ప్రారంభ దహనం', kn:'ಆರಂಭಿಕ ಬ್ಲೈಟ್' },
      severity: 3, confidence: 91,
      causeMap: { en:'Fungal infection — Alternaria solani. Spreads in warm humid weather above 24°C. Spores travel via wind and rain.', hi:'अल्टरनेरिया सोलानी फंगस। 24°C से ऊपर गर्म नम मौसम में फैलता है।', mr:'अल्टरनेरिया सोलानी बुरशी. उष्ण दमट हवामानात पसरतो.', pa:'ਅਲਟਰਨੇਰੀਆ ਸੋਲਾਨੀ ਫੰਗਸ ਕਾਰਨ।', ml:'ഫംഗൽ അണുബാധ — ഊഷ്മള ഈർപ്പ കാലാവസ്ഥ.', ta:'பூஞ்சை தொற்று — வெப்பமான ஈரமான சூழல்.' },
      treatmentMap: { en:'Spray Mancozeb 75% WP at 2g/litre every 7 days. Remove infected leaves and burn them.', hi:'मैन्कोजेब 75% WP 2 ग्राम/लीटर हर 7 दिन में। संक्रमित पत्तियां जलाएं।', mr:'मॅन्कोझेब 75% WP 2 ग्राम/लिटर 7 दिवसांनी. रोगट पाने जाळा.', pa:'ਮੈਨਕੋਜ਼ੇਬ 75% WP 2 ਗ੍ਰਾਮ/ਲਿਟਰ ਹਰ 7 ਦਿਨ।', ml:'മാൻകോസെബ് 75% WP 2ഗ്രാം/ലിറ്റർ 7 ദിവസത്തിലൊരിക്കൽ.', ta:'மான்கோசெப் 75% WP 2கிராம்/லிட்டர் 7 நாட்களுக்கொரு முறை.' },
      preventionMap: { en:'Use disease-resistant varieties. 60cm plant spacing. Avoid overhead irrigation. Rotate crops every season.', hi:'रोग प्रतिरोधी किस्में। 60 सेमी दूरी। ऊपर से सिंचाई न करें।', mr:'रोगप्रतिरोधक वाण. 60 सेमी अंतर.', pa:'ਰੋਗ ਰੋਧਕ ਕਿਸਮਾਂ. 60 ਸੈ.ਮੀ. ਦੂਰੀ.', ml:'രോഗ പ്രതിരോധ ഇനങ്ങൾ. 60 സെ.മീ. ദൂരം.', ta:'நோய் எதிர்ப்பு இரகங்கள். 60 செ.மீ. இடைவெளி.' },
      timelineMap: { en:'Day 1-3: Yellow spots on leaves. Day 4-7: Spots enlarge. Day 8-14: Leaves die. ACT NOW — 3 days before major damage.', hi:'दिन 1-3: पीले धब्बे। दिन 4-7: बड़े होते हैं। अभी करें — 3 दिन बचे।', mr:'दिवस 1-3: पिवळे डाग. 3 दिवसांत उपचार करा.', pa:'ਦਿਨ 1-3: ਪੀਲੇ ਧੱਬੇ. ਹੁਣੇ ਇਲਾਜ ਕਰੋ.', ml:'ദിനം 1-3: മഞ്ഞ പൊട്ടുകൾ. ഇപ്പോൾ ചികിത്സിക്കുക.', ta:'நாள் 1-3: மஞ்சள் புள்ளிகள். இப்போதே சிகிச்சை.' },
      spoilDays: 5,
      marketImpactMap: { en:'Sell within 4 days (8-12% discount) OR treat now and sell in 10 days at full price. Treatment cost ₹120.', hi:'4 दिन में बेचें (8-12% छूट) या उपचार करें और 10 दिन में पूरे दाम पर बेचें।', mr:'4 दिवसांत विका किंवा उपचार करा.', pa:'4 ਦਿਨਾਂ ਵਿੱਚ ਵੇਚੋ ਜਾਂ ਇਲਾਜ ਕਰੋ.', ml:'4 ദിവസത്തിൽ വിൽക്കുക.', ta:'4 நாட்களில் விற்கவும்.' },
    },
    {
      nameMap: { en:'Healthy Crop ✓', hi:'स्वस्थ फसल ✓', mr:'निरोगी पीक ✓', pa:'ਸਿਹਤਮੰਦ ਫਸਲ ✓', ml:'ആരോഗ്യകരമായ വിള ✓', ta:'ஆரோக்கியமான பயிர் ✓' },
      severity: 0, confidence: 95,
      causeMap: { en:'No disease detected. Your crop is healthy!', hi:'कोई रोग नहीं। फसल स्वस्थ है!', mr:'कोणताही रोग नाही!', pa:'ਕੋਈ ਬਿਮਾਰੀ ਨਹੀਂ!', ml:'രോഗം ഇല്ല!', ta:'நோய் இல்லை!' },
      treatmentMap: { en:'No treatment needed. Continue regular care.', hi:'कोई उपचार नहीं। नियमित देखभाल जारी रखें।', mr:'उपचार नको.', pa:'ਕੋਈ ਇਲਾਜ ਨਹੀਂ.', ml:'ചികിത്സ ഇല്ല.', ta:'சிகிச்சை இல்லை.' },
      preventionMap: { en:'Monitor weekly. Maintain spacing and drainage.', hi:'साप्ताहिक निगरानी। उचित दूरी और जल निकासी।', mr:'साप्ताहिक निरीक्षण.', pa:'ਹਫਤਾਵਾਰੀ ਦੇਖਭਾਲ.', ml:'പ്രതിവാര നിരീക്ഷണം.', ta:'வார கண்காணிப்பு.' },
      timelineMap: { en:'Optimal condition. Harvest in 8-12 days for best price.', hi:'इष्टतम स्थिति। 8-12 दिन में कटाई।', mr:'8-12 दिवसांत काढणी करा.', pa:'8-12 ਦਿਨਾਂ ਵਿੱਚ ਕਟਾਈ.', ml:'8-12 ദിവസത്തിൽ വിളവ്.', ta:'8-12 நாட்களில் அறுவடை.' },
      spoilDays: 14,
      marketImpactMap: { en:'Premium condition. Target direct buyers for 15-20% better price.', hi:'प्रीमियम। सीधे खरीदारों को बेचें।', mr:'प्रीमियम दर्जा.', pa:'ਪ੍ਰੀਮੀਅਮ ਸਥਿਤੀ.', ml:'പ്രീമിയം നിലവാരം.', ta:'சிறந்த நிலை.' },
    }
  ]
  const r = diseases[Math.floor(Math.random() * diseases.length)]
  const l = language
  const speech = new SpeechSynthesisUtterance(r.nameMap[l] || r.nameMap.en);
  speech.lang = l === 'en' ? 'en-US' : `${l}-IN`; 
  window.speechSynthesis.speak(speech);
  return {
    name: r.nameMap[l] || r.nameMap.en,
    severity: r.severity, confidence: r.confidence,
    cause: r.causeMap[l] || r.causeMap.en,
    treatment: r.treatmentMap[l] || r.treatmentMap.en,
    prevention: r.preventionMap[l] || r.preventionMap.en,
    timeline: r.timelineMap[l] || r.timelineMap.en,
    spoilDays: r.spoilDays,
    marketImpact: r.marketImpactMap[l] || r.marketImpactMap.en,
  }
}

export async function calcNetProfit({ crop, qty, mandiPrice, distanceKm, vehicle, language = 'en' }) {
  await delay(600)
  const fuelRate = { truck:12, tempo:8, tractor:10, bike:3 }
  const capacity = { truck:5000, tempo:2000, tractor:1500, bike:100 }
  const trips = Math.ceil(qty / (capacity[vehicle]||2000))
  const fuel = trips * distanceKm * 2 * (fuelRate[vehicle]||10) / 10
  const commission = qty * mandiPrice * 0.065
  const weighment = qty * mandiPrice * 0.05
  const gross = qty * mandiPrice
  const net = gross - fuel - commission - weighment
  const msgsNet = {
    en: net > 0 ? `✅ PROFIT: ₹${Math.round(net).toLocaleString()} after all costs. Transport ₹${Math.round(fuel)}, Commission ₹${Math.round(commission)}, Weighment ₹${Math.round(weighment)}.` : `❌ LOSS: You will LOSE ₹${Math.round(Math.abs(net)).toLocaleString()} going there! Sell locally instead.`,
    hi: net > 0 ? `✅ लाभ: ₹${Math.round(net).toLocaleString()} मिलेंगे। परिवहन ₹${Math.round(fuel)}, कमीशन ₹${Math.round(commission)}.` : `❌ नुकसान: ₹${Math.round(Math.abs(net)).toLocaleString()} का नुकसान होगा! स्थानीय मंडी में बेचें।`,
    mr: net > 0 ? `✅ नफा: ₹${Math.round(net).toLocaleString()} मिळतील.` : `❌ तोटा: ₹${Math.round(Math.abs(net)).toLocaleString()} तोटा होईल!`,
    pa: net > 0 ? `✅ ਮੁਨਾਫਾ: ₹${Math.round(net).toLocaleString()} ਮਿਲਣਗੇ.` : `❌ ਨੁਕਸਾਨ: ₹${Math.round(Math.abs(net)).toLocaleString()} ਦਾ ਨੁਕਸਾਨ!`,
    ml: net > 0 ? `✅ ലാഭം: ₹${Math.round(net).toLocaleString()} ലഭിക്കും.` : `❌ നഷ്ടം: ₹${Math.round(Math.abs(net)).toLocaleString()} നഷ്ടം!`,
    ta: net > 0 ? `✅ லாபம்: ₹${Math.round(net).toLocaleString()} கிடைக்கும்.` : `❌ நஷ்டம்: ₹${Math.round(Math.abs(net)).toLocaleString()} நஷ்டம்!`,
  }
  return { gross:Math.round(gross), fuel:Math.round(fuel), commission:Math.round(commission), weighment:Math.round(weighment), net:Math.round(net), profitable:net>0, message:msgsNet[language]||msgsNet.en }
}

export async function checkCheating({ crop, agentRate, district, language='en' }) {
  await delay(800)
  const rates = { Tomato:26, Onion:22, Potato:18, Wheat:2275, Rice:2183, Cotton:6620, Soybean:4600 }
  const actual = rates[crop] || 24
  const diff = actual - agentRate
  const cheating = diff > actual * 0.08
  const msgs = {
    en: cheating ? `🚨 YES, CHEATING DETECTED! Agent said ₹${agentRate}/kg but ${district} actual rate is ₹${actual}/kg. You're losing ₹${Math.round(diff)} per kg. Show this screen to the agent!` : `✅ Agent rate ₹${agentRate}/kg is fair. Actual rate ₹${actual}/kg. Difference ₹${Math.abs(Math.round(diff))} is normal.`,
    hi: cheating ? `🚨 हाँ, धोखा हो रहा है! एजेंट ने ₹${agentRate}/kg बताया पर असली भाव ₹${actual}/kg है। यह स्क्रीन दिखाएं!` : `✅ एजेंट का भाव ₹${agentRate}/kg सही है।`,
    mr: cheating ? `🚨 होय, फसवणूक! एजंट ₹${agentRate}/kg म्हणाला पण खरा भाव ₹${actual}/kg. ही स्क्रीन दाखवा!` : `✅ भाव ₹${agentRate}/kg योग्य आहे.`,
    pa: cheating ? `🚨 ਹਾਂ, ਧੋਖਾ ਹੋ ਰਿਹਾ ਹੈ! ₹${agentRate}/ਕਿੱਲੋ ਕਿਹਾ ਪਰ ਅਸਲ ₹${actual}/ਕਿੱਲੋ. ਇਹ ਸਕਰੀਨ ਦਿਖਾਓ!` : `✅ ₹${agentRate}/ਕਿੱਲੋ ਸਹੀ ਹੈ.`,
    ml: cheating ? `🚨 അതെ, ചതി! ₹${agentRate}/കിലോ പറഞ്ഞു, ശരി ₹${actual}/കിലോ. ഈ സ്ക്രീൻ കാണിക്കൂ!` : `✅ ₹${agentRate}/കിലോ ന്യായം.`,
    ta: cheating ? `🚨 ஆம், ஏமாற்றுகிறார்கள்! ₹${agentRate}/கிலோ சொன்னார்கள், உண்மை ₹${actual}/கிலோ. இந்த திரையை காட்டுங்கள்!` : `✅ ₹${agentRate}/கிலோ நியாயம்.`,
  }
  return { agentRate, actual, diff:Math.abs(Math.round(diff)), cheating, message:msgs[language]||msgs.en }
}

export async function getForecast(crop, district) {
  await delay(1200)
  const base = { Tomato:28,Onion:22,Potato:18,Wheat:2275,Soybean:45,Cotton:62 }[crop]||25
  const data = Array.from({length:7},(_,i)=>({day:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],price:Math.round((base+(Math.random()-.4)*8+i*.6)*10)/10,demand:Math.round(60+Math.random()*35)}))
  const best = data.reduce((a,b)=>a.price>b.price?a:b)
  return { data, bestDay:best.day, bestPrice:best.price, recommendation:`Best: ${best.day} at ₹${best.price}/kg. Demand ${best.demand}%.`, confidence:Math.round(78+Math.random()*14) }
}
export async function getSpoilageWindow(crop, harvestDate, temp) {
  await delay(600)
  const base = {Tomato:5,Spinach:2,Mango:4,Potato:14,Onion:21,Wheat:60,Soybean:45}[crop]||7
  const d = Math.round(base*(temp>35?.6:temp>30?.8:1))
  return { daysLeft:d, urgency:d<=1?'critical':d<=2?'high':d<=4?'medium':'safe', tip:d<=1?'Sell today!':d<=4?'Sell within 2 days.':'Standard timing.' }
}
export async function getCooperativeMatch(crop, district, quantity) {
  await delay(1000)
  const farmers=[{name:'Rajesh Kumar',village:'Bilaspur',distance:4.2,quantity:800,score:92},{name:'Priya Devi',village:'Nandpur',distance:7.1,quantity:1200,score:88},{name:'Mohan Singh',village:'Satara',distance:5.8,quantity:600,score:85}]
  const total=quantity+farmers.reduce((s,f)=>s+f.quantity,0)
  const price=28+(total>3000?4.2:total>2000?2.8:1.5)
  return { farmers, totalQuantity:total, projectedPrice:Math.round(price*10)/10, premiumPercent:Math.round(((price-26)/26)*100), buyer:'BigBasket Procurement Hub', dealDeadline:'48 hours' }
}
export async function getCarbonCertificate(from,to,distKm,vehicle,kg) {
  await delay(800)
  const f={truck:.21,tempo:.15,tractor:.27,bike:.07}[vehicle]||.21
  const co2=Math.round(distKm*f*10)/10,co2kg=Math.round((co2/kg)*1000)/1000
  const rating=co2kg<.02?'A+':co2kg<.05?'A':co2kg<.1?'B':'C'
  return {co2,co2PerKg:co2kg,rating,from,to,distanceKm:distKm,vehicleType:vehicle,cropKg:kg,id:'KC-'+Date.now().toString(36).toUpperCase(),eligible:['EU Green Deal import','Walmart sustainability badge','Amazon Fresh eco-tier']}
}
export async function computeKrishiScore() {
  await delay(900)
  const s=Math.round(68+Math.random()*24)
  return {score:s,breakdown:{listingRegularity:Math.round(70+Math.random()*25),cropQuality:Math.round(65+Math.random()*30),onTimeDelivery:Math.round(75+Math.random()*20),cooperativeParticipation:Math.round(50+Math.random()*40),marketDiversity:Math.round(60+Math.random()*35)},loanEligibility:'₹35,000 – ₹1,20,000',partners:['Grameen Bank','Bajaj Finserv Rural','NABARD Micro Credit'],tip:'Improve cooperative participation to unlock higher credit.'}
}
export async function detectManipulation(mandi,crop) {
  await delay(2400)
  const m=Math.random()>.4
  return {manipulated:m,riskScore:m?Math.round(75+Math.random()*20):Math.round(10+Math.random()*25),verdict:m?'High probability of coordinated price suppression detected':'Prices appear fair — no manipulation signals detected',pattern:m?'Cartel pricing':'Normal market dynamics',evidence:m?['Prices 34% below district average for 11 days','All 4 agents posted identical bids within ₹0.50','Volume up 40% while prices fell','Cross-mandi gap: ₹12/kg stolen']:['Price variation ±12% — seasonal','Agent bid spread ₹3.40 — competitive','Volume-price correlation normal','Within 8% of district average'],totalLoss:m?84000:0,farmerCount:m?47:0,lossPerFarmer:m?1787:0,priceHistory:[{day:'Mon',fair:29,actual:m?19:28,volume:420},{day:'Tue',fair:30,actual:m?18:31,volume:580},{day:'Wed',fair:29,actual:m?20:27,volume:390},{day:'Thu',fair:31,actual:m?18:32,volume:610},{day:'Fri',fair:30,actual:m?19:29,volume:520},{day:'Sat',fair:28,actual:m?21:27,volume:300},{day:'Sun',fair:29,actual:m?19:30,volume:450}],agentSpread:[{agent:'Sharma Traders',bid:m?19.2:28.5},{agent:'Ram Commission',bid:m?19.0:31.2},{agent:'Lakshmi Agro',bid:m?19.5:29.8},{agent:'Singh & Sons',bid:m?18.8:30.5}],actions:m?[{label:'File APMC complaint',icon:'📋',priority:'urgent'},{label:'Call helpline 1800-11-4000',icon:'📞',priority:'urgent'},{label:'Alert district collector',icon:'🏛️',priority:'high'}]:[{label:'This mandi is safe to sell at',icon:'✅',priority:'safe'}]}
}
