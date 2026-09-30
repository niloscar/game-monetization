import { useEffect, useState } from 'react'
import api from '../api/apiClient'
import Button from '../components/Button'
import type { User } from '../types/user'

const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await api.get<User[]>('/admin/user')
                setUsers(res.data)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    if (loading) {
        return <p>Laddar användare</p>
    }

    async function handleDelete(userId: string) {
        try {
            await api.delete(`/admin/user/${userId}`)

            setUsers((currentUsers) =>
                currentUsers.filter((user) => user.id !== userId)
            )
        } catch (error) {
            console.error('Kunde inte ta bort användaren', error)
        }
    }

    return (
        <main className="admin-users">
            <h1>Hantera användare</h1>

            <div className="users-list">
                {users.map((user) => (
                    <div className="user-card" key={user.id}>
                        <h2>Användare #{user.id}</h2>

                        <div className="user-info">
                            <p>
                                <strong>Användarnamn:</strong>{' '}
                                <span>{user.username}</span>
                            </p>

                            <p>
                                <strong>Email:</strong>{' '}
                                <span>{user.email}</span>
                            </p>

                            <p>
                                <strong>Roll:</strong>{' '}
                                <span>{user.role.name}</span>
                            </p>

                            <p>
                                <strong>Tier:</strong>{' '}
                                <span>{user.tier?.name ?? 'Ingen tier'}</span>
                            </p>

                            <p>
                                <strong>Skapad:</strong>{' '}
                                <span>
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString('sv-SE')}
                                </span>
                            </p>
                        </div>

                        <div className="user-buttons">
                            <Button>Ändra</Button>
                            <Button onClick={() => handleDelete(user.id)}>
                                Ta bort
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default AdminUsersPage
