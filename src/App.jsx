import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider, useLang } from './lib/LangContext'
import LangChooser from './pages/LangChooser'
import Sidebar from './components/Sidebar'
import VoiceAssistant from './components/VoiceAssistant'
import Dashboard from './pages/Dashboard'
import CropDoctor from './pages/CropDoctor'
import Forecast from './pages/Forecast'
import Cooperative from './pages/Cooperative'
import Carbon from './pages/Carbon'
import KrishiScore from './pages/KrishiScore'
import MarketMap from './pages/MarketMap'
import ListProduce from './pages/ListProduce'
import MandiGuard from './pages/MandiGuard'
import GovSchemes from './pages/GovSchemes'
import IntlLoans from './pages/IntlLoans'
import UserProfile from './pages/UserProfile'
import NearbyPlaces from './pages/NearbyPlaces'
import ProfitTools from './pages/ProfitTools'
import styles from './App.module.css'

function AppInner() {
  const { langCode } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Show language chooser on first visit
  if (!langCode) return <LangChooser />

  return (
    <BrowserRouter>
      <div className={styles.shell}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className={styles.main}>
          <div className={styles.mobileBar}>
            <button className={styles.menuBtn} onClick={() => setMobileOpen(true)}>
              <span className={styles.menuIcon}>☰</span>
            </button>
            <span className={styles.mobileLogo}>🌾 KrishiChain</span>
            <span className={styles.mobileVersion}>Ultra v2</span>
          </div>
          <div className={styles.content}>
            <Routes>
              <Route path="/"           element={<Dashboard />} />
              <Route path="/list"       element={<ListProduce />} />
              <Route path="/crop-doctor"element={<CropDoctor />} />
              <Route path="/forecast"   element={<Forecast />} />
              <Route path="/tools"      element={<ProfitTools />} />
              <Route path="/cooperative"element={<Cooperative />} />
              <Route path="/market"     element={<MarketMap />} />
              <Route path="/nearby"     element={<NearbyPlaces />} />
              <Route path="/schemes"    element={<GovSchemes />} />
              <Route path="/loans"      element={<IntlLoans />} />
              <Route path="/carbon"     element={<Carbon />} />
              <Route path="/krishiscore"element={<KrishiScore />} />
              <Route path="/mandiguard" element={<MandiGuard />} />
              <Route path="/profile"    element={<UserProfile />} />
            </Routes>
          </div>
        </div>

        {/* Global auto-start voice assistant — always present */}
        <VoiceAssistant />
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  )
}
