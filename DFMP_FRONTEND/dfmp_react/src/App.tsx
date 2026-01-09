import './App.css'
import { Routes, Route } from 'react-router-dom'
import AddProduct from './components/AddProduct'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import CustomerDashboard from './pages/CustomerDashboard'
import ProductDetail from './pages/ProductDetail'
import ProductListing from './pages/ProductListing'
import SellerDashboard from './pages/SellerDashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/AdminDashboard'
import AddCategory from './components/AddCategory'

function App() {

  return (
    <div className='bg-sky-50'>
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/register' element={<SignUp />} />
      <Route path='/login' element={<SignIn />} />
      <Route path='/seller' element={<SellerDashboard />} />
      <Route path='/shop' element={<ProductListing />} />
      <Route path='/product/:id' element={<ProductDetail />} />
      <Route path='/customer' element={<CustomerDashboard />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/add-product' element={<AddProduct />} />
      <Route path='/add-category' element={<AddCategory />} />
      <Route path='/checkout' element={<Checkout />} />
      <Route path='/admin' element={<AdminDashboard />}/>
    </Routes>
    </div>
  )
}

export default App
