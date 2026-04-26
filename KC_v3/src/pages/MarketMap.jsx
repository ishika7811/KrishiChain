import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useLang } from '../lib/LangContext'
import { ALL_INDIA_MANDIS, MOCK_LISTINGS, URGENCY_COLORS, INDIAN_STATES, ALL_CROPS } from '../lib/data'
import styles from './MarketMap.module.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createDot(color, size=12) {
  return L.divIcon({ html:`<div style="width:${size}px;height:${size}px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`, className:'', iconSize:[size,size], iconAnchor:[size/2,size/2] })
}

const TYPE_COLORS = { apmc:'#2d6a4f', grain:'#d97706', sabzi:'#7c3aed', other:'#64748b' }

function FitBounds({ mandis }) {
  const map = useMap()
  if (mandis.length > 0) {
    const bounds = mandis.map(m => [m.lat, m.lng])
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 })
  }
  return null
}

export default function MarketMap() {
  const { t, langCode } = useLang()
  const [stateFilter, setStateFilter] = useState('ALL')
  const [cropFilter, setCropFilter] = useState('ALL')
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return ALL_INDIA_MANDIS.filter(m => {
      if (stateFilter !== 'ALL' && m.state !== stateFilter) return false
      if (cropFilter !== 'ALL' && !m.crops.some(c => c.toLowerCase().includes(cropFilter.toLowerCase()))) return false
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.district.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [stateFilter, cropFilter, search])

  const title = langCode==='hi'?'बाज़ार नक्शा — पूरा भारत':langCode==='mr'?'बाजार नकाशा — संपूर्ण भारत':langCode==='pa'?'ਬਾਜ਼ਾਰ ਨਕਸ਼ਾ — ਪੂਰਾ ਭਾਰਤ':langCode==='ml'?'ഭൂപടം — ഇന്ത്യ':langCode==='ta'?'வரைபடம் — இந்தியா':'Market Map — All India'

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🗺️ {title}</h1>
          <p className={styles.sub}>{filtered.length} {langCode==='hi'?'मंडियां दिख रही हैं':langCode==='mr'?'मंड्या दाखवत आहे':langCode==='pa'?'ਮੰਡੀਆਂ ਦਿਖਾ ਰਿਹਾ ਹੈ':'mandis shown'} · {ALL_INDIA_MANDIS.length} {langCode==='hi'?'कुल':'total'}</p>
        </div>
        <div className={styles.badges}>
          <span className="chip chip-green">Google Maps API</span>
          <span className="chip chip-blue">{ALL_INDIA_MANDIS.length} Mandis</span>
          <span className="chip chip-purple">All India</span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input className={styles.searchInput} placeholder={langCode==='hi'?'मंडी या जिला खोजें…':langCode==='mr'?'मंडी किंवा जिल्हा शोधा…':'Search mandi or district…'} value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className={styles.filterSelect} value={stateFilter} onChange={e=>setStateFilter(e.target.value)}>
          <option value="ALL">{langCode==='hi'?'सभी राज्य':langCode==='mr'?'सर्व राज्ये':langCode==='pa'?'ਸਾਰੇ ਰਾਜ':'All States'}</option>
          {INDIAN_STATES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select className={styles.filterSelect} value={cropFilter} onChange={e=>setCropFilter(e.target.value)}>
          <option value="ALL">{langCode==='hi'?'सभी फसलें':langCode==='mr'?'सर्व पिके':'All Crops'}</option>
          {ALL_CROPS.slice(0,20).map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className={styles.layout}>
        {/* Map */}
        <div className={styles.mapBox}>
          <MapContainer center={[22.5, 82.0]} zoom={5} style={{height:'100%',width:'100%',borderRadius:'var(--radius)',zIndex:1}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap"/>
            {stateFilter !== 'ALL' && filtered.length > 0 && <FitBounds mandis={filtered}/>}

            {/* All mandi dots */}
            {filtered.map(m => (
              <Marker key={m.id} position={[m.lat,m.lng]} icon={createDot(TYPE_COLORS[m.type]||TYPE_COLORS.other,selected===m.id?16:12)} eventHandlers={{click:()=>setSelected(selected===m.id?null:m.id)}}>
                <Popup>
                  <div style={{fontFamily:'sans-serif',minWidth:180}}>
                    <strong style={{fontSize:14,color:'#0d2818'}}>{m.name}</strong>
                    <div style={{fontSize:11,color:'#666',margin:'3px 0'}}>{m.district}, {m.state}</div>
                    <div style={{fontSize:12,color:'#2d6a4f',fontWeight:600}}>
                      {m.crops.slice(0,3).join(' · ')}
                    </div>
                    {m.avgPrice < 1000 && <div style={{fontSize:12,marginTop:3}}>Avg: ₹{m.avgPrice}/kg</div>}
                    {m.avgPrice >= 1000 && <div style={{fontSize:12,marginTop:3}}>Avg: ₹{m.avgPrice}/quintal</div>}
                    <div style={{fontSize:11,marginTop:4,background:'#f0fdf4',padding:'3px 8px',borderRadius:99,display:'inline-block',color:'#166534',fontWeight:600,textTransform:'uppercase'}}>
                      {m.type}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Live produce listings */}
            {MOCK_LISTINGS.map(l => {
              const u = URGENCY_COLORS[l.urgency]
              return (
                <Marker key={l.id} position={[l.lat,l.lng]} icon={createDot(l.urgency==='critical'?'#ef4444':l.urgency==='high'?'#f97316':l.urgency==='medium'?'#eab308':'#22c55e',10)}>
                  <Popup>
                    <div style={{fontFamily:'sans-serif'}}>
                      <strong>{l.crop}</strong>
                      <div style={{fontSize:12,color:'#666'}}>{l.farmer} · {l.district}</div>
                      <div style={{fontSize:12}}>{l.qty.toLocaleString()} kg · ₹{l.price}/kg</div>
                      <div style={{marginTop:5,display:'inline-block',background:u.bg,color:u.text,padding:'2px 8px',borderRadius:99,fontSize:11,fontWeight:600}}>{u.label} · {l.daysLeft}d</div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>

          {/* Legend */}
          <div className={styles.legend}>
            {[['#2d6a4f','APMC'],['#d97706','Grain'],['#7c3aed','Sabzi'],['#22c55e','Live listing'],['#ef4444','Critical']].map(([c,l])=>(
              <div key={l} className={styles.legendItem}>
                <div className={styles.legendDot} style={{background:c}}/>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar list */}
        <div className={styles.sideList}>
          <div className={styles.listHeader}>{filtered.length} {langCode==='hi'?'मंडियां':'Mandis'}</div>
          <div className={styles.listScroll}>
            {filtered.slice(0,40).map(m => (
              <div key={m.id} className={`${styles.mandiRow} ${selected===m.id?styles.mandiSelected:''}`} onClick={()=>setSelected(selected===m.id?null:m.id)}>
                <div className={styles.mandiDot} style={{background:TYPE_COLORS[m.type]||'#64748b'}}/>
                <div className={styles.mandiInfo}>
                  <div className={styles.mandiName}>{m.name}</div>
                  <div className={styles.mandiMeta}>{m.district}, {m.state}</div>
                  <div className={styles.mandiCrops}>{m.crops.slice(0,2).join(', ')}</div>
                </div>
                <div className={styles.mandiPrice}>
                  <div className={styles.mpVal}>{m.avgPrice >= 1000 ? `₹${m.avgPrice}` : `₹${m.avgPrice}/kg`}</div>
                  <div className={styles.mpType}>{m.type.toUpperCase()}</div>
                </div>
              </div>
            ))}
            {filtered.length > 40 && <div className={styles.moreNote}>+{filtered.length-40} more mandis — use filters to narrow</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
