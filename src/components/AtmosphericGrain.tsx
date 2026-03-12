"use client";


/**
 * AtmosphericGrain — Kinetic Edition
 * ──────────────────────────────────
 * High-frequency animated grain for that "electric" Nothing-style substrate.
 * Uses a noise pattern jittered by keyframes for performance.
 */
export default function AtmosphericGrain() {
    return (
        <div className="pointer-events-none fixed inset-0 z-[100] h-full w-full overflow-hidden opacity-[0.05]">
            <div className="absolute inset-[-100%] h-[300%] w-[300%] bg-noise-pattern animate-grain" />

            <style jsx>{`
                .bg-noise-pattern {
                    background-image: url("https://grainy-gradients.vercel.app/noise.svg");
                    background-repeat: repeat;
                    background-size: 150px;
                }

                @keyframes grain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(-10%, 5%); }
                    30% { transform: translate(5%, -10%); }
                    40% { transform: translate(-5%, 15%); }
                    50% { transform: translate(-10%, 5%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 10%); }
                    80% { transform: translate(-15%, 0); }
                    90% { transform: translate(10%, 5%); }
                }

                .animate-grain {
                    animation: grain 1.2s steps(4) infinite;
                    will-change: transform;
                }
            `}</style>
        </div>
    );
}
