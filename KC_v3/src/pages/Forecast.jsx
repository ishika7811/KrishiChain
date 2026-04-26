import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { getForecast } from '../lib/gemini'
import { ALL_CROPS as CROPS, INDIAN_STATES as DISTRICTS } from '../lib/data'
import styles from './Forecast.module.css'

export default function Forecast() {
  const [crop, setCrop] = useState('Tomato')
  const [district, setDistrict] = useState('Nagpur')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleFetch() {
    setLoading(true)
    const res = await getForecast(crop, district)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>📈 AI Demand Forecast</h1>
          <p className={styles.sub}>7-day price & demand prediction · Vertex AI AutoML</p>
        </div>
        <div className={styles.headerBadges}>
          <span className="chip chip-amber">Vertex AI</span>
          <span className="chip chip-green">BigQuery ML</span>
        </div>
      </div>

      <div className={`card ${styles.controls}`}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>Crop type</label>
          <select className={styles.select} value={crop} onChange={e=>setCrop(e.target.value)}>
            {CROPS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.controlGroup}>
          <label className={styles.label}>District</label>
          <select className={styles.select} value={district} onChange={e=>setDistrict(e.target.value)}>
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <button className={`btn-primary ${styles.fetchBtn}`} onClick={handleFetch} disabled={loading}>
          {loading ? <><span className={styles.btnSpinner}/>Forecasting…</> : '⚡ Get AI Forecast'}
        </button>
      </div>

      {!result && !loading && (
        <div className={styles.emptyState}>
          <div style={{fontSize:52}}>📊</div>
          <div className={styles.emptyTitle}>Select crop and district</div>
          <div className={styles.emptySub}>Our Vertex AI model trained on 3 years of mandi price data will predict the best time and place to sell</div>
        </div>
      )}

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <div>Running Vertex AI forecast model…</div>
        </div>
      )}

      {result && !loading && (
        <div className={`fade-up ${styles.results}`}>
          <div className={styles.summaryRow}>
            {[
              { label:'Best sell day', value: result.bestDay, icon:'📅', color:'#e8f5e9' },
              { label:'Peak price', value:`₹${result.bestPrice}/kg`, icon:'💰', color:'#fff8e1' },
              { label:'Model confidence', value:`${result.confidence}%`, icon:'🎯', color:'#e3f2fd' },
            ].map((s,i) => (
              <div key={i} className={`card ${styles.summaryCard}`} style={{background:s.color}}>
                <div className={styles.sumIcon}>{s.icon}</div>
                <div className={styles.sumValue}>{s.value}</div>
                <div className={styles.sumLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className={`card ${styles.chartCard}`}>
            <div className={styles.chartTitle}>Price forecast — {crop} in {district}</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={result.data} margin={{top:10,right:10,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40916c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#40916c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8"/>
                <XAxis dataKey="day" tick={{fontSize:12, fill:'#718096'}}/>
                <YAxis tick={{fontSize:12, fill:'#718096'}} tickFormatter={v=>`₹${v}`}/>
                <Tooltip formatter={(v,n)=>[`₹${v}/kg`,'Price']} contentStyle={{borderRadius:8,border:'1px solid #e5e7eb', fontSize:12}}/>
                <ReferenceLine x={result.bestDay} stroke="#f4a261" strokeDasharray="4 2" label={{value:'Best day',fill:'#e76f51',fontSize:11}}/>
                <Area type="monotone" dataKey="price" stroke="#40916c" strokeWidth={2} fill="url(#priceGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={`card ${styles.chartCard}`}>
            <div className={styles.chartTitle}>Demand forecast — % market demand</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={result.data} margin={{top:10,right:10,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f4a261" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f4a261" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8"/>
                <XAxis dataKey="day" tick={{fontSize:12, fill:'#718096'}}/>
                <YAxis tick={{fontSize:12, fill:'#718096'}} tickFormatter={v=>`${v}%`}/>
                <Tooltip formatter={(v)=>[`${v}%`,'Demand']} contentStyle={{borderRadius:8, fontSize:12}}/>
                <Area type="monotone" dataKey="demand" stroke="#f4a261" strokeWidth={2} fill="url(#demandGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={`card ${styles.recCard}`}>
            <div className={styles.recIcon}>🤖</div>
            <div>
              <div className={styles.recTitle}>Gemini AI recommendation</div>
              <div className={styles.recText}>{result.recommendation}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
