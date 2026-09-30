import { useEffect, useRef } from 'react'
import { createInput } from '../engine/input'
import { createGameLoop } from '../engine/gameLoop'
import { CANVAS_HEIGHT, CANVAS_WIDTH, createInitialGameState } from '../engine/gameState'
import type { GamePhase } from '../types/game'
import type { DisplayAd, LoadedDisplayAd } from '../types/ad'

interface GameCanvasProps {
    onPhaseChange: (phase: GamePhase) => void
    isHovered: boolean
    displayAds: DisplayAd[]
    canStart: boolean
    onStartRequest: () => void
}

export default function GameCanvas({
    onPhaseChange,
    isHovered,
    displayAds,
    canStart,
    onStartRequest
}: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isHoveredRef = useRef(isHovered)
    const displayAdsRef = useRef<LoadedDisplayAd[]>([])
    const canStartRef = useRef(canStart)
    const onStartRequestRef = useRef(onStartRequest)

    useEffect(() => {
        onStartRequestRef.current = onStartRequest
    }, [onStartRequest])

    useEffect(() => {
        canStartRef.current = canStart
    }, [canStart])

    useEffect(() => {
        isHoveredRef.current = isHovered
    }, [isHovered])

    useEffect(() => {
        const loadAds = async () => {
            const ads = await Promise.all(
                displayAds.map(
                    (ad) =>
                        new Promise<LoadedDisplayAd | null>((resolve) => {
                            const image = new Image()

                            image.onload = () =>
                                resolve({
                                    id: ad.id,
                                    image
                                })

                            image.onerror = () => resolve(null)
                            image.src = ad.mediaUrl
                        })
                )
            )

            displayAdsRef.current = ads.filter(
                (ad): ad is LoadedDisplayAd => ad !== null
            )
        }

        loadAds()
    }, [displayAds])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const state = createInitialGameState()
        const input = createInput(canvas)
        const gameLoop = createGameLoop(
            ctx,
            state,
            input.state,
            onPhaseChange,
            () => displayAdsRef.current,
            () => canStartRef.current,
            () => onStartRequestRef.current()
        )

        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.code !== 'Space' ||
                !isHoveredRef.current ||
                document.activeElement === canvas
            )
                return

            event.preventDefault()
            canvas.focus()
            input.state.start = true
        }

        window.addEventListener('keydown', handleKeyDown)

        input.start()
        gameLoop.start()

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            input.stop()
            gameLoop.stop()
        }
    }, [onPhaseChange])

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            tabIndex={0}
        />
    )
}
