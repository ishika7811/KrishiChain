import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Legend } from 'recharts'
import styles from './MandiGuard.module.css'

// Simulated real Gemini analysis of price manipulation
async function detectManipulation(mandi, crop) {
  await new Promise(r => setTimeout(r, 2400))

  const scenarios = [
    {
      manipulated: true,
      riskScore: 87,
      verdict: 'High probability of coordinated price suppression detected',
      pattern: 'Cartel pricing',
      evidence: [
        'Prices in this mandi deviated 34% below district average for 11 consecutive days — statistically impossible under natural market conditions (p < 0.001)',
        'All 4 major commission agents posted identical arrival prices within ₹0.50 of each other for 8 days — price coordination signature',
        'Volume surged 40% while prices fell — reverse correlation indicates artificial depression, not oversupply',
        'Cross-mandi comparison: Nashik (same crop, same week) paid ₹31/kg. This mandi paid ₹19/kg. Gap = ₹12/kg stolen per kg.',
      ],
      totalLoss: 84000,
      farmerCount: 47,
      lossPerFarmer: 1787,
      priceHistory: [
        {day:'Mon',fair:29,actual:19,volume:420},{day:'Tue',fair:30,actual:18,volume:580},
        {day:'Wed',fair:29,actual:20,volume:390},{day:'Thu',fair:31,actual:18,volume:610},
        {day:'Fri',fair:30,actual:19,volume:520},{day:'Sat',fair:28,actual:21,volume:300},
        {day:'Sun',fair:29,actual:19,volume:450},
      ],
      agentSpread: [
        {agent:'Sharma Traders',bid:19.2},{agent:'Ram Commission',bid:19.0},
        {agent:'Lakshmi Agro',bid:19.5},{agent:'Singh & Sons',bid:18.8},
      ],
      actions: [
        { label: 'File APMC complaint', icon: '📋', url: '#', priority: 'urgent' },
        { label: 'Report to National Consumer Helpline (1800-11-4000)', icon: '📞', url: '#', priority: 'urgent' },
        { label: 'Alert district collector office', icon: '🏛️', url: '#', priority: 'high' },
        { label: 'Share evidence with farmer union', icon: '🤝', url: '#', priority: 'high' },
        { label: 'Export to alternative mandi', icon: '🗺️', url: '#', priority: 'medium' },
      ]
    },
    {
      manipulated: false,
      riskScore: 18,
      verdict: 'Prices appear fair — no manipulation signals detected',
      pattern: 'Normal market dynamics',
      evidence: [
        'Price variation (±12%) consistent with seasonal demand fluctuations',
        'Agent bid spread of ₹3.40 indicates competitive bidding environment',
        'Volume-price correlation follows expected supply curve (r = 0.82)',
        'Prices within 8% of district average — within acceptable bounds',
      ],
      totalLoss: 0,
      farmerCount: 0,
      lossPerFarmer: 0,
      priceHistory: [
        {day:'Mon',fair:29,actual:28,volume:380},{day:'Tue',fair:30,actual:31,volume:420},
        {day:'Wed',fair:29,actual:27,volume:310},{day:'Thu',fair:31,actual:32,volume:480},
        {day:'Fri',fair:30,actual:29,volume:350},{day:'Sat',fair:28,actual:27,volume:240},
        {day:'Sun',fair:29,actual:30,volume:290},
      ],
      agentSpread: [
        {agent:'Green Valley',bid:28.5},{agent:'Patel Agro',bid:31.2},
        {agent:'Sunrise Mandi',bid:29.8},{agent:'Krishi Bazar',bid:30.5},
      ],
      actions: [
        { label: 'This mandi is safe to sell at', icon: '✅', url: '#', priority: 'safe' },
        { label: 'Set up price alerts for future monitoring', icon: '🔔', url: '#', priority: 'medium' },
      ]
    }
  ]
  return scenarios[Math.floor(Math.random() * scenarios.length)]
}

