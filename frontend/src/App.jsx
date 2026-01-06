import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { api } from './services/api'

// api.get('/health').then(response => {
//     console.log('Backend health check:', response.data);
//   }).catch(error => {
//     console.error('Error connecting to backend:', error);
//   });
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        {/* <a href="https://vitejs.dev" target="_blank"/> */}
        <a href="http://fb.com">Pornhub.com</a>
        {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}

      </div>
    </>
  )
}

export default App
