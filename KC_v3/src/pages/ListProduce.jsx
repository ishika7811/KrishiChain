import { useState } from 'react'
import { ALL_CROPS as CROPS, INDIAN_STATES as DISTRICTS } from '../lib/data'
import { getSpoilageWindow } from '../lib/gemini'
import styles from './ListProduce.module.css'

export default function ListProduce() {
  const [form, setForm] = useState({ crop:'Tomato', qty:500, price:26, district:'Nagpur', vehicle:'truck', harvestDate:new Date().toISOString().slice(0,10) })
  const [listening, setListening] = useState(false)
  const [spoilage, setSpoilage] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function setF(k,v){ setForm(p=>({...p,[k]:v})) }

  async function handleVoice() {
    setListening(true)
    await new Promise(r=>setTimeout(r,2200))
    setForm(p=>({...p, crop:'Tomato', qty:500, district:'Nagpur'}))
    setListening(false)
  }

  async function checkSpoilage() {
    const res = await getSpoilageWindow(form.crop, form.harvestDate, 32)
    setSpoilage(res)
  }

  async function handleSubmit() {
    setLoading(true)
    await new Promise(r=>setTimeout(r,1200))
    setLoading(false)
    setSubmitted(true)
  }

  const urgencyColors = { critical:'#ef4444', high:'#f97316', medium:'#eab308', safe:'#22c55e' }

  if (submitted) return (
    <div className={styles.successPage}>
      <div className={styles.successIcon}>✅</div>
      <h2 className={styles.successTitle}>Produce listed successfully!</h2>
      <p className={styles.successSub}>Your {form.crop} listing is now live on KrishiChain. Buyers in {form.district} and nearby districts can see it.</p>
      <div className={styles.successMeta}>
        <div className={styles.smRow}><span>Crop</span><strong>{form.crop}</strong></div>
        <div className={styles.smRow}><span>Quantity</span><strong>{form.qty} kg</strong></div>
        <div className={styles.smRow}><span>Ask price</span><strong>₹{form.price}/kg</strong></div>
        <div className={styles.smRow}><span>District</span><strong>{form.district}</strong></div>
      </div>
      <button className="btn-primary" onClick={()=>setSubmitted(false)}>List another crop</button>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>📋 List Your Produce</h1>
          <p className={styles.sub}>Add your harvest · Get AI pricing advice · Reach 1,200+ buyers</p>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.formCol}>
          {/* Voice input */}
          <div className={`card ${styles.voiceCard}`}>
            <div className={styles.vcTitle}>🎤 Speak in Hindi to auto-fill</div>
            <div className={styles.vcSub}>Say: "टमाटर, 500 किलो, नागपुर, आज कटाई"</div>
            <button className={`${styles.voiceBtn} ${listening?styles.voiceActive:''}`} onClick={handleVoice} disabled={listening}>
              {listening ? '🔴 Listening…' : '🎤 Start speaking'}
            </button>
          </div>

          <div className={`card ${styles.formCard}`}>
            <div className={styles.formTitle}>Produce details</div>
            <div className={styles.field}>
              <label className={styles.label}>Crop type</label>
              <select className={styles.select} value={form.crop} onChange={e=>setF('crop',e.target.value)}>
                {CROPS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Quantity (kg)</label>
                <input className={styles.input} type="number" min="10" value={form.qty} onChange={e=>setF('qty',Number(e.target.value))}/>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Ask price (₹/kg)</label>
                <input className={styles.input} type="number" min="1" value={form.price} onChange={e=>setF('price',Number(e.target.value))}/>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>District</label>
              <select className={styles.select} value={form.district} onChange={e=>setF('district',e.target.value)}>
                {DISTRICTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Harvest date</label>
              <input className={styles.input} type="date" value={form.harvestDate} onChange={e=>setF('harvestDate',e.target.value)}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Transport vehicle</label>
              <select className={styles.select} value={form.vehicle} onChange={e=>setF('vehicle',e.target.value)}>
                <option value="truck">Truck</option>
                <option value="tempo">Tempo</option>
                <option value="tractor">Tractor</option>
                <option value="bike">Bike / cycle</option>
              </select>
            </div>
          </div>

          <button className="btn-outline" style={{marginBottom:8}} onClick={checkSpoilage}>
            ⏱️ Check spoilage window
          </button>

          <button className="btn-primary" style={{fontSize:15,justifyContent:'center'}} onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className={styles.spinner}/>Listing on KrishiChain…</> : '🚀 List My Produce'}
          </button>
        </div>

        <div className={styles.previewCol}>
          <div className={`card ${styles.previewCard}`}>
            <div className={styles.previewTitle}>Live preview</div>
            <div className={styles.previewCrop}>{form.crop}</div>
            <div className={styles.previewFarmer}>Ramesh Patil · {form.district}</div>
            <div className={styles.previewStats}>
              <div className={styles.ps}><div className={styles.psVal}>{form.qty.toLocaleString()} kg</div><div className={styles.psLbl}>Quantity</div></div>
              <div className={styles.ps}><div className={styles.psVal}>₹{form.price}/kg</div><div className={styles.psLbl}>Ask price</div></div>
              <div className={styles.ps}><div className={styles.psVal}>₹{(form.qty * form.price).toLocaleString()}</div><div className={styles.psLbl}>Total value</div></div>
            </div>
            {spoilage && (
              <div className={styles.spoilageBox} style={{borderLeftColor: urgencyColors[spoilage.urgency]}}>
                <div className={styles.spoilageTop}>
                  <span className={styles.spoilageDays} style={{color: urgencyColors[spoilage.urgency]}}>{spoilage.daysLeft} days</span>
                  <span className={styles.spoilageLabel}>until spoilage</span>
                </div>
                <div className={styles.spoilageTip}>{spoilage.tip}</div>
              </div>
            )}
          </div>

          <div className={`card ${styles.tipsCard}`}>
            <div className={styles.tipsTitle}>💡 AI pricing tips for {form.crop}</div>
            <div className={styles.tipsList}>
              <div className={styles.tipItem}>Current avg mandi price in {form.district}: ₹{form.price + 2}/kg</div>
              <div className={styles.tipItem}>Best sell day this week: Thursday (demand peak)</div>
              <div className={styles.tipItem}>Cooperative bonus: +₹{Math.round(form.price * 0.14)}/kg if you join a bulk deal</div>
              <div className={styles.tipItem}>Carbon certificate eligible: adds access to 3 export buyers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
