import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    fetchMyOrders,
    formatPrice,
    formatStatus,
    getOrderTotal,
    getProductName,
    type Order
} from '../lib/receipts'

const ReceiptPage = () => {
    const { isAuthenticated } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        if (!isAuthenticated) {
            setIsLoading(false)
            return
        }

        let cancelled = false

        async function load() {
            setIsLoading(true)
            setLoadError(null)
            try {
                const myOrders = await fetchMyOrders()
                if (!cancelled) {
                    // Senaste först.
                    setOrders(
                        [...myOrders].sort(
                            (a, b) =>
                                new Date(b.orderedAt).getTime() -
                                new Date(a.orderedAt).getTime()
                        )
                    )
                }
            } catch {
                if (!cancelled)
                    setLoadError('Kunde inte hämta dina kvitton just nu.')
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [isAuthenticated])

    if (!isAuthenticated) {
        return (
            <div className="score-page">
                <div className="card login-cta">
                    <p>Logga in för att se dina kvitton.</p>
                    <Link to="/login" className="btn combo">
                        Logga in
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="score-page">
            <div className="page-title">
                <h1>KVITTON</h1>
            </div>

            {isLoading && <p className="loading-text">Laddar kvitton…</p>}
            {loadError && <p className="error-text">{loadError}</p>}

            {!isLoading && !loadError && orders.length === 0 && (
                <div className="card">
                    <p>Du har inga köp ännu.</p>
                    <Link to="/store" className="btn combo">
                        Till butiken
                    </Link>
                </div>
            )}

            {orders.map((order) => (
                <div key={order.id} className="card receipt-card">
                    <div className="card-head">
                        <h2>Kvitto #{order.id}</h2>
                        <span className={`status-badge status-${order.status}`}>
                            {formatStatus(order.status)}
                        </span>
                    </div>

                    <p className="profile-meta">
                        {new Date(order.orderedAt).toLocaleDateString('sv-SE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>

                    <div className="receipt-items">
                        {order.items.map((item) => (
                            <div key={item.productId} className="receipt-row">
                                <span className="name">
                                    {getProductName(item.productId)}
                                    {item.quantity > 1
                                        ? ` × ${item.quantity}`
                                        : ''}
                                </span>
                                <span className="price">
                                    {formatPrice(
                                        item.unitPrice * item.quantity
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="receipt-row receipt-total">
                        <span className="name">Totalt</span>
                        <span className="price">
                            {formatPrice(getOrderTotal(order))}
                        </span>
                    </div>

                    {order.address && (
                        <p className="profile-meta">
                            Levereras till: {order.address.fname}{' '}
                            {order.address.lname}, {order.address.street},{' '}
                            {order.address.zipcode} {order.address.city}
                        </p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default ReceiptPage
