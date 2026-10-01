import { useState, useEffect } from 'react'
import api from '../api/apiClient'
import Button from '../components/Button'
import Input from '../components/Input'
import axios from 'axios'
import type { Product } from '../types/product'

const AdminContentPage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])

    useEffect(() => {
        async function fetchProducts() {
            const response = await api.get<Product[]>('/product')
            setProducts(response.data)
        }

        fetchProducts()
    }, [])

    const [title, setTitle] = useState('')
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
    const [mediaFile, setMediaFile] = useState<File | null>(null)
    const [targetUrl, setTargetUrl] = useState('')
    const [duration, setDuration] = useState('')
    const [placement, setPlacement] = useState<'display' | 'pre_game'>(
        'display'
    )
    const [weight, setWeight] = useState('1')
    const [isActive, setIsActive] = useState(true)

    const [powerUpKey, setPowerUpKey] = useState('')
    const [powerUpName, setPowerUpName] = useState('')
    const [powerUpDescription, setPowerUpDescription] = useState('')
    const [powerUpImageFile, setPowerUpImageFile] = useState<File | null>(null)
    const [powerUpIsActive, setPowerUpIsActive] = useState(true)
    const [powerUpWidth, setPowerUpWidth] = useState('24')
    const [powerUpHeight, setPowerUpHeight] = useState('24')
    const [healthDelta, setHealthDelta] = useState('0')
    const [scoreDelta, setScoreDelta] = useState('0')
    const [speedMultiplier, setSpeedMultiplier] = useState('1')
    const [scoreMultiplier, setScoreMultiplier] = useState('1')
    const [durationSeconds, setDurationSeconds] = useState('0')
    const [spawnWeight, setSpawnWeight] = useState('1')

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleCreateAd(e: React.SubmitEvent) {
        e.preventDefault()
        setMessage('')
        setLoading(true)

        try {
            if (!mediaFile) {
                setMessage('Välj en mediafil.')
                setLoading(false)
                return
            }

            const formData = new FormData()

            formData.append('title', title)
            formData.append('media_type', mediaType)
            formData.append('media', mediaFile)
            formData.append('target_url', targetUrl)
            formData.append('duration_seconds', duration)
            formData.append('placement', placement)
            formData.append('weight', weight)
            formData.append('is_active', String(isActive))

            await api.post('/admin/ad', formData)

            setMessage('Annonsen skapades!')

            setTitle('')
            setMediaType('image')
            setMediaFile(null)
            setTargetUrl('')
            setDuration('')
            setPlacement('display')
            setWeight('1')
            setIsActive(true)
        } catch (error) {
            console.error(error)

            if (axios.isAxiosError(error)) {
                console.log('Backend svar:', error.response?.data)
            }

            setMessage('Kunde inte skapa annonsen.')
        } finally {
            setLoading(false)
        }
    }

    async function handleCreatePowerUp(e: React.SubmitEvent) {
        e.preventDefault()
        setMessage('')
        setLoading(true)

        try {
            if (!powerUpImageFile) {
                setMessage('Välj en bild.')
                setLoading(false)
                return
            }

            const formData = new FormData()

            formData.append('key', powerUpKey)
            formData.append('name', powerUpName)
            formData.append('description', powerUpDescription)
            formData.append('image', powerUpImageFile)
            formData.append('isActive', String(powerUpIsActive))
            formData.append('width', powerUpWidth)
            formData.append('height', powerUpHeight)
            formData.append('healthDelta', healthDelta)
            formData.append('scoreDelta', scoreDelta)
            formData.append('speedMultiplier', speedMultiplier)
            formData.append('scoreMultiplier', scoreMultiplier)
            formData.append('durationSeconds', durationSeconds)
            formData.append('spawnWeight', spawnWeight)
            formData.append('productIds', JSON.stringify(selectedProductIds))

            await api.post('/admin/power-up', formData)

            setMessage('Power Up skapades!')

            setPowerUpKey('')
            setPowerUpName('')
            setPowerUpDescription('')
            setPowerUpImageFile(null)
            setPowerUpIsActive(true)
            setPowerUpWidth('24')
            setPowerUpHeight('24')
            setHealthDelta('0')
            setScoreDelta('0')
            setSpeedMultiplier('1')
            setScoreMultiplier('1')
            setDurationSeconds('0')
            setSpawnWeight('1')
        } catch (error) {
            console.error(error)

            if (axios.isAxiosError(error)) {
                console.log('Backend svar:', error.response?.data)
            }

            setMessage('Kunde inte skapa Power Up.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="admin-content">
            <h1>hantera innehåll</h1>

            <section className="admin-content-section">
                <h2>lägg till annons</h2>

                <form className="admin-content-form" onSubmit={handleCreateAd}>
                    <label>
                        titel
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        media type
                        <select
                            value={mediaType}
                            onChange={(e) =>
                                setMediaType(
                                    e.target.value as 'image' | 'video'
                                )
                            }
                        >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </select>
                    </label>

                    <label>
                        media fil
                        <Input
                            type="file"
                            accept={
                                mediaType === 'image' ? 'image/*' : 'video/*'
                            }
                            onChange={(e) =>
                                setMediaFile(e.target.files?.[0] ?? null)
                            }
                            required
                        />
                    </label>

                    <label>
                        target URL
                        <Input
                            type="text"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                        />
                    </label>

                    <label>
                        duration (sekunder)
                        <Input
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </label>

                    <label>
                        placement
                        <select
                            value={placement}
                            onChange={(e) =>
                                setPlacement(
                                    e.target.value as 'display' | 'pre_game'
                                )
                            }
                        >
                            <option value="display">Display</option>
                            <option value="pre_game">Pre game</option>
                        </select>
                    </label>

                    <label>
                        weight
                        <Input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </label>

                    <label className="admin-checkbox">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                        aktiv
                    </label>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Skapar...' : 'Lägg till annons'}
                    </Button>

                    {message && <p>{message}</p>}
                </form>
            </section>

            <section className="admin-content-section">
                <h2>lägg till power up</h2>

                <form
                    className="admin-content-form"
                    onSubmit={handleCreatePowerUp}
                >
                    <label>
                        key
                        <Input
                            type="text"
                            value={powerUpKey}
                            onChange={(e) => setPowerUpKey(e.target.value)}
                            placeholder="speed_boost"
                            required
                        />
                    </label>

                    <label>
                        namn
                        <Input
                            type="text"
                            value={powerUpName}
                            onChange={(e) => setPowerUpName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        beskrivning
                        <Input
                            type="text"
                            value={powerUpDescription}
                            onChange={(e) =>
                                setPowerUpDescription(e.target.value)
                            }
                        />
                    </label>

                    <label>
                        power Up bild
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setPowerUpImageFile(e.target.files?.[0] ?? null)
                            }
                            required
                        />
                    </label>

                    <label>
                        produkter
                        <select
                            multiple
                            value={selectedProductIds.map(String)}
                            onChange={(e) => {
                                const ids = Array.from(
                                    e.target.selectedOptions,
                                    (option) => Number(option.value)
                                )

                                setSelectedProductIds(ids)
                            }}
                        >
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        bredd
                        <Input
                            type="number"
                            min="1"
                            value={powerUpWidth}
                            onChange={(e) => setPowerUpWidth(e.target.value)}
                        />
                    </label>

                    <label>
                        höjd
                        <Input
                            type="number"
                            min="1"
                            value={powerUpHeight}
                            onChange={(e) => setPowerUpHeight(e.target.value)}
                        />
                    </label>

                    <label>
                        health delta
                        <Input
                            type="number"
                            value={healthDelta}
                            onChange={(e) => setHealthDelta(e.target.value)}
                        />
                    </label>

                    <label>
                        score delta
                        <Input
                            type="number"
                            value={scoreDelta}
                            onChange={(e) => setScoreDelta(e.target.value)}
                        />
                    </label>

                    <label>
                        speed multiplier
                        <Input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={speedMultiplier}
                            onChange={(e) => setSpeedMultiplier(e.target.value)}
                        />
                    </label>

                    <label>
                        score multiplier
                        <Input
                            type="number"
                            step="0.1"
                            min="0"
                            value={scoreMultiplier}
                            onChange={(e) => setScoreMultiplier(e.target.value)}
                        />
                    </label>

                    <label>
                        duration (sekunder)
                        <Input
                            type="number"
                            min="0"
                            value={durationSeconds}
                            onChange={(e) => setDurationSeconds(e.target.value)}
                        />
                    </label>

                    <label>
                        spawn weight
                        <Input
                            type="number"
                            min="1"
                            value={spawnWeight}
                            onChange={(e) => setSpawnWeight(e.target.value)}
                        />
                    </label>

                    <label className="admin-checkbox">
                        <input
                            type="checkbox"
                            checked={powerUpIsActive}
                            onChange={(e) =>
                                setPowerUpIsActive(e.target.checked)
                            }
                        />
                        aktiv
                    </label>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Skapar...' : 'Lägg till Power Up'}
                    </Button>

                    {message && <p>{message}</p>}
                </form>
            </section>
        </main>
    )
}

export default AdminContentPage
