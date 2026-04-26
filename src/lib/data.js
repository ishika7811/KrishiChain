export const LANGUAGES = [
  { code:'en',  name:'English',    native:'English',       flag:'🇬🇧', ttsLang:'en-IN',  sttLang:'en-IN'  },
  { code:'hi',  name:'Hindi',      native:'हिन्दी',         flag:'🇮🇳', ttsLang:'hi-IN',  sttLang:'hi-IN'  },
  { code:'mr',  name:'Marathi',    native:'मराठी',          flag:'🌾', ttsLang:'mr-IN',  sttLang:'mr-IN'  },
  { code:'bn',  name:'Bengali',    native:'বাংলা',           flag:'🐟', ttsLang:'bn-IN',  sttLang:'bn-IN'  },
  { code:'te',  name:'Telugu',     native:'తెలుగు',          flag:'🌶️', ttsLang:'te-IN',  sttLang:'te-IN'  },
  { code:'ta',  name:'Tamil',      native:'தமிழ்',           flag:'🌺', ttsLang:'ta-IN',  sttLang:'ta-IN'  },
  { code:'gu',  name:'Gujarati',   native:'ગુજરાતી',        flag:'🌿', ttsLang:'gu-IN',  sttLang:'gu-IN'  },
  { code:'kn',  name:'Kannada',    native:'ಕನ್ನಡ',           flag:'🏔️', ttsLang:'kn-IN',  sttLang:'kn-IN'  },
  { code:'ml',  name:'Malayalam',  native:'മലയാളം',         flag:'🥥', ttsLang:'ml-IN',  sttLang:'ml-IN'  },
  { code:'pa',  name:'Punjabi',    native:'ਪੰਜਾਬੀ',         flag:'🌻', ttsLang:'pa-IN',  sttLang:'pa-IN'  },
  { code:'or',  name:'Odia',       native:'ଓଡ଼ିଆ',           flag:'🌊', ttsLang:'or-IN',  sttLang:'or-IN'  },
  { code:'as',  name:'Assamese',   native:'অসমীয়া',         flag:'🍵', ttsLang:'as-IN',  sttLang:'as-IN'  },
  { code:'ur',  name:'Urdu',       native:'اردو',            flag:'✨', ttsLang:'ur-IN',  sttLang:'ur-IN'  },
  { code:'mai', name:'Maithili',   native:'मैथिली',          flag:'🌸', ttsLang:'hi-IN',  sttLang:'hi-IN'  },
  { code:'kok', name:'Konkani',    native:'कोंकणी',          flag:'🌴', ttsLang:'hi-IN',  sttLang:'hi-IN'  },
  { code:'mni', name:'Manipuri',   native:'মণিপুরী',         flag:'🎋', ttsLang:'hi-IN',  sttLang:'hi-IN'  },
  { code:'ne',  name:'Nepali',     native:'नेपाली',          flag:'⛰️', ttsLang:'ne-IN',  sttLang:'ne-IN'  },
  { code:'sat', name:'Santali',    native:'ᱥᱟᱱᱛᱟᱲᱤ',       flag:'🌳', ttsLang:'hi-IN',  sttLang:'hi-IN'  },
  { code:'ks',  name:'Kashmiri',   native:'کٲشُر',           flag:'❄️', ttsLang:'ur-IN',  sttLang:'ur-IN'  },
  { code:'doi', name:'Dogri',      native:'डोगरी',           flag:'🏔️', ttsLang:'hi-IN',  sttLang:'hi-IN'  },
  { code:'sd',  name:'Sindhi',     native:'سنڌي',            flag:'🌅', ttsLang:'ur-IN',  sttLang:'ur-IN'  },
  { code:'sa',  name:'Sanskrit',   native:'संस्कृतम्',        flag:'🕉️', ttsLang:'hi-IN',  sttLang:'hi-IN'  },
]

