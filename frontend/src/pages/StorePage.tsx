import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../api/order'
import { getProducts } from '../api/product'
import { productToTier } from '../components/Store/productToTier'
import TierSection from '../components/Store/TierSection'
import PaymentSection from '../components/Store/PaymentSection'

import type { Tier } from '../components/Store/storeTypes'
import type { Product } from '../types/product'
import type { PaymentMethod } from '@assignment/shared/types/order'

const StorePage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [selectedTierId, setSelectedTierId] = useState<number>()

    const { isAuthenticated, loading: loadingAuth } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (loadingAuth || !isAuthenticated) return

        const fetchProducts = async () => {
            try {
                const products = await getProducts()
                setProducts(products)
            } catch (error) {
                console.error('Fel när produkter skulle hämtas:', error)
            } finally {
                setLoadingProducts(false)
            }
        }

        const simulatedLoadingTime = setTimeout(() => {
            fetchProducts()
        }, 1000) // Simulate a delay for loading state

        return () => clearTimeout(simulatedLoadingTime)
    }, [loadingAuth, isAuthenticated])

    const tiers = useMemo(
        () => products.filter((product) => product.price !== null).map(productToTier),
        [products]
    )

    const activeTierId = selectedTierId ?? tiers.find((tier) => tier.mostPopular)?.id
    const selectedTier = tiers.find((tier) => tier.id === activeTierId)
    const cart = { items: selectedTier ? [selectedTier] : [] }

    const handleTierSelect = (tier: Tier) => {
        setSelectedTierId(tier.id)
    }

    const handleOrderSubmit = async (paymentMethod: PaymentMethod) => {
        if (!selectedTier) return

        try {
            const order = await createOrder({
                productId: selectedTier.id,
                paymentMethod
            })

            navigate('/store/confirmation', {
                state: {
                    orderId: order.id,
                    productName: selectedTier.name
                }
            })
        } catch (error) {
            console.error('Error creating order:', error)
        }
    }

    if (loadingAuth) return null

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <main className="store-page">
            <div className="page-title">
                <h1>Välj din nivå</h1>
                <p>Avsluta eller byt nivå när du vill</p>
            </div>

            <TierSection
                loading={loadingProducts}
                products={tiers}
                selectedTierId={activeTierId}
                onChange={handleTierSelect}
            />

            {selectedTier && (
                <PaymentSection 
                    cart={cart} 
                    onSubmit={handleOrderSubmit} 
                />
            )}
        </main>
    )
}

export default StorePage