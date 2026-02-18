import { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

export default function Scene() {
    return (
        <>
            {/* 3D Scene */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Suspense fallback={<div style={{ color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>Loading Experience...</div>}>
                    <Spline scene="https://prod.spline.design/aJtTmlHN9KU2D7I8/scene.splinecode" />
                </Suspense>
            </div>
        </>
    )
}