export const ALL_INDIA_MANDIS = [
  {id:'mh1', state:'Maharashtra',  district:'Nagpur',      name:'APMC Nagpur',              lat:21.145,lng:79.085, crops:['Tomato','Orange','Cotton'],    avgPrice:26,  type:'apmc'},
  {id:'mh2', state:'Maharashtra',  district:'Pune',        name:'APMC Pune (Gultekdi)',      lat:18.495,lng:73.828, crops:['Onion','Grapes','Tomato'],     avgPrice:28,  type:'apmc'},
  {id:'mh3', state:'Maharashtra',  district:'Nashik',      name:'Lasalgaon Onion Mandi',     lat:20.118,lng:74.031, crops:['Onion','Tomato','Grapes'],     avgPrice:22,  type:'apmc'},
  {id:'mh4', state:'Maharashtra',  district:'Kolhapur',    name:'APMC Kolhapur',             lat:16.705,lng:74.243, crops:['Sugarcane','Soybean','Jowar'], avgPrice:31,  type:'apmc'},
  {id:'mh5', state:'Maharashtra',  district:'Aurangabad',  name:'APMC Aurangabad',           lat:19.877,lng:75.343, crops:['Cotton','Soybean','Maize'],    avgPrice:45,  type:'apmc'},
  {id:'mh6', state:'Maharashtra',  district:'Amravati',    name:'APMC Amravati',             lat:20.930,lng:77.757, crops:['Cotton','Soybean','Tur'],      avgPrice:43,  type:'apmc'},
  {id:'mh7', state:'Maharashtra',  district:'Solapur',     name:'APMC Solapur',              lat:17.686,lng:75.906, crops:['Pomegranate','Onion','Jowar'], avgPrice:35,  type:'apmc'},
  {id:'mh8', state:'Maharashtra',  district:'Sangli',      name:'APMC Sangli (Turmeric)',    lat:16.865,lng:74.564, crops:['Turmeric','Grapes'],           avgPrice:88,  type:'apmc'},
  {id:'up1', state:'Uttar Pradesh',district:'Lucknow',     name:'Aishbagh Sabzi Mandi',      lat:26.850,lng:80.946, crops:['Potato','Tomato','Onion'],     avgPrice:18,  type:'sabzi'},
  {id:'up2', state:'Uttar Pradesh',district:'Agra',        name:'APMC Agra',                 lat:27.176,lng:78.008, crops:['Potato','Wheat','Mustard'],    avgPrice:2275,type:'apmc'},
  {id:'up3', state:'Uttar Pradesh',district:'Varanasi',    name:'APMC Varanasi',             lat:25.317,lng:83.013, crops:['Wheat','Rice','Potato'],       avgPrice:2275,type:'apmc'},
  {id:'up4', state:'Uttar Pradesh',district:'Meerut',      name:'APMC Meerut',               lat:28.984,lng:77.706, crops:['Sugarcane','Wheat','Potato'],  avgPrice:2280,type:'apmc'},
  {id:'up5', state:'Uttar Pradesh',district:'Gorakhpur',   name:'APMC Gorakhpur',            lat:26.760,lng:83.373, crops:['Wheat','Rice','Vegetables'],   avgPrice:2275,type:'apmc'},
  {id:'pb1', state:'Punjab',       district:'Ludhiana',    name:'Ludhiana Grain Market',     lat:30.901,lng:75.857, crops:['Wheat','Rice','Maize'],        avgPrice:2275,type:'grain'},
  {id:'pb2', state:'Punjab',       district:'Amritsar',    name:'APMC Amritsar',             lat:31.634,lng:74.873, crops:['Wheat','Rice','Potato'],       avgPrice:2278,type:'apmc'},
  {id:'pb3', state:'Punjab',       district:'Bathinda',    name:'APMC Bathinda',             lat:30.210,lng:74.945, crops:['Cotton','Wheat','Rice'],       avgPrice:6620,type:'apmc'},
  {id:'hr1', state:'Haryana',      district:'Sirsa',       name:'APMC Sirsa (Cotton)',       lat:29.533,lng:75.019, crops:['Cotton','Wheat','Rice'],       avgPrice:6620,type:'apmc'},
  {id:'hr2', state:'Haryana',      district:'Karnal',      name:'APMC Karnal',               lat:29.685,lng:76.990, crops:['Wheat','Rice','Sugarcane'],    avgPrice:2278,type:'apmc'},
  {id:'hr3', state:'Haryana',      district:'Hisar',       name:'APMC Hisar',                lat:29.153,lng:75.722, crops:['Cotton','Wheat','Mustard'],    avgPrice:6625,type:'apmc'},
  {id:'rj1', state:'Rajasthan',    district:'Jaipur',      name:'Muhana Mandi Jaipur',       lat:26.793,lng:75.757, crops:['Vegetables','Onion','Mustard'],avgPrice:22,  type:'sabzi'},
  {id:'rj2', state:'Rajasthan',    district:'Jodhpur',     name:'APMC Jodhpur',              lat:26.292,lng:73.016, crops:['Bajra','Moth','Guar'],         avgPrice:2415,type:'apmc'},
  {id:'rj3', state:'Rajasthan',    district:'Kota',        name:'APMC Kota (Coriander)',     lat:25.183,lng:75.849, crops:['Coriander','Soybean','Wheat'], avgPrice:9800,type:'apmc'},
  {id:'gj1', state:'Gujarat',      district:'Ahmedabad',   name:'Jamalpur Mandi',            lat:23.034,lng:72.586, crops:['Vegetables','Potato','Onion'], avgPrice:24,  type:'sabzi'},
  {id:'gj2', state:'Gujarat',      district:'Rajkot',      name:'APMC Rajkot',               lat:22.308,lng:70.800, crops:['Groundnut','Cotton','Castor'], avgPrice:5800,type:'apmc'},
  {id:'gj3', state:'Gujarat',      district:'Anand',       name:'APMC Anand (Potato)',       lat:22.557,lng:72.951, crops:['Potato','Tobacco'],            avgPrice:18,  type:'apmc'},
  {id:'mp1', state:'Madhya Pradesh',district:'Indore',     name:'Malwa Krishi Upaj Mandi',   lat:22.719,lng:75.857, crops:['Soybean','Wheat','Garlic'],    avgPrice:4600,type:'apmc'},
  {id:'mp2', state:'Madhya Pradesh',district:'Bhopal',     name:'APMC Bhopal',               lat:23.259,lng:77.412, crops:['Wheat','Soybean','Corn'],      avgPrice:2278,type:'apmc'},
  {id:'mp3', state:'Madhya Pradesh',district:'Ratlam',     name:'APMC Ratlam (Garlic)',      lat:23.331,lng:75.038, crops:['Garlic','Soybean','Wheat'],    avgPrice:8000,type:'apmc'},
  {id:'ka1', state:'Karnataka',    district:'Bengaluru',   name:'APMC Yeshwanthpur',         lat:13.028,lng:77.555, crops:['Tomato','Onion','Potato'],     avgPrice:28,  type:'apmc'},
  {id:'ka2', state:'Karnataka',    district:'Kolar',       name:'APMC Kolar',                lat:13.136,lng:78.132, crops:['Tomato','Potato','Onion'],     avgPrice:26,  type:'apmc'},
  {id:'ka3', state:'Karnataka',    district:'Dharwad',     name:'APMC Dharwad',              lat:15.458,lng:75.007, crops:['Cotton','Chilli','Groundnut'], avgPrice:6618,type:'apmc'},
  {id:'ap1', state:'Andhra Pradesh',district:'Guntur',     name:'APMC Guntur (Chilli)',      lat:16.307,lng:80.436, crops:['Chilli','Cotton','Tobacco'],   avgPrice:19000,type:'apmc'},
  {id:'ap2', state:'Andhra Pradesh',district:'Vijayawada', name:'APMC Krishna',              lat:16.506,lng:80.648, crops:['Rice','Maize','Vegetables'],   avgPrice:2183,type:'apmc'},
  {id:'tg1', state:'Telangana',    district:'Hyderabad',   name:'Bowenpally Sabzi Mandi',    lat:17.484,lng:78.477, crops:['Tomato','Onion','Vegetables'], avgPrice:25,  type:'sabzi'},
  {id:'tg2', state:'Telangana',    district:'Warangal',    name:'APMC Warangal',             lat:17.971,lng:79.595, crops:['Cotton','Rice','Chilli'],      avgPrice:6615,type:'apmc'},
  {id:'tn1', state:'Tamil Nadu',   district:'Chennai',     name:'Koyambedu Market',          lat:13.073,lng:80.199, crops:['Vegetables','Fruits','Flowers'],avgPrice:30, type:'sabzi'},
  {id:'tn2', state:'Tamil Nadu',   district:'Coimbatore',  name:'APMC Coimbatore',           lat:11.017,lng:76.955, crops:['Cotton','Vegetables','Coconut'],avgPrice:6618,type:'apmc'},
  {id:'tn3', state:'Tamil Nadu',   district:'Madurai',     name:'APMC Madurai',              lat:9.925, lng:78.119, crops:['Banana','Jasmine','Vegetables'],avgPrice:18, type:'apmc'},
  {id:'kl1', state:'Kerala',       district:'Thiruvananthapuram',name:'Chalai Market',       lat:8.490, lng:76.952, crops:['Vegetables','Coconut','Tapioca'],avgPrice:40,type:'sabzi'},
  {id:'kl2', state:'Kerala',       district:'Kochi',       name:'APMC Perumbavoor',          lat:10.109,lng:76.477, crops:['Rubber','Pepper','Coconut'],   avgPrice:180, type:'apmc'},
  {id:'wb1', state:'West Bengal',  district:'Kolkata',     name:'Koley Market Kolkata',      lat:22.561,lng:88.365, crops:['Potato','Vegetables','Fish'],   avgPrice:18,  type:'sabzi'},
  {id:'wb2', state:'West Bengal',  district:'Murshidabad', name:'APMC Murshidabad',          lat:24.183,lng:88.269, crops:['Rice','Jute','Mango'],         avgPrice:2180,type:'apmc'},
  {id:'br1', state:'Bihar',        district:'Patna',       name:'Patna Phool Mandi',         lat:25.594,lng:85.137, crops:['Wheat','Vegetables','Litchi'], avgPrice:2278,type:'grain'},
  {id:'od1', state:'Odisha',       district:'Bhubaneswar', name:'Unit-1 Market',             lat:20.296,lng:85.825, crops:['Rice','Vegetables','Potato'],   avgPrice:2180,type:'sabzi'},
  {id:'as1', state:'Assam',        district:'Guwahati',    name:'Fancy Bazar Market',        lat:26.186,lng:91.741, crops:['Rice','Vegetables','Tea'],      avgPrice:2183,type:'sabzi'},
  {id:'jh1', state:'Jharkhand',    district:'Ranchi',      name:'Ratu Road Mandi',           lat:23.344,lng:85.309, crops:['Vegetables','Potato','Rice'],   avgPrice:24,  type:'sabzi'},
  {id:'cg1', state:'Chhattisgarh', district:'Raipur',      name:'Kankali Talaab Mandi',      lat:21.251,lng:81.629, crops:['Rice','Vegetables','Maize'],    avgPrice:2183,type:'sabzi'},
  {id:'uk1', state:'Uttarakhand',  district:'Dehradun',    name:'Paltan Bazaar Mandi',       lat:30.324,lng:78.044, crops:['Vegetables','Apple','Rice'],    avgPrice:32,  type:'sabzi'},
  {id:'hp1', state:'Himachal Pradesh',district:'Shimla',   name:'Dhalli Apple Mandi',        lat:31.104,lng:77.173, crops:['Apple','Potato','Pea'],         avgPrice:45,  type:'apmc'},
  {id:'jk1', state:'J&K',          district:'Srinagar',    name:'Parimpore Mandi',           lat:34.117,lng:74.844, crops:['Apple','Cherry','Walnut'],      avgPrice:60,  type:'apmc'},
  {id:'jk2', state:'J&K',          district:'Jammu',       name:'Narwal Mandi',              lat:32.735,lng:74.868, crops:['Wheat','Vegetables','Rice'],    avgPrice:2277,type:'apmc'},
  {id:'dl1', state:'Delhi',         district:'New Delhi',  name:"Azadpur Mandi (Asia's Largest)",lat:28.715,lng:77.163,crops:['All Vegetables','All Fruits'],avgPrice:30,type:'apmc'},
  {id:'ga1', state:'Goa',           district:'Panaji',     name:'Panaji Municipal Market',   lat:15.499,lng:73.829, crops:['Cashew','Coconut','Vegetables'],avgPrice:80, type:'sabzi'},
  {id:'mn1', state:'Manipur',       district:'Imphal',     name:'Ima Keithel Market',        lat:24.808,lng:93.941, crops:['Rice','Vegetables','Potato'],   avgPrice:35,  type:'sabzi'},
  {id:'mg1', state:'Meghalaya',     district:'Shillong',   name:'Iewduh Bazar',              lat:25.574,lng:91.893, crops:['Potato','Ginger','Vegetables'], avgPrice:28,  type:'sabzi'},
]

