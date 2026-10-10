"use client";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { FINISHES, type FinishKey } from "@/lib/finishes";

/* ------------------------------------------------------------------
 * DIKOR hero scene — a parametric, layer-lined keepsake vase that
 * "prints" itself layer by layer (clipping plane + glowing nozzle ring),
 * then rotates slowly. Finish (material) is switchable from the UI.
 * ------------------------------------------------------------------ */

const H = 2.5; // sculpture height
const Y0 = -1.05; // world-space bottom of sculpture
const PRINT_SECONDS = 4.2;

/** Base silhouette radius at normalised height t ∈ [0,1]. */
function profile(t: number) {
  const belly = 0.62 * Math.sin(Math.PI * Math.min(1, t * 1.08)) ** 0.9;
  const neck = 0.2 * Math.exp(-((t - 0.86) ** 2) / 0.01);
  const lip = t > 0.93 ? (t - 0.93) * 2.2 : 0;
  return Math.max(0.16, 0.3 + belly - neck + lip);
}
const LOBES = 7;
const TWIST = 2.4;
function radiusAt(t: number, theta: number) {
  return profile(t) * (1 + 0.075 * Math.cos(LOBES * theta + TWIST * t * Math.PI));
}

function buildVase() {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, 0)];
  const STEPS = 180;
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    pts.push(new THREE.Vector2(profile(t), t * H));
  }
  let geo: THREE.BufferGeometry = new THREE.LatheGeometry(pts, 192);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    if (r < 1e-5) continue;
    const t = v.y / H;
    const theta = Math.atan2(v.z, v.x);
    // fine 3D-print layer lines (subtle ridges)
    const layer = 1 + 0.006 * Math.sin(t * H * 260);
    const nr = radiusAt(t, theta) * layer;
    pos.setXYZ(i, (v.x / r) * nr, v.y, (v.z / r) * nr);
  }
  geo.deleteAttribute("normal");
  geo.deleteAttribute("uv");
  geo = mergeVertices(geo, 1e-4);
  geo.computeVertexNormals();
  geo.translate(0, Y0, 0);
  return geo;
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return reduce;
}

function Sculpture({
  finish,
  reduce,
  progressRef,
}: {
  finish: FinishKey;
  reduce: boolean;
  progressRef?: RefObject<HTMLElement>;
}) {
  const { gl } = useThree();
  const spin = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const nozzle = useRef<THREE.Group>(null);
  const started = useRef<number | null>(null);
  const lastPct = useRef(-1);

  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  const geo = useMemo(buildVase, []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), Y0), []);
  const mat = useMemo(() => {
    const f = FINISHES[0];
    return new THREE.MeshStandardMaterial({
      color: f.color,
      metalness: f.metalness,
      roughness: f.roughness,
      side: THREE.DoubleSide,
      clippingPlanes: [plane],
      envMapIntensity: 1.15,
    });
  }, [plane]);
  const walnut = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a2320", metalness: 0.2, roughness: 0.55 }), []);
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d4af37", metalness: 1, roughness: 0.2 }), []);
  const glow = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#ffd98a", transparent: true, opacity: 0.95, toneMapped: false }),
    []
  );
  const target = useMemo(() => new THREE.Color(), []);

  useEffect(
    () => () => {
      geo.dispose();
      [mat, walnut, gold, glow].forEach((m) => m.dispose());
    },
    [geo, mat, walnut, gold, glow]
  );

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime;
    if (started.current === null) started.current = now;
    const raw = reduce ? 1 : Math.min(1, (now - started.current - 0.35) / PRINT_SECONDS);
    const p = Math.max(0, raw);
    const eased = 1 - Math.pow(1 - p, 2.2);
    const h = Y0 + eased * (H + 0.02);
    plane.constant = p >= 1 ? Y0 + H + 1 : h;

    // print head ring + nozzle
    const t = Math.min(1, eased);
    const rr = profile(t) * 1.1 + 0.03;
    const visible = p > 0 && p < 1;
    if (ring.current) {
      ring.current.visible = visible;
      ring.current.position.y = h;
      ring.current.scale.setScalar(rr);
    }
    if (nozzle.current) {
      nozzle.current.visible = visible;
      const a = now * 5.5;
      nozzle.current.position.set(Math.cos(a) * rr, h + 0.06, Math.sin(a) * rr);
    }

    // progress readout in the DOM (only when the integer changes)
    const pct = Math.round(p * 100);
    if (progressRef?.current && pct !== lastPct.current) {
      lastPct.current = pct;
      progressRef.current.textContent = pct >= 100 ? "Print complete" : `Printing · ${pct}%`;
    }

    // finish transition
    const f = FINISHES.find((x) => x.key === finish) ?? FINISHES[0];
    const k = 1 - Math.pow(0.002, delta);
    target.set(f.color);
    mat.color.lerp(target, k);
    mat.metalness += (f.metalness - mat.metalness) * k;
    mat.roughness += (f.roughness - mat.roughness) * k;

    if (!reduce && spin.current) {
      spin.current.rotation.y += delta * (p >= 1 ? 0.32 : 0.12);
      const { x, y } = state.pointer;
      spin.current.rotation.x = THREE.MathUtils.lerp(spin.current.rotation.x, -y * 0.08, 0.04);
      spin.current.rotation.z = THREE.MathUtils.lerp(spin.current.rotation.z, -x * 0.05, 0.04);
    }
  });

  return (
    <group>
      <group ref={spin}>
        <mesh geometry={geo} material={mat} castShadow />
      </group>
      {/* pedestal */}
      <mesh position={[0, Y0 - 0.2, 0]} material={walnut}>
        <cylinderGeometry args={[1.05, 1.18, 0.4, 72]} />
      </mesh>
      <mesh position={[0, Y0 - 0.005, 0]} material={gold}>
        <cylinderGeometry args={[1.06, 1.06, 0.03, 72]} />
      </mesh>
      {/* print head */}
      <mesh ref={ring} material={glow} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <torusGeometry args={[1, 0.012, 12, 128]} />
      </mesh>
      <group ref={nozzle} visible={false}>
        <mesh material={gold} position={[0, 0.09, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.05, 0.14, 24]} />
        </mesh>
        <pointLight color="#ffcf7a" intensity={1.6} distance={1.6} decay={2} />
      </group>
    </group>
  );
}

