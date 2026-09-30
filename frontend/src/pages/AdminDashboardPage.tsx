import { Link } from 'react-router-dom'

const AdminDashboardPage = () => {
    return (
        <main className="admin-dashboard">
            <div className="card">
                <h1 className="admin-header">Admin Dashboard</h1>

                <div className="admin-links">
                    <Link to="/admin/content">hantera innehåll</Link>
                    <Link to="/admin/users">hantera användare</Link>
                </div>
            </div>
        </main>
    )
}

export default AdminDashboardPage
