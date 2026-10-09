"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * Abstract premium "keepsake" sculpture built from primitives:
 * a figurine-like form (capsule torso + sphere head) in rose-gold metal,
 * embraced by a floating gold torus ring, standing on a dark pedestal.
 */
function Sculpture() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const reduce = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useFrame((state, delta) => {
    if (reduce) return;
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
      // gentle mouse parallax
      const { x, y } = state.pointer;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.12, 0.05);
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, x * 0.25, 0.05);
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.3;
      ring.current.rotation.x = Math.sin(t * 0.4) * 0.25 + 1.1;
    }
  });

  const roseGold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c98a94", metalness: 0.85, roughness: 0.28 }),
    []
  );
  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d4af37", metalness: 1, roughness: 0.22 }),
    []
  );
  const walnut = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2a2320", metalness: 0.15, roughness: 0.6 }),
    []
  );
  const cream = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f3ead9", metalness: 0.1, roughness: 0.5 }),
    []
  );

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      {/* pedestal */}
      <mesh position={[0, -1.55, 0]} material={walnut}>
        <cylinderGeometry args={[0.85, 1.0, 0.5, 48]} />
      </mesh>
      <mesh position={[0, -1.28, 0]} material={gold}>
        <cylinderGeometry args={[0.86, 0.86, 0.035, 48]} />
      </mesh>
      {/* figure: capsule torso */}
      <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.5}>
        <mesh position={[0, 0.1, 0]} material={roseGold}>
          <capsuleGeometry args={[0.42, 0.9, 12, 32]} />
        </mesh>
        {/* head */}
        <mesh position={[0, 1.15, 0]} material={roseGold}>
          <sphereGeometry args={[0.3, 32, 32]} />
        </mesh>
        {/* base disc under figure */}
        <mesh position={[0, -0.72, 0]} material={cream}>
          <cylinderGeometry args={[0.62, 0.62, 0.12, 48]} />
        </mesh>
      </Float>
      {/* floating gold ring */}
      <mesh ref={ring} position={[0, 0.35, 0]} material={gold}>
        <torusGeometry args={[1.15, 0.045, 24, 96]} />
      </mesh>
      {/* small orbiting orbs */}
      {[0, 1, 2].map((i) => (
        <Float key={i} speed={2 + i} floatIntensity={1.2} rotationIntensity={0}>
          <mesh
            position={[Math.cos((i * Math.PI * 2) / 3) * 1.5, 0.4 + i * 0.35, Math.sin((i * Math.PI * 2) / 3) * 1.5]}
            material={i === 1 ? gold : roseGold}
          >
            <sphereGeometry args={[0.09, 24, 24]} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Hero3D() {
  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 640, []);
  return (
    <div className="hero-canvas absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, isMobile ? 1.5 : 1.75]}
        camera={{ position: [0, 0.6, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} color="#fff4e0" />
        <spotLight position={[5, 6, 4]} angle={0.5} penumbra={1} intensity={2.2} color="#ffe9c4" />
        <spotLight position={[-5, 3, -3]} angle={0.6} penumbra={1} intensity={1.1} color="#f0b8c0" />
        <directionalLight position={[0, 4, 6]} intensity={0.5} color="#ffffff" />
        <Sculpture />
        <Sparkles count={isMobile ? 35 : 70} scale={[7, 5, 4]} position={[0, 0.5, 0]} size={4} speed={0.35} color="#e9ce7a" opacity={0.75} />
        <ContactShadows position={[0, -1.85, 0]} opacity={0.35} scale={9} blur={2.6} far={4} color="#2a2320" />
      </Canvas>
    </div>
  );
}
