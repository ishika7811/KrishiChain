# 🌾 KrishiChain Ultra v3 — Complete Edition
### Google Solution Challenge 2026 | Build with AI

> **India's first AI farm platform built FOR farmers — auto-start voice assistant in 22 Indian languages, all-India mandi database, works offline, literacy-free.**

---

## 🎤 NEW: Auto-Start Voice Assistant

**The moment the website opens, KrishiChain speaks to the farmer in their chosen language.**

- Greets automatically in all 22 scheduled Indian languages
- Listens continuously — farmer just speaks naturally
- Navigates pages by voice ("show government schemes", "mandi map dikhao")
- Answers crop prices, disease queries, loan info by voice
- Works in: हिन्दी · मराठी · ਪੰਜਾਬੀ · தமிழ் · తెలుగు · ಕನ್ನಡ · മലയാളം · বাংলা · ଓଡ଼ିଆ · ગુજરાતી · অসমীয়া · اردو · मैथिली · कोंकणी · নেপালি · मणिपुरी · संस्कृतम् · ᱥᱟᱱᱛᱟᱲᱤ · डोगरी · سنڌي · کٲشُر + English

---

## 📱 All 15 Screens

| # | Screen | Key Feature |
|---|--------|-------------|
| 1 | **Language Chooser** | First screen — 22 languages, full conversion |
| 2 | **Dashboard** | Live listings, spoilage alerts, quick actions |
| 3 | **List Produce** | Voice-first, Hindi auto-fill |
| 4 | **🔬 Crop Doctor** | Photo → AI diagnosis → spoken in your language |
| 5 | **📈 AI Forecast** | 7-day price prediction, Vertex AI |
| 6 | **🧮 Profit Tools** | Net profit calculator + Cheating detector |
| 7 | **🤝 Cooperative** | AI bulk deal, 15-20% premium |
| 8 | **🗺️ Market Map** | ALL INDIA mandis (55+) with filters |
| 9 | **📍 Nearby Places** | Mandis, banks, hospitals + star ratings |
| 10 | **🏛️ Govt Schemes** | PM-KISAN, PMFBY, KCC — step-by-step guide |
| 11 | **🏦 International Loans** | World Bank 1.25%, ADB, GIZ, USAID |
| 12 | **🌿 Carbon Certificate** | CO₂ per shipment, EU export eligible |
| 13 | **⭐ KrishiScore** | Farm credit score, micro-loan eligibility |
| 14 | **⊗ MandiGuard™** | AI cartel detector — legal complaint generator |
| 15 | **👤 User Profile** | Farmer/Trader/Agent/FPO profiles |

---

## 🌐 22 Indian Languages Supported

English, Hindi, Marathi, Bengali, Telugu, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Maithili, Konkani, Manipuri, Nepali, Santali, Kashmiri, Dogri, Sindhi, Sanskrit

---

## 🗺️ All-India Mandi Database (55+ mandis)

Covers all major states: Maharashtra, UP, Punjab, Haryana, Rajasthan, Gujarat, MP, Karnataka, AP, Telangana, Tamil Nadu, Kerala, West Bengal, Bihar, Odisha, Assam, Jharkhand, Chhattisgarh, Uttarakhand, HP, J&K, Delhi, Goa, North East.

Filters: by state, by crop, by search term.

---

## 🧠 Real Problems Solved

| Problem | Solution |
|---|---|
| Farmer can't read | Auto-voice greets & guides in their dialect |
| Agent cheating on price | Cheating Detector — shows actual rate |
| "Better price = transport loss" | Net Profit Calculator with ALL deductions |
| ₹14,000 Cr schemes unclaimed | Gov Schemes with eligibility + steps |
| No credit history | KrishiScore from farming behaviour |
| Mandi cartels | MandiGuard™ — statistical cartel detection |
| No cheap loans | 5 banks, 1.25% min rate |

---

## ⚡ Quick Start

```bash
unzip KrishiChain-Ultra-v3.zip
cd KC_v3
npm install
npm run dev
# → http://localhost:5173
# First screen: language chooser
# Voice assistant auto-starts after language selection!
```

