'use client';

import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { use, useEffect, useId, useRef, useState } from 'react';

export function Mermaid({ chart }: { chart: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(
    key: string,
    setPromise: () => Promise<T>,
): Promise<T> {
    const cached = cache.get(key);
    if (cached) return cached as Promise<T>;

    const promise = setPromise();
    cache.set(key, promise);
    return promise;
}

function MermaidContent({ chart }: { chart: string }) {
    const id = useId();
    const { resolvedTheme } = useTheme();
    const { default: mermaid } = use(
        cachePromise('mermaid', () => import('mermaid')),
    );

    // --- Zoom & Pan State ---
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });

    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'inherit',
        themeCSS: 'margin: 0; text-align: center;', // Reset margins
        theme: resolvedTheme === 'dark' ? 'dark' : 'base',
    });

    const { svg, bindFunctions } = use(
        cachePromise(`${chart}-${resolvedTheme}`, () => {
            return mermaid.render(id.replace(/:/g, ''), chart.replaceAll('\\n', '\n'));
        }),
    );

    // --- Event Handlers ---

    // Wheel Zoom
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                // Allow normal page zoom if ctrl is pressed
                return;
            }
            e.preventDefault();
            e.stopPropagation();

            const delta = -e.deltaY * 0.001;
            setScale(prevScale => {
                // Allow slightly more zoom in (5x) and zoom out (0.2x)
                return Math.min(Math.max(0.2, prevScale + delta), 5);
            });
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition({
            x: e.clientX - dragStartRef.current.x,
            y: e.clientY - dragStartRef.current.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    const resetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // --- Render ---
    return (
        <div
            className="relative w-full border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/50 my-6 group"
            style={{ height: '500px' }}
        >
            {/* Toolbar */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={() => setScale(s => Math.min(s + 0.2, 5))}
                    className="p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setScale(s => Math.max(s - 0.2, 0.2))}
                    className="p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </button>
                <button
                    onClick={resetView}
                    className="p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
                    title="Reset View"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* Interactive Canvas */}
            <div
                ref={containerRef}
                className={`w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    // Crucial: The CSS classes here force the SVG to take full width
                    // [&_svg]:max-w-none removes Mermaid's default constraint
                    // [&_svg]:w-full forces edge-to-edge
                    className="[&_svg]:max-w-none [&_svg]:w-full [&_svg]:h-auto w-full"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        transformOrigin: 'center'
                    }}
                    ref={(container) => {
                        if (container) bindFunctions?.(container);
                    }}
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            </div>
        </div>
    );
}