import { useState } from 'react'
import { getCarbonCertificate } from '../lib/gemini'
import { INDIAN_STATES as DISTRICTS } from '../lib/data'
import styles from './Carbon.module.css'

const RATING_COLORS = { 'A+':'#16a34a','A':'#22c55e','B':'#eab308','C':'#f97316' }
const RATING_BG     = { 'A+':'#dcfce7','A':'#f0fdf4','B':'#fefce8','C':'#fff7ed' }

export default function Carbon() {
  const [form, setForm] = useState({ from:'Nagpur', to:'Pune', distance:250, vehicle:'truck', cropKg:1000 })
  const [loading, setLoading] = useState(false)
  const [cert, setCert] = useState(null)

  function setF(k,v){ setForm(p=>({...p,[k]:v})) }

  async function generate() {
    setLoading(true)
    const res = await getCarbonCertificate(form.from, form.to, form.distance, form.vehicle, form.cropKg)
    setCert(res)
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🌿 Carbon Certificate</h1>
          <p className={styles.sub}>Track supply chain emissions · Unlock global export markets</p>
        </div>
        <div className={styles.badges}>
          <span className="chip chip-green">Google Routes API</span>
          <span className="chip chip-blue">IPCC Emission Factors</span>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={`card ${styles.formCard}`}>
            <div className={styles.formTitle}>Shipment details</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>From (district)</label>
              <select className={styles.select} value={form.from} onChange={e=>setF('from',e.target.value)}>
                {DISTRICTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>To (market/mandi)</label>
              <select className={styles.select} value={form.to} onChange={e=>setF('to',e.target.value)}>
                {DISTRICTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Distance (km): {form.distance} km</label>
              <input type="range" min="10" max="800" step="10" value={form.distance} onChange={e=>setF('distance',Number(e.target.value))} className={styles.slider}/>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Vehicle type</label>
              <select className={styles.select} value={form.vehicle} onChange={e=>setF('vehicle',e.target.value)}>
                {VEHICLES.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Crop quantity (kg): {form.cropKg.toLocaleString()} kg</label>
              <input type="range" min="100" max="10000" step="100" value={form.cropKg} onChange={e=>setF('cropKg',Number(e.target.value))} className={styles.slider}/>
            </div>
            <button className="btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}} onClick={generate} disabled={loading}>
              {loading ? '⚙️ Generating…' : '🌿 Generate Certificate'}
            </button>
          </div>
        </div>

        <div className={styles.right}>
          {!cert && !loading && (
            <div className={styles.emptyState}>
              <div style={{fontSize:52}}>🌱</div>
              <div className={styles.emptyTitle}>Generate your green certificate</div>
              <div className={styles.emptySub}>EU Green Deal and Walmart sustainability programs now require carbon certificates from suppliers. KrishiChain generates them instantly.</div>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}/>
              <div>Computing CO₂ footprint…</div>
            </div>
          )}

          {cert && !loading && (
            <div className={`fade-up ${styles.certWrap}`}>
              {/* Certificate card */}
              <div className={styles.certificate}>
                <div className={styles.certHeader}>
                  <div className={styles.certLogo}>🌿 KrishiChain</div>
                  <div className={styles.certBadge} style={{background:RATING_BG[cert.rating],color:RATING_COLORS[cert.rating]}}>
                    Grade {cert.rating}
                  </div>
                </div>
                <div className={styles.certTitle}>Carbon Footprint Certificate</div>
                <div className={styles.certId}>Certificate ID: {cert.id}</div>

                <div className={styles.certMetrics}>
                  <div className={styles.certMetric}>
                    <div className={styles.cmValue}>{cert.co2} kg</div>
                    <div className={styles.cmLabel}>Total CO₂</div>
                  </div>
                  <div className={styles.certMetric}>
                    <div className={styles.cmValue}>{cert.co2PerKg}</div>
                    <div className={styles.cmLabel}>kg CO₂ / kg crop</div>
                  </div>
                  <div className={styles.certMetric}>
                    <div className={styles.cmValue}>{cert.distanceKm} km</div>
                    <div className={styles.cmLabel}>Distance</div>
                  </div>
                </div>

                <div className={styles.certRow}><span>From</span><strong>{cert.from}</strong></div>
                <div className={styles.certRow}><span>To</span><strong>{cert.to}</strong></div>
                <div className={styles.certRow}><span>Vehicle</span><strong>{cert.vehicleType}</strong></div>
                <div className={styles.certRow}><span>Produce</span><strong>{cert.cropKg.toLocaleString()} kg</strong></div>

                <div className={styles.certFooter}>
                  <div className={styles.certVerified}>✓ Verified by KrishiChain AI · IPCC methodology</div>
                </div>
              </div>

              {/* Eligibility */}
              <div className={`card ${styles.eligCard}`}>
                <div className={styles.eligTitle}>🌍 Global market eligibility</div>
                {cert.eligible.map((e,i)=>(
                  <div key={i} className={styles.eligItem}>
                    <span className={styles.eligCheck}>✓</span>
                    <span>{e}</span>
                  </div>
                ))}
              </div>

              <button className="btn-primary" style={{width:'100%',justifyContent:'center'}}>
                📄 Download PDF Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
