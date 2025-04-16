import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'

const App = () => {
  return (
    <div>
    <Router>
<Routes>
  <Route path='/' element={<Register />}/>
  <Route path='/Login' element={<Login />}/>

  
</Routes>
    </Router>

    
      
    </div>
  )
}

export default App
