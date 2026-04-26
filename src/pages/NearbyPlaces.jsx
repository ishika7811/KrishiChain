import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import styles from './NearbyPlaces.module.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const TYPES = [
  {id:'all',   icon:'📍', labelEn:'All',           labelHi:'सभी',         labelMr:'सर्व',      labelPa:'ਸਾਰੇ',      labelMl:'എല്ലാം',     labelTa:'அனைத்தும்'},
  {id:'mandi', icon:'🏪', labelEn:'Mandis',         labelHi:'मंडियां',     labelMr:'मंड्या',    labelPa:'ਮੰਡੀਆਂ',   labelMl:'മണ്ടി',      labelTa:'மண்டிகள்'},
  {id:'bank',  icon:'🏦', labelEn:'Banks',          labelHi:'बैंक',        labelMr:'बँका',      labelPa:'ਬੈਂਕ',      labelMl:'ബാങ്ക്',    labelTa:'வங்கிகள்'},
  {id:'hospital',icon:'🏥',labelEn:'Hospitals',    labelHi:'अस्पताल',     labelMr:'रुग्णालये', labelPa:'ਹਸਪਤਾਲ',   labelMl:'ആശുപ്ത്രി',  labelTa:'மருத்துவமனை'},
  {id:'cold',  icon:'❄️', labelEn:'Cold Storage',   labelHi:'शीतगृह',      labelMr:'शीतगृह',    labelPa:'ਠੰਡਾ ਭੰਡਾਰ',labelMl:'ശീതഗൃഹം', labelTa:'குளிர் சேமிப்பு'},
  {id:'csc',   icon:'💻', labelEn:'CSC / Jan Seva', labelHi:'CSC केंद्र',  labelMr:'CSC केंद्र',labelPa:'CSC ਕੇਂਦਰ', labelMl:'CSC കേന്ദ്രം',labelTa:'CSC மையம்'},
]

const PLACES = [
  {id:'p1',type:'mandi',  name:'APMC Nagpur Main',      dist:2.1,rating:4.2,reviews:142,address:'Civil Lines, Nagpur', lat:21.145,lng:79.085,open:true,info:'Tomato ₹26/kg today',ratedByMe:0},
  {id:'p2',type:'mandi',  name:'Kalamna Market Yard',   dist:4.8,rating:3.8,reviews:89, address:'Kalamna, Nagpur',    lat:21.100,lng:79.110,open:true,info:'Onion ₹22/kg today',ratedByMe:0},
  {id:'p3',type:'bank',   name:'SBI Agriculture Branch',dist:1.2,rating:4.5,reviews:203,address:'Gandhi Nagar',       lat:21.150,lng:79.075,open:true,info:'KCC loans available',ratedByMe:0},
  {id:'p4',type:'bank',   name:'NABARD Rural Bank',     dist:3.4,rating:4.1,reviews:67, address:'Dharampeth, Nagpur', lat:21.130,lng:79.055,open:true,info:'IFAD & NABARD loans',ratedByMe:0},
  {id:'p5',type:'hospital',name:'District Civil Hospital',dist:1.8,rating:3.9,reviews:315,address:'Mayo Road',        lat:21.145,lng:79.100,open:true,info:'Free OPD for farmers',ratedByMe:0},
  {id:'p6',type:'cold',   name:'National Cold Storage', dist:5.2,rating:4.4,reviews:78, address:'Butibori, Nagpur',   lat:21.080,lng:79.130,open:true,info:'₹2.5/kg/month',ratedByMe:0},
  {id:'p7',type:'csc',    name:'Jan Seva Kendra',       dist:0.9,rating:4.7,reviews:421,address:'Sitabuldi, Nagpur',  lat:21.155,lng:79.090,open:true,info:'PM-KISAN, Aadhaar',ratedByMe:0},
  {id:'p8',type:'csc',    name:'Aaple Sarkar Kendra',   dist:2.3,rating:4.3,reviews:188,address:'Dharampeth',         lat:21.138,lng:79.068,open:true,info:'All govt certificates',ratedByMe:0},
]

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(s => (
        <button key={s} className={`${styles.star} ${(hover||value)>=s?styles.starActive:''}`}
          onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)} onClick={()=>onChange(s)}>
          ★
        </button>
      ))}
    </div>
  )
}

