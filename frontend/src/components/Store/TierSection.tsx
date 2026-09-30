import TierCard from './TierCard'
import type { Tier } from './storeTypes'
import styles from './store.module.css'

export default function TierSection({ products, selectedTierId, onChange }: { products: Tier[], selectedTierId: number | undefined, onChange: (tier: Tier) => void }) {

    return (
        <section className={styles['tier-grid']}>
            {products.map((tier) => (
                <TierCard 
                    key={tier.name}
                    tier={tier} 
                    selected={tier.id === selectedTierId}
                    onChange={onChange} 
                />
            ))}
        </section>
    )
}