function StudioLights() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#efe4d2"]} />
      <Lightformer form="rect" intensity={3} color="#fff3df" position={[0, 4, 2]} scale={[8, 2, 1]} />
      <Lightformer form="rect" intensity={2} color="#ffd9c9" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={1.6} color="#ffe7b3" position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
      <Lightformer form="ring" intensity={2.4} color="#ffffff" position={[2, 2.5, 4]} scale={1.6} />
    </Environment>
  );
}

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function SceneFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="relative h-[70%] aspect-[3/4]">
        <div className="absolute inset-x-[18%] bottom-[8%] top-[6%] rounded-[45%_45%_38%_38%/55%_55%_30%_30%] bg-[linear-gradient(160deg,#f3c9cb_0%,#b76e79_55%,#8a4c56_100%)] shadow-soft" />
        <div className="absolute inset-x-[6%] bottom-0 h-[9%] rounded-[50%] bg-charcoal" />
      </div>
    </div>
  );
}

export default function Hero3D({
  finish,
  progressRef,
}: {
  finish: FinishKey;
  progressRef?: RefObject<HTMLElement>;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [ok, setOk] = useState<boolean | null>(null);
  const [inView, setInView] = useState(true);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    setOk(webglAvailable());
    setSmall(window.innerWidth < 768);
  }, []);

  // pause rendering when the hero is scrolled out of view (battery + perf)
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (ok === false && progressRef?.current) progressRef.current.textContent = "Hand-finished";
  }, [ok, progressRef]);

  return (
    <div ref={wrap} className="hero-canvas absolute inset-0" aria-hidden>
      {ok === false && <SceneFallback />}
      {ok && (
        <SceneBoundary fallback={<SceneFallback />}>
          <Canvas
            frameloop={inView ? "always" : "never"}
            dpr={[1, small ? 1.5 : 1.75]}
            camera={{ position: [0, 0.55, small ? 6.4 : 5.6], fov: 38 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.05;
            }}
          >
            <ambientLight intensity={0.35} color="#fff4e0" />
            <directionalLight position={[3, 5, 4]} intensity={1.1} color="#fff1d6" />
            <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#f2b8c0" />
            <StudioLights />
            <Sculpture finish={finish} reduce={reduce} progressRef={progressRef} />
            {!reduce && (
              <Sparkles count={small ? 26 : 48} scale={[5, 4, 3]} position={[0, 0.6, 0]} size={3} speed={0.3} color="#e9ce7a" opacity={0.7} />
            )}
            <ContactShadows position={[0, Y0 - 0.41, 0]} opacity={0.4} scale={7} blur={2.4} far={3} color="#2a2320" />
          </Canvas>
        </SceneBoundary>
      )}
    </div>
  );
}