export const MSP_RATES = {
  Wheat:2275, Rice:2183, Paddy:2183, Maize:2090, Bajra:2625, Jowar:3180,
  Ragi:4291, Cotton:6620, Soybean:4600, Groundnut:6783, Mustard:5650,
  Sunflower:6760, 'Tur (Arhar)':7000, Moong:8558, Urad:7400, Gram:5440,
}

export const ALL_CROPS = [
  'Tomato','Onion','Potato','Wheat','Rice','Cotton','Soybean','Maize','Bajra',
  'Jowar','Sugarcane','Groundnut','Mustard','Sunflower','Tur (Arhar)','Moong',
  'Urad','Gram','Chilli','Turmeric','Ginger','Garlic','Banana','Mango',
  'Apple','Grapes','Orange','Pomegranate','Coconut','Rubber','Tea','Jute','Ragi',
]

export const INDIAN_STATES = [...new Set(ALL_INDIA_MANDIS.map(m => m.state))].sort()

export function getNearestMandis(lat, lng, crop = null, limit = 15) {
  let mandis = crop
    ? ALL_INDIA_MANDIS.filter(m => m.crops.some(c => c.toLowerCase().includes(crop.toLowerCase())))
    : ALL_INDIA_MANDIS
  return mandis
    .map(m => ({ ...m, distKm: Math.round(Math.sqrt(Math.pow((m.lat-lat)*111,2) + Math.pow((m.lng-lng)*85,2))) }))
    .sort((a,b) => a.distKm - b.distKm)
    .slice(0, limit)
}

