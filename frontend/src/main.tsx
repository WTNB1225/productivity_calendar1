import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import App from './App.tsx'
import Calendar from './pages/Calendar/Calendar.tsx'
import Auth from './pages/Auth/Auth.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <Routes>
    <Route path="/calendar" element={<Calendar />} />
    <Route path="/" element={<App />} />
    <Route path="/auth/github/callback" element={<Auth />} />
  </Routes>
</BrowserRouter>

)
