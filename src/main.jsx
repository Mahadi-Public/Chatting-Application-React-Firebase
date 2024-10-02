import firebaseConfig from './Database/firebaseConfig.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastProvider } from './useToast.jsx'
import { Provider } from 'react-redux'
import { store } from './features/store.js'
import "cropperjs/dist/cropper.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider />
      <App />
    </Provider>
  </StrictMode>,
)