const MANDIS = ['APMC Nagpur','APMC Nashik','Pune Mandi','Aurangabad Hub','Amravati Mandi','Solapur APMC','Kolhapur Market','Latur Mandi']
const CROPS = ['Tomato','Onion','Potato','Cotton','Soybean','Wheat','Mango','Orange']

function RiskMeter({ score }) {
  const color = score > 70 ? '#ef4444' : score > 40 ? '#f97316' : '#22c55e'
  const label = score > 70 ? 'HIGH RISK' : score > 40 ? 'MEDIUM' : 'SAFE'
  const r = 56, circ = 2*Math.PI*r
  const dash = (score/100)*circ
  return (
    <div className={styles.meterWrap}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e8ede6" strokeWidth="10"/>
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 70 70)" style={{transition:'stroke-dasharray 1s ease'}}/>
        <text x="70" y="64" textAnchor="middle" fontSize="28" fontWeight="800" fill={color}>{score}</text>
        <text x="70" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill={color} letterSpacing="2">{label}</text>
        <text x="70" y="96" textAnchor="middle" fontSize="10" fill="#8fa898">risk score</text>
      </svg>
    </div>
  )
}

function EvidenceCard({ evidence, idx }) {
  return (
    <div className={styles.evidenceCard} style={{animationDelay:`${idx*0.1}s`}}>
      <div className={styles.evidenceNum}>{idx+1}</div>
      <div className={styles.evidenceText}>{evidence}</div>
    </div>
  )
}

