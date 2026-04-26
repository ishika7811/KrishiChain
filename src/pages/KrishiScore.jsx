import { useState } from 'react'
import { computeKrishiScore } from '../lib/gemini'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import styles from './KrishiScore.module.css'

function ScoreRing({ score }) {
  const r = 70, circ = 2 * Math.PI * r
  const pct = score / 100
  const dash = pct * circ
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444'
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10"/>
      <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 90 90)" style={{transition:'stroke-dasharray .8s ease'}}/>
      <text x="90" y="85" textAnchor="middle" fontSize="34" fontWeight="700" fill={color}>{score}</text>
      <text x="90" y="106" textAnchor="middle" fontSize="12" fill="#718096">/ 100</text>
    </svg>
  )
}

export default function KrishiScore() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleCompute() {
    setLoading(true)
    const res = await computeKrishiScore('farmer_001')
    setResult(res)
    setLoading(false)
  }

  const radarData = result ? [
    { subject: 'Listings', A: result.breakdown.listingRegularity },
    { subject: 'Quality', A: result.breakdown.cropQuality },
    { subject: 'Delivery', A: result.breakdown.onTimeDelivery },
    { subject: 'Cooperative', A: result.breakdown.cooperativeParticipation },
    { subject: 'Markets', A: result.breakdown.marketDiversity },
  ] : []

  const scoreLabel = result
    ? result.score >= 80 ? { label:'Excellent', color:'#16a34a' }
    : result.score >= 60 ? { label:'Good', color:'#22c55e' }
    : result.score >= 40 ? { label:'Fair', color:'#eab308' }
    : { label:'Needs improvement', color:'#ef4444' }
    : null

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>⭐ KrishiScore</h1>
          <p className={styles.sub}>AI-powered farm credit score · Unlock micro-loans without collateral</p>
        </div>
        <div className={styles.badges}>
          <span className="chip chip-amber">Vertex AI</span>
          <span className="chip chip-purple">NBFC Integration</span>
        </div>
      </div>

      {!result && !loading && (
        <div className={styles.intro}>
          <div className={`card ${styles.introCard}`}>
            <div className={styles.introIcon}>⭐</div>
            <h2 className={styles.introTitle}>Your farming identity, quantified</h2>
            <p className={styles.introText}>
              KrishiScore uses your KrishiChain activity — listing consistency, crop quality, on-time delivery, and cooperative participation — to build a credit profile that banks and NBFCs can trust.
            </p>
            <div className={styles.introStats}>
              {[
                {icon:'🏦', stat:'₹35K–1.2L', sub:'Typical loan eligibility'},
                {icon:'⚡', stat:'48 hours', sub:'Loan approval time'},
                {icon:'📊', stat:'0% collateral', sub:'No land papers needed'},
              ].map((s,i) => (
                <div key={i} className={styles.introStat}>
                  <div className={styles.isIcon}>{s.icon}</div>
                  <div className={styles.isStat}>{s.stat}</div>
                  <div className={styles.isSub}>{s.sub}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{fontSize:15,padding:'13px 28px'}} onClick={handleCompute}>
              🔍 Compute My KrishiScore
            </button>
          </div>

          <div className={styles.howList}>
            <div className={styles.howTitle}>What goes into your score</div>
            {[
              {icon:'📋', label:'Listing regularity', desc:'How consistently you list produce'},
              {icon:'🌱', label:'Crop quality index', desc:'Disease rate + crop doctor usage'},
              {icon:'🚚', label:'On-time delivery', desc:'Fulfilling buyer commitments'},
              {icon:'🤝', label:'Cooperative activity', desc:'Participation in bulk deals'},
              {icon:'🗺️', label:'Market diversity', desc:'Selling across multiple channels'},
            ].map((h,i) => (
              <div key={i} className={styles.howItem}>
                <div className={styles.howIcon}>{h.icon}</div>
                <div>
                  <div className={styles.howLabel}>{h.label}</div>
                  <div className={styles.howDesc}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}/>
          <div>Vertex AI is computing your score…</div>
        </div>
      )}

      {result && !loading && (
        <div className={`fade-up ${styles.results}`}>
          <div className={styles.topRow}>
            <div className={`card ${styles.scoreCard}`}>
              <ScoreRing score={result.score}/>
              <div className={styles.scoreLabel} style={{color: scoreLabel.color}}>{scoreLabel.label}</div>
              <div className={styles.scoreDesc}>KrishiScore™</div>
            </div>

            <div className={styles.radarCard}>
              <div className={styles.radarTitle}>Score breakdown</div>
              <ResponsiveContainer width="100%" height={210}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb"/>
                  <PolarAngleAxis dataKey="subject" tick={{fontSize:11, fill:'#718096'}}/>
                  <Radar name="Score" dataKey="A" stroke="#40916c" fill="#40916c" fillOpacity={0.25} strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
              {Object.entries(result.breakdown).map(([k,v]) => (
                <div key={k} className={styles.breakRow}>
                  <div className={styles.breakLabel}>{k.replace(/([A-Z])/g,' $1').trim()}</div>
                  <div className={styles.breakBar}><div className={styles.breakFill} style={{width:`${v}%`, background: v>=70?'#22c55e':v>=50?'#eab308':'#f97316'}}/></div>
                  <div className={styles.breakVal}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`card ${styles.loanCard}`}>
            <div className={styles.loanLeft}>
              <div className={styles.loanTitle}>💰 Loan eligibility</div>
              <div className={styles.loanRange}>{result.loanEligibility}</div>
              <div className={styles.loanSub}>Based on your KrishiScore of {result.score}/100</div>
            </div>
            <div className={styles.loanPartners}>
              <div className={styles.lpTitle}>Partner lenders</div>
              {result.partners.map((p,i) => (
                <div key={i} className={styles.lpItem}>🏦 {p}</div>
              ))}
            </div>
          </div>

          <div className={`card ${styles.tipCard}`}>
            <div className={styles.tipIcon}>💡</div>
            <div>
              <div className={styles.tipTitle}>How to improve your score</div>
              <div className={styles.tipText}>{result.tip}</div>
            </div>
          </div>

          <button className={styles.retryBtn} onClick={() => setResult(null)}>
            Recalculate score
          </button>
        </div>
      )}
    </div>
  )
}