export const URGENCY_COLORS = {
  critical: { bg:'#fef2f2', text:'#991b1b', border:'#fca5a5', label:'Critical' },
  high:     { bg:'#fff7ed', text:'#9a3412', border:'#fdba74', label:'Urgent'   },
  medium:   { bg:'#fefce8', text:'#854d0e', border:'#fde047', label:'Watch'    },
  safe:     { bg:'#f0fdf4', text:'#166534', border:'#86efac', label:'Safe'     },
}

export const MOCK_LISTINGS = [
  { id:'l1', farmer:'Ramesh Patil',   crop:'Tomato',  qty:1200, price:26,   district:'Nagpur',     urgency:'high',     daysLeft:2,  lat:21.14,lng:79.08, listed:'2h ago' },
  { id:'l2', farmer:'Sunita Devi',    crop:'Onion',   qty:800,  price:22,   district:'Nashik',     urgency:'safe',     daysLeft:8,  lat:20.00,lng:73.79, listed:'4h ago' },
  { id:'l3', farmer:'Vijay Kumar',    crop:'Potato',  qty:2000, price:18,   district:'Agra',       urgency:'medium',   daysLeft:4,  lat:27.18,lng:78.01, listed:'1h ago' },
  { id:'l4', farmer:'Gurpreet Singh', crop:'Wheat',   qty:5000, price:2280, district:'Ludhiana',   urgency:'safe',     daysLeft:60, lat:30.90,lng:75.86, listed:'1d ago' },
  { id:'l5', farmer:'Arjun Yadav',    crop:'Mango',   qty:300,  price:68,   district:'Aurangabad', urgency:'critical', daysLeft:1,  lat:19.87,lng:75.34, listed:'30m ago'},
  { id:'l6', farmer:'Meena Kumari',   crop:'Cotton',  qty:800,  price:6600, district:'Bathinda',   urgency:'safe',     daysLeft:30, lat:30.21,lng:74.95, listed:'3h ago' },
  { id:'l7', farmer:'Ravi Shankar',   crop:'Chilli',  qty:600,  price:185,  district:'Guntur',     urgency:'medium',   daysLeft:5,  lat:16.31,lng:80.44, listed:'2h ago' },
]
