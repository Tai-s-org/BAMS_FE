"use client"

import { useEffect, useRef, useState } from "react"

export default function Loading() {
    const [loading, setLoading] = useState(true)
    const canvasRef = useRef(null)
    const logoRef = useRef(null)
    const particlesRef = useRef([])
    const lightningRef = useRef([])
    const requestRef = useRef()

    const toggleLoading = () => {
        setLoading((prev) => !prev)
    }

    useEffect(() => {
        // Load the logo image
        logoRef.current = new Image()
        logoRef.current.src = "./assets/logo/logo.png"
        logoRef.current.crossOrigin = "anonymous"

        logoRef.current.onload = () => {
            if (canvasRef.current) {
                initCanvas()
            }
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (!loading && requestRef.current) {
            cancelAnimationFrame(requestRef.current)
        } else if (loading && canvasRef.current && logoRef.current?.complete) {
            initCanvas()
        }
    }, [loading])

    const initCanvas = () => {
        if (!canvasRef.current || !logoRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        const updateCanvasSize = () => {
            const container = canvas.parentElement
            if (container) {
                canvas.width = container.clientWidth
                canvas.height = container.clientHeight
            } else {
                canvas.width = 400
                canvas.height = 400
            }
        }

        updateCanvasSize()
        window.addEventListener("resize", updateCanvasSize)

        // Initialize particles
        initParticles()

        // Animation loop
        const animate = () => {
            if (!ctx || !canvas || !loading) return

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw background
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw logo
            const logoSize = Math.min(canvas.width, canvas.height) * 0.6
            const logoX = (canvas.width - logoSize) / 2
            const logoY = (canvas.height - logoSize) / 2

            ctx.save()
            ctx.globalAlpha = 0.9
            if (logoRef.current) {
                ctx.drawImage(logoRef.current, logoX, logoY, logoSize, logoSize)
            }
            ctx.restore()

            // Update and draw particles
            updateParticles(canvas)
            drawParticles(ctx)

            // Create random lightning
            if (Math.random() < 0.03) {
                createLightning(canvas)
            }

            // Update and draw lightning
            updateLightning()
            drawLightning(ctx)

            // Add glow effect to the logo
            addGlowEffect(ctx, logoX, logoY, logoSize)

            // Continue animation loop
            requestRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", updateCanvasSize)
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current)
            }
        }
    }

    // Particle system
    class Particle {

        constructor(canvas) {
            this.x = Math.random() * canvas.width
            this.y = Math.random() * canvas.height
            this.size = Math.random() * 3 + 1
            this.speedX = (Math.random() - 0.5) * 2
            this.speedY = (Math.random() - 0.5) * 2
            this.color = `hsl(${Math.random() * 60 + 10}, 100%, 50%)`
            this.alpha = Math.random() * 0.8 + 0.2
        }

        update(canvas) {
            this.x += this.speedX
            this.y += this.speedY

            if (this.x < 0 || this.x > canvas.width) {
                this.speedX = -this.speedX
            }

            if (this.y < 0 || this.y > canvas.height) {
                this.speedY = -this.speedY
            }

            this.alpha -= 0.005
            if (this.alpha <= 0) {
                this.alpha = Math.random() * 0.8 + 0.2
            }
        }

        draw(ctx) {
            ctx.save()
            ctx.globalAlpha = this.alpha
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
        }
    }

    // Lightning effect
    class Lightning {
        constructor(canvas) {
            this.startX = Math.random() * canvas.width
            this.startY = 0
            this.endX = Math.random() * canvas.width
            this.endY = canvas.height
            this.segments = this.generateSegments()
            this.width = Math.random() * 3 + 2
            this.color = `rgba(255, ${Math.random() * 100 + 155}, 0, ${Math.random() * 0.5 + 0.5})`
            this.lifespan = 10
        }

        generateSegments() {
            const segments = []
            let currentX = this.startX
            let currentY = this.startY
            const steps = Math.floor(Math.random() * 5) + 5

            for (let i = 0; i <= steps; i++) {
                const progress = i / steps
                const targetY = this.startY + (this.endY - this.startY) * progress
                const offsetX = (Math.random() - 0.5) * 100

                currentX = this.startX + (this.endX - this.startX) * progress + offsetX
                currentY = targetY

                segments.push({ x: currentX, y: currentY })
            }

            return segments
        }

        update() {
            this.lifespan--
        }

        draw(ctx) {
            ctx.save()
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.width
            ctx.shadowColor = "rgba(255, 255, 0, 0.8)"
            ctx.shadowBlur = 15

            ctx.beginPath()
            ctx.moveTo(this.segments[0].x, this.segments[0].y)

            for (let i = 1; i < this.segments.length; i++) {
                ctx.lineTo(this.segments[i].x, this.segments[i].y)
            }

            ctx.stroke()
            ctx.restore()

            // Draw branches
            if (Math.random() < 0.5) {
                this.drawBranches(ctx)
            }
        }

        drawBranches(ctx) {
            const branchPoint = Math.floor(Math.random() * (this.segments.length - 2)) + 1
            const startX = this.segments[branchPoint].x
            const startY = this.segments[branchPoint].y

            ctx.save()
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.width * 0.7
            ctx.shadowColor = "rgba(255, 255, 0, 0.6)"
            ctx.shadowBlur = 10

            ctx.beginPath()
            ctx.moveTo(startX, startY)

            const endX = startX + (Math.random() - 0.5) * 100
            const endY = startY + Math.random() * 80

            const midX = startX + (endX - startX) * 0.5 + (Math.random() - 0.5) * 40
            const midY = startY + (endY - startY) * 0.5

            ctx.quadraticCurveTo(midX, midY, endX, endY)
            ctx.stroke()
            ctx.restore()
        }
    }

    const initParticles = () => {
        if (!canvasRef.current) return

        particlesRef.current = []
        for (let i = 0; i < 50; i++) {
            particlesRef.current.push(new Particle(canvasRef.current))
        }
    }

    const updateParticles = (canvas) => {
        particlesRef.current.forEach((particle) => {
            particle.update(canvas)
        })
    }

    const drawParticles = (ctx) => {
        particlesRef.current.forEach((particle) => {
            particle.draw(ctx)
        })
    }

    const createLightning = (canvas) => {
        lightningRef.current.push(new Lightning(canvas))
    }

    const updateLightning = () => {
        lightningRef.current.forEach((lightning) => {
            lightning.update()
        })

        // Remove dead lightning
        lightningRef.current = lightningRef.current.filter((lightning) => lightning.lifespan > 0)
    }

    const drawLightning = (ctx) => {
        lightningRef.current.forEach((lightning) => {
            lightning.draw(ctx)
        })
    }

    const addGlowEffect = (ctx, x, y, size) => {
        // Pulsing effect
        const time = Date.now() * 0.001
        const scale = 1 + Math.sin(time * 2) * 0.05

        ctx.save()
        ctx.translate(x + size / 2, y + size / 2)
        ctx.scale(scale, scale)
        ctx.translate(-(x + size / 2), -(y + size / 2))

        // Draw glow
        const gradient = ctx.createRadialGradient(
            x + size / 2,
            y + size / 2,
            size * 0.3,
            x + size / 2,
            y + size / 2,
            size * 0.7,
        )

        gradient.addColorStop(0, "rgba(255, 165, 0, 0)")
        gradient.addColorStop(0.5, "rgba(255, 165, 0, 0.1)")
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.fillRect(x - size * 0.2, y - size * 0.2, size * 1.4, size * 1.4)
        ctx.restore()
    }

    // Add PulseLoading function
    function PulseLoading() {
        return (
            <div className="flex items-center justify-center space-x-2">
                <div className="h-5 w-5 rounded-full bg-primary animate-pulse-slow"></div>
                <div className="h-5 w-5 rounded-full bg-primary animate-pulse-slow delay-150"></div>
                <div className="h-5 w-5 rounded-full bg-primary animate-pulse-slow delay-300"></div>
                <div className="h-5 w-5 rounded-full bg-primary animate-pulse-slow delay-450"></div>
                <div className="h-5 w-5 rounded-full bg-primary animate-pulse-slow delay-600"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
            <div className="relative w-full aspect-square max-w-xl">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            {loading && (
                <div className="mt-6">
                    <PulseLoading />
                </div>
            )}
        </div>
    )
}

