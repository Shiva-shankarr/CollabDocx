
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { Toaster } from './components/ui/toaster.tsx'

createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
  <BrowserRouter>

    <App />
 
  </BrowserRouter>
  <Toaster />
  </RecoilRoot>
)
