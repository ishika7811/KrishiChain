// Re-export from data.js for backward compatibility
export { LANGUAGES } from './data.js'

export function getT(langCode) {
  // Basic translations - full set in LangContext
  const base = {
    appName:'KrishiChain', tagline:'AI Farm Intelligence',
    dashboard:'Dashboard', listProduce:'List Produce', cropDoctor:'Crop Doctor',
    forecast:'AI Forecast', cooperative:'Cooperative', marketMap:'Market Map',
    carbonCert:'Carbon Cert', krishiScore:'KrishiScore', mandiGuard:'MandiGuard™',
    nearbyLandmarks:'Nearby Places', govSchemes:'Govt Schemes', profile:'My Profile',
    loans:'International Loans', profitCalc:'Profit Calculator', speakNow:'Speak Now',
    listening:'Listening…', analyzing:'Analysing…', goodMorning:'Good morning',
    yourFarm:'Your farm is ready', listingsActive:'Active listings',
    farmersOnline:'Farmers online', dealsToday:'Deals today', kgSaved:'Kg waste saved',
    searchSchemes:'Search schemes…', applyNow:'Apply Now', checkEligibility:'Check Eligibility',
    nearbyMandis:'Nearby Mandis', nearbyHospitals:'Hospitals', nearbyBanks:'Banks',
    nearbyColdStorage:'Cold Storage', rateThisPlace:'Rate this place',
    submitRating:'Submit Rating', netProfitAfterTransport:'Net profit after transport',
    calculateProfit:'Calculate', yourCrop:'Your Crop', quantity:'Quantity (kg)',
    fromDistrict:'From District', toMandi:'Destination Mandi', transportMode:'Transport Mode',
    loanAmount:'Loan Amount', interestRate:'Interest Rate', tenure:'Tenure (months)',
    bankName:'Bank Name', applyLoan:'Apply for Loan', saveProfile:'Save Profile',
    chooseLanguage:'Choose Your Language', continueBtn:'Continue →',
    amIBeingCheated:'Am I Being Cheated?', checkMandiRate:'Check Actual Rate',
    offlineReady:'Works Offline', voiceAssistant:'Voice Assistant',
  }
  const hi = {
    appName:'कृषिचेन', tagline:'AI किसान सहायक', dashboard:'डैशबोर्ड',
    listProduce:'फसल सूचीबद्ध करें', cropDoctor:'फसल डॉक्टर', forecast:'AI पूर्वानुमान',
    cooperative:'सहकारी समिति', marketMap:'बाज़ार नक्शा', carbonCert:'कार्बन प्रमाण',
    krishiScore:'कृषि स्कोर', mandiGuard:'मंडी गार्ड™', nearbyLandmarks:'पास की जगहें',
    govSchemes:'सरकारी योजनाएं', profile:'मेरी प्रोफाइल', loans:'कम ब्याज ऋण',
    profitCalc:'लाभ कैलकुलेटर', speakNow:'बोलें', listening:'सुन रहा हूँ…',
    analyzing:'विश्लेषण…', goodMorning:'नमस्ते', yourFarm:'आपकी फसल बेचने के लिए तैयार है',
    listingsActive:'सक्रिय सूचियां', farmersOnline:'किसान ऑनलाइन', dealsToday:'आज के सौदे',
    kgSaved:'बर्बादी बचाई', searchSchemes:'योजना खोजें…', applyNow:'अभी आवेदन करें',
    checkEligibility:'पात्रता जांचें', nearbyMandis:'पास की मंडियां',
    nearbyHospitals:'अस्पताल', nearbyBanks:'बैंक', nearbyColdStorage:'शीत भंडार',
    rateThisPlace:'रेटिंग दें', submitRating:'रेटिंग सबमिट करें',
    netProfitAfterTransport:'परिवहन के बाद शुद्ध लाभ', calculateProfit:'गणना करें',
    yourCrop:'आपकी फसल', quantity:'मात्रा (किलो)', fromDistrict:'जिला',
    toMandi:'मंडी', transportMode:'परिवहन', loanAmount:'ऋण राशि',
    interestRate:'ब्याज दर', tenure:'अवधि (महीने)', bankName:'बैंक',
    applyLoan:'ऋण के लिए आवेदन करें', saveProfile:'प्रोफाइल सेव करें',
    chooseLanguage:'अपनी भाषा चुनें', continueBtn:'आगे बढ़ें →',
    amIBeingCheated:'क्या धोखा हो रहा है?', checkMandiRate:'असली भाव जांचें',
  }
  const translations = { en: base, hi }
  const t = translations[langCode] || {}
  return { ...base, ...t }
}
