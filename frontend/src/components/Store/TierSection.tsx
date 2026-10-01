import TierCard from './TierCard'
import type { Tier } from './storeTypes'
import styles from './store.module.css'
import LoadingDots from '../LoadingDots'

interface TierSectionProps {
    loading: boolean
    products: Tier[]
    selectedTierId: number | undefined
    onChange: (tier: Tier) => void
}

export default function TierSection({ loading, products, selectedTierId, onChange }: TierSectionProps) {

    return (
        <section className={styles['tier-grid']}>
            {loading ? (
                <p className={styles['loading']}>
                    Laddar produkter
                    <LoadingDots />
                </p>
            ) : (
                products.map((tier) => (
                    <TierCard 
                        key={tier.name}
                        tier={tier} 
                        selected={tier.id === selectedTierId}
                        onChange={onChange} 
                    />
                ))
            )}
        </section>
    )
}