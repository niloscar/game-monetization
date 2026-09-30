import { useEffect, useState } from 'react'
import TierSection from '../components/Store/TierSection'
import PaymentSection from '../components/Store/PaymentSection'
import { getProducts } from '../api/product'
import type { Cart, Tier } from '../components/Store/storeTypes'
import { Gamepad, Trophy, Close, Chart, Headphone, CardText} from 'pixelarticons/react'
import type { Product } from '../types/product'

const MOCK_TIERS = [
    {
        id: 1,
        name: 'Quarter pass',
        price: 29,
        period: 'mån',
        features: [
            { name: 'Full spelåtkomst', included: true, icon: Gamepad },
            { name: 'Mycket reklam', included: true, icon: CardText },
            { name: 'Ser maxpoäng', included: true, icon: Trophy },
            { name: 'Ej speltid/high score', included: false, icon: Close }
        ],
        mostPopular: false
    },
    {
        id: 2,
        name: 'Combo pass',
        price: 59,
        period: 'mån',
        features: [
            { name: 'Full spelåtkomst', included: true, icon: Gamepad },
            { name: 'En del reklam', included: true, icon: CardText },
            { name: 'Maxpoäng + speltid', included: true, icon: Trophy },
            { name: 'Ej high score/support', included: true, icon: Close }
        ],
        mostPopular: true
    },
    {
        id: 3,
        name: 'High score access',
        price: 99,
        period: 'mån',
        features: [
            { name: 'Full spelåtkomst', included: true, icon: Gamepad },
            { name: 'Ingen reklam', included: true, icon: CardText },
            {
                name: 'Full statistik + high score',
                included: true,
                icon: Chart
            },
            { name: 'Prioriterad support', included: true, icon: Headphone }
        ],
        mostPopular: false
    }
]

const mostPopularTier = MOCK_TIERS.find((tier) => tier.mostPopular)

const StorePage = () => {
    const [cart, setCart] = useState<Cart>({
        items: mostPopularTier ? [mostPopularTier] : []
    })

    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts()
            setProducts(products)
            console.log('Fetched products:', products)
        }

        fetchProducts()
    }, [])

    const handleTierSelect = (tier: Tier) => {
        setCart({ items: [tier] })
    }

    return (
        <main className="store-page">
            <div className="page-title">
                <h1>Välj din nivå</h1>
                <p>Avsluta eller byt nivå när du vill</p>
            </div>

            <TierSection 
                tiers={MOCK_TIERS}
                selectedTierId={cart.items[0]?.id}
                onChange={handleTierSelect}
             />
            {cart.items.length > 0 && <PaymentSection cart={cart} />}
        </main>
    )
}

export default StorePage
