import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './App'

import { RouterProvider } from 'react-router'
import AuthProvider from './contexts/AuthContext'
import ProductsProvider from './contexts/ProductsContext'
import CartProvider from './contexts/CartContext'

import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <Toaster position='top-right' reverseOrder={false}/>
            <RouterProvider router={router} />
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
  </StrictMode>,
)
