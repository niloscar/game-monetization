import { useEffect, useMemo, useState } from 'react'
import TierSection from '../components/Store/TierSection'
import PaymentSection from '../components/Store/PaymentSection'
import { getProducts } from '../api/product'
import { productToTier } from '../components/Store/productToTier'
import type { Tier } from '../components/Store/storeTypes'
import type { Product } from '../types/product'

const StorePage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [selectedTierId, setSelectedTierId] = useState<number>()

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts()
            setProducts(products)
            console.log('Fetched products:', products)
        }

        fetchProducts()
    }, [])

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

    return (
        <main className="store-page">
            <div className="page-title">
                <h1>Välj din nivå</h1>
                <p>Avsluta eller byt nivå när du vill</p>
            </div>

            <TierSection
                products={tiers}
                selectedTierId={activeTierId}
                onChange={handleTierSelect}
            />

            {selectedTier && <PaymentSection cart={cart} />}
        </main>
    )
}

export default StorePage