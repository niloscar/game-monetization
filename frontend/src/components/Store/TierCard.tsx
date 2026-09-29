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
        { name: 'Quarter pass', color: '--tier-quarter' },
        { name: 'Combo pass', color: '--tier-combo' },
        { name: 'High score access', color: '--tier-highscore' }
    ]

    const tierColor = (tierName: string) => {
        return `var(${tierColors.find((t) => t.name === tierName)?.color})`
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
                {features.map(({ name, included, icon: Icon }) => (
                    <li
                        key={name}
                        className={included ? styles['included'] : styles['not-included']}
                    >
                        {Icon && <Icon className={styles['feature-icon']} />}
                        <span>{name}</span>
                    </li>
                ))}
            </ul>
        </article>
    )
}
