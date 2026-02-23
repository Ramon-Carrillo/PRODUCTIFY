import { SignInButton } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import Home from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import Profile from './pages/ProfilePage'
import CreatePage from './pages/CreatePage'
import EditProductPage from './pages/EditProductPage'
import { Routes, Route } from 'react-router'

function App() {
  return (
    <div className='min-h-screen bg-base-200 '>
      <Navbar />
      <main className='max-w-5xl mx-auto px-4 py-8'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product/:id' element={<ProductPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/create' element={<CreatePage />} />
          <Route path='/edit/:id' element={<EditProductPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
