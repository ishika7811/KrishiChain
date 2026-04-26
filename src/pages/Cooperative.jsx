import { useState } from 'react'
import { getCooperativeMatch } from '../lib/gemini'
import { ALL_CROPS as CROPS, INDIAN_STATES as DISTRICTS } from '../lib/data'
import styles from './Cooperative.module.css'

export default function Cooperative() {
  const [crop, setCrop] = useState('Tomato')
  const [qty, setQty] = useState(500)
  const [district, setDistrict] = useState('Nagpur')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [joined, setJoined] = useState(false)

  async function handleMatch() {
    setLoading(true)
    const res = await getCooperativeMatch(crop, district, qty)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🤝 Farmer Cooperative</h1>
          <p className={styles.sub}>AI-powered collective bargaining · Remove middlemen · Earn 15% more</p>
        </div>
        <div className={styles.badges}>
          <span className="chip chip-green">Gemini Negotiation Agent</span>
          <span className="chip chip-blue">Firestore Geo-Query</span>
        </div>
      </div>

      <div className={`card ${styles.form}`}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Your crop</label>
            <select className={styles.select} value={crop} onChange={e=>setCrop(e.target.value)}>
              {CROPS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Your quantity (kg)</label>
            <input className={styles.input} type="number" min="50" max="50000" value={qty} onChange={e=>setQty(Number(e.target.value))}/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Your district</label>
            <select className={styles.select} value={district} onChange={e=>setDistrict(e.target.value)}>
              {DISTRICTS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={handleMatch} disabled={loading} style={{marginTop:16}}>
          {loading ? '🔍 Finding nearby farmers…' : '🤖 Find Cooperative Match'}
        </button>
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}/>
          <div>AI is clustering nearby {crop} farmers in {district} district…</div>
        </div>
      )}

      {result && !loading && (
        <div className={`fade-up ${styles.results}`}>
          {/* Premium banner */}
          <div className={styles.premiumBanner}>
            <div className={styles.premiumLeft}>
              <div className={styles.premiumTitle}>Cooperative deal found!</div>
              <div className={styles.premiumSub}>Join to earn <strong>₹{result.projectedPrice}/kg</strong> instead of ₹{Math.round(result.projectedPrice - result.premiumPercent * result.projectedPrice / (100 + result.premiumPercent))}/kg individual price</div>
            </div>
            <div className={styles.premiumPct}>+{result.premiumPercent}%</div>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            {[
              {label:'Total produce', value:`${result.totalQuantity.toLocaleString()} kg`, icon:'🌾'},
              {label:'Projected price', value:`₹${result.projectedPrice}/kg`, icon:'💰'},
              {label:'Buyer', value:result.buyer.split(',')[0], icon:'🏢'},
              {label:'Deal expires', value:result.dealDeadline, icon:'⏰'},
            ].map((s,i)=>(
              <div key={i} className={`card ${styles.statCard}`}>
                <div className={styles.statIcon}>{s.icon}</div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Farmers in co-op */}
          <div className={`card ${styles.farmersCard}`}>
            <div className={styles.farmersTitle}>Farmers in this cooperative</div>
            <div className={styles.farmersList}>
              {/* Your entry */}
              <div className={`${styles.farmerRow} ${styles.you}`}>
                <div className={styles.farmerAvatar} style={{background:'#2d6a4f'}}>You</div>
                <div className={styles.farmerInfo}>
                  <div className={styles.farmerName}>You (Ramesh Patil)</div>
                  <div className={styles.farmerDist}>Your farm · {district}</div>
                </div>
                <div className={styles.farmerQty}>{qty.toLocaleString()} kg</div>
                <span className={`chip chip-green`}>You</span>
              </div>
              {result.farmers.map((f,i)=>(
                <div key={i} className={styles.farmerRow}>
                  <div className={styles.farmerAvatar}>{f.name[0]}</div>
                  <div className={styles.farmerInfo}>
                    <div className={styles.farmerName}>{f.name}</div>
                    <div className={styles.farmerDist}>{f.village} · {f.distance} km away</div>
                  </div>
                  <div className={styles.farmerQty}>{f.quantity.toLocaleString()} kg</div>
                  <div className={styles.trustScore}>⭐ {f.score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer info */}
          <div className={`card ${styles.buyerCard}`}>
            <div className={styles.buyerIcon}>🏢</div>
            <div>
              <div className={styles.buyerName}>{result.buyer}</div>
              <div className={styles.buyerSub}>Verified buyer · Pays within 3 days · UPI + bank transfer</div>
            </div>
          </div>

          {/* CTA */}
          {!joined ? (
            <button className="btn-primary" style={{fontSize:15,padding:'13px 28px'}} onClick={()=>setJoined(true)}>
              ✅ Join this cooperative deal
            </button>
          ) : (
            <div className={styles.joinedBanner}>
              🎉 You've joined the cooperative! Gemini AI will negotiate the bulk deal on your behalf within 2 hours.
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className={styles.explainer}>
          <h3 className={styles.explainerTitle}>How it works</h3>
          <div className={styles.explainerSteps}>
            {[
              {n:'1', text:'Enter your crop, quantity, and district'},
              {n:'2', text:'AI finds nearby farmers growing the same crop'},
              {n:'3', text:'Gemini negotiates a bulk deal with verified buyers'},
              {n:'4', text:'Payment split proportionally via UPI — no middlemen'},
            ].map(s=>(
              <div key={s.n} className={styles.explainerStep}>
                <div className={styles.stepNum}>{s.n}</div>
                <div className={styles.stepText}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