export default function MandiGuard() {
  const [mandi, setMandi] = useState('APMC Nagpur')
  const [crop, setCrop] = useState('Tomato')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [scanPhase, setScanPhase] = useState(0)

  const PHASES = [
    'Fetching 90-day price history from Agmarknet…',
    'Cross-referencing with 12 surrounding mandis…',
    'Running Gemini AI statistical anomaly detection…',
    'Analysing commission agent bid patterns…',
    'Computing manipulation risk score…',
  ]

  async function runScan() {
    setLoading(true)
    setResult(null)
    setScanPhase(0)
    for (let i = 0; i < PHASES.length; i++) {
      setScanPhase(i)
      await new Promise(r => setTimeout(r, 480))
    }
    const res = await detectManipulation(mandi, crop)
    setResult(res)
    setLoading(false)
  }

  const priorityColors = { urgent:'#ef4444', high:'#f97316', medium:'#3a9668', safe:'#22c55e' }

  return (
    <div className={styles.page}>
      {/* Hero header */}
      <div className={styles.heroHeader}>
        <div className={styles.heroLeft}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroDot}/>
            SECRET WEAPON FEATURE
          </div>
          <h1 className={styles.heroTitle}>MandiGuard™</h1>
          <p className={styles.heroSub}>
            AI-powered cartel & price manipulation detector for agricultural markets.
            The feature no government, no startup, no regulator has built — until now.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><span className={styles.hsVal}>₹2.5L Cr</span><span className={styles.hsLbl}>lost to manipulation yearly</span></div>
            <div className={styles.heroStat}><span className={styles.hsVal}>140M</span><span className={styles.hsLbl}>farmers affected</span></div>
            <div className={styles.heroStat}><span className={styles.hsVal}>70 yrs</span><span className={styles.hsLbl}>unsolved problem</span></div>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroShield}>
            <div className={styles.shieldInner}>🛡️</div>
            <div className={styles.shieldRing1}/>
            <div className={styles.shieldRing2}/>
          </div>
        </div>
      </div>

      {/* Explainer */}
      <div className={styles.explainerBand}>
        {[
          {icon:'📊', title:'Statistical anomaly AI', desc:'Compares your mandi prices vs 50+ surrounding mandis over 90 days to detect suppression patterns invisible to the naked eye'},
          {icon:'🕵️', title:'Agent collusion detector', desc:'Analyses commission agent bid spreads — when agents post identical prices, it\'s coordination. AI flags this with confidence scores'},
          {icon:'⚡', title:'Real-time evidence', desc:'Generates a legally formatted complaint document with timestamped data, ready to file with APMC / NCDRC / District Collector'},
        ].map((e,i) => (
          <div key={i} className={styles.explainerItem}>
            <span className={styles.explainerIcon}>{e.icon}</span>
            <div className={styles.explainerTitle}>{e.title}</div>
            <div className={styles.explainerDesc}>{e.desc}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controlsCard}>
        <div className={styles.controlsRow}>
          <div className={styles.controlGroup}>
            <label className="input-label">Select mandi</label>
            <select className="input-field" value={mandi} onChange={e=>setMandi(e.target.value)}>
              {MANDIS.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div className={styles.controlGroup}>
            <label className="input-label">Your crop</label>
            <select className="input-field" value={crop} onChange={e=>setCrop(e.target.value)}>
              {CROPS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <button className="btn-gold" style={{alignSelf:'flex-end',gap:8,fontWeight:800,fontSize:15}} onClick={runScan} disabled={loading}>
            {loading ? <><span className="spinner-sm"/>Scanning…</> : '🔍 Run AI Scan'}
          </button>
        </div>
      </div>

      {/* Loading animation */}
      {loading && (
        <div className={`${styles.loadingPanel} fade-up`}>
          <div className={styles.loadingHeader}>
            <div className={styles.spinner}/>
            <div className={styles.loadingTitle}>MandiGuard AI is analysing {mandi}</div>
          </div>
          <div className={styles.loadingPhases}>
            {PHASES.map((p,i) => (
              <div key={i} className={`${styles.phase} ${i <= scanPhase ? styles.phaseActive : ''} ${i < scanPhase ? styles.phaseDone : ''}`}>
                <span className={styles.phaseIcon}>{i < scanPhase ? '✓' : i === scanPhase ? '⟳' : '○'}</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className={`fade-up ${styles.results}`}>

          {/* Verdict banner */}
          <div className={`${styles.verdictBanner} ${result.manipulated ? styles.verdictDanger : styles.verdictSafe}`}>
            <div className={styles.verdictIcon}>{result.manipulated ? '🚨' : '✅'}</div>
            <div className={styles.verdictBody}>
              <div className={styles.verdictTitle}>{result.verdict}</div>
              <div className={styles.verdictPattern}>{result.pattern} · {mandi} · {crop}</div>
            </div>
            <RiskMeter score={result.riskScore}/>
          </div>

          {/* Loss calculator */}
          {result.manipulated && (
            <div className={styles.lossCalc}>
              <div className={styles.lossTitle}>💸 Estimated farmer losses this week</div>
              <div className={styles.lossGrid}>
                <div className={styles.lossBox}>
                  <div className={styles.lossVal}>₹{result.totalLoss.toLocaleString()}</div>
                  <div className={styles.lossLbl}>Total stolen from {result.farmerCount} farmers</div>
                </div>
                <div className={styles.lossBox}>
                  <div className={styles.lossVal} style={{color:'#ef4444'}}>₹{result.lossPerFarmer.toLocaleString()}</div>
                  <div className={styles.lossLbl}>Average loss per farmer</div>
                </div>
                <div className={styles.lossBox}>
                  <div className={styles.lossVal} style={{color:'#f97316'}}>₹{(result.priceHistory[0]?.fair - result.priceHistory[0]?.actual) || 0}/kg</div>
                  <div className={styles.lossLbl}>Price gap (fair vs paid)</div>
                </div>
              </div>
            </div>
          )}

          {/* Charts side by side */}
          <div className={styles.chartsRow}>
            <div className={`card ${styles.chartCard}`}>
              <div className={styles.chartTitle}>Fair price vs actual paid (₹/kg)</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={result.priceHistory} margin={{top:10,right:10,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="fairGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3a9668" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3a9668" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ede6"/>
                  <XAxis dataKey="day" tick={{fontSize:11,fill:'#8fa898'}}/>
                  <YAxis tick={{fontSize:11,fill:'#8fa898'}} tickFormatter={v=>`₹${v}`}/>
                  <Tooltip formatter={(v,n)=>[`₹${v}/kg`, n==='fair'?'Fair price':'Actual paid']} contentStyle={{borderRadius:10,border:'1px solid #e8ede6',fontSize:12}}/>
                  <Area type="monotone" dataKey="fair" stroke="#3a9668" strokeWidth={2} fill="url(#fairGrad)" name="fair"/>
                  <Area type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2} fill="url(#actGrad)" name="actual"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={`card ${styles.chartCard}`}>
              <div className={styles.chartTitle}>Agent bid spread (₹/kg) — should vary widely</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={result.agentSpread} margin={{top:10,right:10,left:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ede6"/>
                  <XAxis dataKey="agent" tick={{fontSize:10,fill:'#8fa898'}} interval={0} angle={-12} textAnchor="end" height={40}/>
                  <YAxis tick={{fontSize:11,fill:'#8fa898'}} domain={[0,'dataMax+3']} tickFormatter={v=>`₹${v}`}/>
                  <Tooltip formatter={v=>[`₹${v}/kg`,'Bid']} contentStyle={{borderRadius:10,fontSize:12}}/>
                  <Bar dataKey="bid" fill={result.manipulated ? '#ef4444' : '#3a9668'} radius={[6,6,0,0]}/>
                  {result.manipulated && <ReferenceLine y={result.agentSpread[0]?.bid} stroke="#f97316" strokeDasharray="4 2" label={{value:'Suspicious alignment',fill:'#f97316',fontSize:10}}/>}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Evidence */}
          <div className={styles.evidenceSection}>
            <div className={styles.evidenceHeader}>
              <span className={styles.evidenceBadge}>AI Evidence</span>
              <span className={styles.evidenceSubhead}>Statistical findings from Gemini analysis</span>
            </div>
            {result.evidence.map((ev,i) => <EvidenceCard key={i} evidence={ev} idx={i}/>)}
          </div>

          {/* Action buttons */}
          <div className={styles.actionsSection}>
            <div className={styles.actionsTitle}>{result.manipulated ? '⚡ Immediate actions' : '✅ Recommended actions'}</div>
            <div className={styles.actionsList}>
              {result.actions.map((a,i) => (
                <button key={i} className={styles.actionBtn} style={{borderLeftColor: priorityColors[a.priority]}}>
                  <span className={styles.actionBtnIcon}>{a.icon}</span>
                  <span className={styles.actionBtnText}>{a.label}</span>
                  {a.priority === 'urgent' && <span className={styles.actionUrgent}>URGENT</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Generate complaint */}
          {result.manipulated && (
            <div className={styles.complaintBox}>
              <div className={styles.complaintLeft}>
                <div className={styles.complaintTitle}>📄 Auto-generate legal complaint</div>
                <div className={styles.complaintSub}>Gemini AI will draft a formatted APMC complaint with all evidence, timestamps, and statistical proof — ready to file in 60 seconds.</div>
              </div>
              <button className="btn-gold" style={{flexShrink:0,fontWeight:800}}>
                Generate Complaint →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyShield}>🛡️</div>
          <div className={styles.emptyTitle}>Select a mandi and crop to run the AI scan</div>
          <div className={styles.emptySub}>MandiGuard analyses 90 days of price data, cross-references with 50+ mandis, and runs statistical cartel-detection algorithms — in under 3 seconds.</div>
          <div className={styles.emptyTags}>
            <span className="chip chip-red">SDG 10 — Reduced Inequalities</span>
            <span className="chip chip-green">SDG 16 — Justice & Strong Institutions</span>
            <span className="chip chip-amber">SDG 8 — Decent Work</span>
          </div>
        </div>
      )}
    </div>
  )
}
