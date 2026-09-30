import { useEffect, useRef } from 'react'
import { createInput } from '../engine/input'
import { createGameLoop } from '../engine/gameLoop'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../engine/gameState'
import { loadGameAssets } from '../engine/assets'
import type { GamePhase } from '../types/game'
import type { DisplayAd, LoadedDisplayAd } from '../types/ad'
import { createGameState } from '../engine/createGameState'

interface GameCanvasProps {
    onPhaseChange: (phase: GamePhase) => void
    displayAds: DisplayAd[]
    canStart: boolean
    showScore: boolean
    canSaveScore: boolean
    startToken: number
    restartToken: number
    onStartRequest: () => void
}

export default function GameCanvas({
    onPhaseChange,
    displayAds,
    canStart,
    showScore,
    canSaveScore,
    startToken,
    restartToken,
    onStartRequest
}: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const displayAdsRef = useRef<LoadedDisplayAd[]>([])
    const gameLoopRef = useRef<ReturnType<typeof createGameLoop> | null>(null)

    const canStartRef = useRef(canStart)
    canStartRef.current = canStart

    const showScoreRef = useRef(showScore)
    showScoreRef.current = showScore

    const onStartRequestRef = useRef(onStartRequest)
    onStartRequestRef.current = onStartRequest

    useEffect(() => {
        const loadAds = async () => {
            const ads = await Promise.all(
                displayAds.map(
                    (ad) => new Promise<LoadedDisplayAd | null>((resolve) => {
                        const image = new Image()

                        image.onload = () => resolve({ id: ad.id, image })
                        image.onerror = () => resolve(null)
                        image.src = ad.mediaUrl
                    })
                )
            )

            displayAdsRef.current = ads.filter(
                (ad): ad is LoadedDisplayAd => ad !== null
            )
        }

        void loadAds()
    }, [displayAds])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let stopped = false
        let input: ReturnType<typeof createInput> | null = null
        let gameLoop: ReturnType<typeof createGameLoop> | null = null

        const startGame = async () => {
            const assets = await loadGameAssets()
            if (stopped) return

            const state = createGameState()

            input = createInput(canvas)
            gameLoop = createGameLoop(
                ctx,
                state,
                input.state,
                assets,
                onPhaseChange,
                () => displayAdsRef.current,
                () => canStartRef.current,
                () => onStartRequestRef.current(),
                () => showScoreRef.current
            )

            gameLoopRef.current = gameLoop

            input.start()
            gameLoop.start()
        }

        void startGame()

        return () => {
            stopped = true
            input?.stop()
            gameLoop?.stop()
            gameLoopRef.current = null
        }
    }, [onPhaseChange])

    useEffect(() => {
        if (startToken === 0) return

        canvasRef.current?.focus()
        gameLoopRef.current?.requestStart()
    }, [startToken])

    useEffect(() => {
        if (restartToken === 0) return

        canvasRef.current?.focus()
        gameLoopRef.current?.restart()
    }, [restartToken])

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            tabIndex={0}
        />
    )
}