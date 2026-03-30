'use client';

import dynamic from 'next/dynamic';

// ShaderGradient uses WebGL — must be client-only, no SSR
const ShaderGradientCanvas = dynamic(
  () => import('@shadergradient/react').then((m) => m.ShaderGradientCanvas),
  { ssr: false }
);
const ShaderGradient = dynamic(
  () => import('@shadergradient/react').then((m) => m.ShaderGradient),
  { ssr: false }
);

export default function HeroGradient() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    >
      <ShaderGradient
        animate="on"
        brightness={1.2}
        cAzimuthAngle={180}
        cDistance={3.61}
        cPolarAngle={90}
        cameraZoom={1}
        color1="#ff5005"
        color2="#dbba95"
        color3="#d0bce1"
        destination="onCanvas"
        envPreset="city"
        fov={45}
        grain="on"
        lightType="3d"
        pixelDensity={1}
        positionX={-1.4}
        positionY={0}
        positionZ={0}
        reflection={0.1}
        rotationX={0}
        rotationY={10}
        rotationZ={50}
        shader="defaults"
        type="plane"
        uAmplitude={1}
        uDensity={1.3}
        uFrequency={5.5}
        uSpeed={0.4}
        uStrength={4}
        uTime={0}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  );
}