function createDot(color) {
  return L.divIcon({html:`<div style="width:12px;height:12px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,className:'',iconSize:[12,12],iconAnchor:[6,6]})
}
const TYPE_COLORS = {mandi:'#2d6a4f',bank:'#1d4ed8',hospital:'#dc2626',cold:'#0891b2',csc:'#7c3aed'}

export default function NearbyPlaces() {
  const { t, langCode } = useLang()
  const [filter, setFilter] = useState('all')
  const [places, setPlaces] = useState(PLACES)
  const [selected, setSelected] = useState(null)
  const [ratingInput, setRatingInput] = useState(0)
  const [ratingDone, setRatingDone] = useState({})

  const typeLabel = tp => {
    const lk = `label${langCode.charAt(0).toUpperCase()+langCode.slice(1)}`
    return tp[lk] || tp.labelEn
  }

  function submitRating(placeId) {
    if (!ratingInput) return
    setPlaces(prev => prev.map(p => p.id===placeId ? {...p, rating:Math.round(((p.rating*p.reviews+ratingInput)/(p.reviews+1))*10)/10, reviews:p.reviews+1, ratedByMe:ratingInput} : p))
    setRatingDone(prev => ({...prev,[placeId]:ratingInput}))
    setRatingInput(0)
  }

  const filtered = filter==='all' ? places : places.filter(p=>p.type===filter)
  const sorted = [...filtered].sort((a,b)=>a.dist-b.dist)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>📍 {langCode==='hi'?'पास की जगहें':langCode==='mr'?'जवळची ठिकाणे':langCode==='pa'?'ਨੇੜੇ ਦੀਆਂ ਥਾਵਾਂ':langCode==='ml'?'സമീപ സ്ഥലങ്ങൾ':langCode==='ta'?'அருகில் உள்ள இடங்கள்':'Nearby Places'}</h1>
          <p className={styles.sub}>{langCode==='hi'?'मंडियां, बैंक, अस्पताल, CSC केंद्र — आपके पास':'Mandis, Banks, Hospitals, CSC Centres near you — rate & find the best'}</p>
        </div>
      </div>

      {/* Type filter */}
      <div className={styles.filterRow}>
        {TYPES.map(tp => (
          <button key={tp.id} className={`${styles.filterBtn} ${filter===tp.id?styles.filterActive:''}`} onClick={()=>setFilter(tp.id)}>
            {tp.icon} {typeLabel(tp)}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Map */}
        <div className={styles.mapBox}>
          <MapContainer center={[21.13, 79.08]} zoom={12} style={{height:'100%',width:'100%',borderRadius:'var(--radius)',zIndex:1}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap"/>
            {sorted.map(p => (
              <Marker key={p.id} position={[p.lat,p.lng]} icon={createDot(TYPE_COLORS[p.type]||'#2d6a4f')} eventHandlers={{click:()=>setSelected(p.id)}}>
                <Popup>
                  <div style={{fontFamily:'sans-serif',minWidth:160}}>
                    <strong style={{fontSize:14}}>{p.name}</strong>
                    <div style={{fontSize:12,margin:'3px 0',color:'#666'}}>{p.address}</div>
                    <div style={{fontSize:12}}>⭐ {p.rating} ({p.reviews} reviews)</div>
                    <div style={{fontSize:12,marginTop:3,color:'#2d6a4f'}}>{p.info}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
            <Circle center={[21.13,79.08]} radius={3000} pathOptions={{color:'#3a9668',fillOpacity:.05,weight:1.5,dashArray:'6 4'}}/>
          </MapContainer>
        </div>

        {/* List */}
        <div className={styles.list}>
          {sorted.map(p => {
            const col = TYPE_COLORS[p.type]||'#2d6a4f'
            const tp = TYPES.find(t=>t.id===p.type)
            const isSelected = selected===p.id
            return (
              <div key={p.id} className={`${styles.placeCard} ${isSelected?styles.placeSelected:''}`} onClick={()=>setSelected(isSelected?null:p.id)}>
                <div className={styles.placeTop}>
                  <div className={styles.placeIcon} style={{background:`${col}18`,color:col}}>{tp?.icon||'📍'}</div>
                  <div className={styles.placeMid}>
                    <div className={styles.placeName}>{p.name}</div>
                    <div className={styles.placeAddr}>{p.address}</div>
                    <div className={styles.placeInfo}>{p.info}</div>
                  </div>
                  <div className={styles.placeRight}>
                    <div className={styles.placeDist}>{p.dist} km</div>
                    <div className={styles.placeRating}>⭐ {p.rating}</div>
                    <div className={styles.placeReviews}>{p.reviews} {langCode==='hi'?'समीक्षाएं':'reviews'}</div>
                  </div>
                </div>

                {isSelected && (
                  <div className={`${styles.ratingPanel} fade-up`}>
                    <div className={styles.rpTitle}>{t.rateThisPlace}</div>
                    {ratingDone[p.id] ? (
                      <div className={styles.rpDone}>✅ {langCode==='hi'?'रेटिंग दी:':`Rated ${ratingDone[p.id]}/5`} {'★'.repeat(ratingDone[p.id])}</div>
                    ) : (
                      <div className={styles.rpRow}>
                        <StarRating value={ratingInput} onChange={setRatingInput}/>
                        <button className={styles.rateSubmit} onClick={()=>submitRating(p.id)} disabled={!ratingInput}>{t.submitRating}</button>
                      </div>
                    )}
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`} target="_blank" rel="noopener" className={styles.directionsBtn}>
                      🗺️ {langCode==='hi'?'रास्ता देखें':'Get Directions'}
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