## ☁️ Deploy to Firebase

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy
# Live at https://your-project.web.app
```

## 🔑 API Keys (.env.local)

```
VITE_GEMINI_API_KEY=      # aistudio.google.com (free)
VITE_FIREBASE_API_KEY=    # console.firebase.google.com
VITE_MAPS_API_KEY=        # Cloud Console
VITE_TTS_API_KEY=         # Cloud TTS (for Google voice fallback)
```

App runs fully in demo mode without keys.
Add `VITE_TTS_API_KEY` for premium Google voices in all Indian languages.

---

## 📁 File Structure (49 files)

```
KC_v3/
├── src/
│   ├── lib/
│   │   ├── voice.js          ← Voice engine: 22 langs, auto-start, STT+TTS
│   │   ├── data.js           ← 55+ mandis, 22 languages, all-India data
│   │   ├── gemini.js         ← All AI calls
│   │   ├── i18n.js           ← Translations
│   │   └── LangContext.jsx   ← Language state
│   ├── components/
│   │   ├── VoiceAssistant.jsx     ← Auto-start floating assistant
│   │   └── Sidebar.jsx            ← Nav with language switcher
│   └── pages/               ← 15 screens
└── firebase.json             ← Deploy config
---

---

## 📊 Google APIs Used (14)

| API | Used For |
|---|---|
| Gemini 2.0 Flash (Vision) | Crop disease detection from photos |
| Gemini 2.0 Flash (Text) | Advisory chat, cooperative negotiation, MandiGuard analysis |
| Cloud Text-to-Speech | Spoken diagnosis in 13 Indian languages |
| Cloud Translation API | Real-time language conversion |
| Vertex AI AutoML | Demand forecasting (trained on Agmarknet data) |
| BigQuery ML | Mandi price history + manipulation detection |
| Maps JavaScript API | Market map, nearby places |
| Routes API | Optimal mandi routing, carbon footprint calculation |
| Distance Matrix API | Cooperative farmer clustering |
| Firebase Firestore | Real-time produce listings, user profiles |
| Firebase Auth | Phone OTP login for farmers |
| Firebase Cloud Messaging | Spoilage alerts, deal notifications |
| Firebase Hosting | PWA deployment, global CDN |
| Cloud Run | Forecast API, MandiGuard scan backend |

---

## 🏆 SDGs Addressed (7)

- **SDG 1** — No Poverty (KrishiScore → micro-loan access)
- **SDG 2** — Zero Hunger (Crop Doctor prevents food loss)
- **SDG 3** — Good Health (Nearest hospitals, free OPD info)
- **SDG 8** — Decent Work (Fair pricing, no middlemen)
- **SDG 10** — Reduced Inequalities (MandiGuard stops cartel exploitation)
- **SDG 12** — Responsible Production (Spoilage prevention, carbon tracking)
- **SDG 13** — Climate Action (Carbon certificates, green routing)

---

## 🎬 3-Minute Demo Script

**[0:00-0:15]** Open app → Language chooser appears → select Marathi → entire UI converts to मराठी  
**[0:15-0:45]** Open Crop Doctor → photograph a leaf → Gemini diagnoses in Marathi → tap "आवाजात ऐका" → spoken diagnosis plays  
**[0:45-1:05]** Open Profit Tools → enter tomato 500kg, ₹26 mandi price, 80km distance → calculate → shows ❌ LOSS of ₹340 → "sell locally instead"  
**[1:05-1:25]** Open Cheating Detector → enter "agent told me ₹12/kg" → result: "🚨 Cheating! Actual rate ₹26/kg. Show this screen to agent!"  
**[1:25-1:55]** Open Govt Schemes → tap PM-KISAN → tap "Check Eligibility" → ✅ shows 5 steps to claim ₹6,000  
**[1:55-2:20]** Open MandiGuard → select APMC Nagpur + Tomato → scan → 87/100 risk score → charts show identical agent bids → "File complaint" button  
**[2:20-2:45]** Open International Loans → IFAD World Bank → 1.25%/year → tap View Steps → 5 simple steps to apply  
**[2:45-3:00]** "KrishiChain — 7 SDGs, 14 Google APIs, 13 languages. The first agri-tech platform built FOR farmers, not about them."

---

Built for Google Solution Challenge 2026 · Team KrishiChain  
*Voice-first · Literacy-free · Offline-capable · 22 languages*

 
