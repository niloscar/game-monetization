import type { TierCardProps } from './storeTypes'
import styles from './store.module.css'

export default function TierCard({ tier, selected, onChange }: TierCardProps) {

    const { name, price, period, features, mostPopular } = tier

    const classNames = [
        styles['tier-card'],
        mostPopular && styles['most-popular'],
        selected && styles['selected']
    ].filter(Boolean).join(' ')

    const tierColors = [
        { name: 'Quarter Pass', color: '--tier-quarter' },
        { name: 'Combo Pass', color: '--tier-combo' },
        { name: 'High Score Access', color: '--tier-highscore' }
    ]

    const normalizeTierName = (tierName: string) => {
        return tierName.toLowerCase().replace(/\s+/g, '')
    }

    const tierColor = (tierName: string) => {
        return `var(${tierColors.find((t) => normalizeTierName(t.name) === normalizeTierName(tierName))?.color})`
    }

    return (
        <article
            className={classNames}
            style={{ '--card-accent-color': tierColor(name) } as React.CSSProperties}
            key={name}
            onClick={() => onChange(tier)}
        >
            {mostPopular && (
                <div className={styles['most-popular-badge']}>Mest populär</div>
            )}
            <h2>{name}</h2>
            <p className={styles['tier-price']}>
                <span className={styles['tier-price-amount']}>{price} kr</span>
                <span className={styles['tier-price-period']}>/{period}</span>
            </p>
            <ul>
                {features.map(({ name, icon: Icon }) => (
                    <li
                        key={name}
                        className="included"
                    >
                        {Icon && <Icon className={styles['feature-icon']} />}
                        <span>{name}</span>
                    </li>
                ))}
            </ul>
        </article>
    )
}
