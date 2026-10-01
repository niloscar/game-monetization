import { Link, Navigate, useLocation } from 'react-router-dom'

interface ConfirmationState {
    orderId: number
    productName: string
}

export default function OrderConfirmationPage() {
    const { state } = useLocation()
    const confirmation = state as ConfirmationState | null

    if (!confirmation) {
        return <Navigate to="/store" replace />
    }

    return (
        <main className="order-confirmation-page">
            <div className="page-title">
                <h1>Köpet är klart!</h1>
                <p>Du har nu tillgång till {confirmation.productName}.</p>
            </div>

            <Link to="/" className="btn btn-confirmation">
                Börja spela!
            </Link>
        </main>
    )
}