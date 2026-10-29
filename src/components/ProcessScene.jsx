import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Environment, Grid, Lightformer, Line, useGLTF } from '@react-three/drei'
import { Box3, DoubleSide, MathUtils, Vector3 } from 'three'

/* ---------- Settings you may want to tweak ---------- */
const MODEL_URL = '/models/cctv.glb' // same model as the hero
const MODEL_YAW = 0.35 // turn the camera model left/right on its pole
const CAMERA_SIZE = 1.9 // size of the camera in the scene
const FLOOR_Y = -1.2
const BLUE = '#1E6BFF'
const CYAN = '#38D4FF'

/* Renders `fallback` (or nothing) if anything inside throws. */
class SafeBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('[ProcessScene]', error?.message || error)
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}

/* Smoothly scales a group in and out. */
function Pop({ show, speed = 5, children, ...props }) {
  const ref = useRef()
  const v = useRef(0)
  useFrame((_, dt) => {
    if (!ref.current) return
    v.current = MathUtils.damp(v.current, show ? 1 : 0, speed, dt)
    ref.current.visible = v.current > 0.01
    ref.current.scale.setScalar(Math.max(v.current, 0.0001))
  })
  return (
    <group ref={ref} scale={0.0001} visible={false} {...props}>
      {children}
    </group>
  )
}

/* A ring that expands and fades, again and again. */
function PulseRing({ show, y, max = 3.6, period = 2.4, color = CYAN }) {
  const ring = useRef()
  const mat = useRef()
  const v = useRef(0)
  useFrame((state, dt) => {
    if (!ring.current || !mat.current) return
    v.current = MathUtils.damp(v.current, show ? 1 : 0, 5, dt)
    const t = (state.clock.elapsedTime % period) / period
    ring.current.visible = v.current > 0.01
    ring.current.scale.setScalar(0.2 + t * max)
    mat.current.opacity = (1 - t) * 0.9 * v.current
  })
  return (
    <mesh ref={ring} position={[0, y, 0]} rotation-x={-Math.PI / 2} visible={false}>
      <ringGeometry args={[0.94, 1, 64]} />
      <meshBasicMaterial ref={mat} color={color} transparent opacity={0} side={DoubleSide} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

/* ---------- Floor plan (always visible) ---------- */
const PY = FLOOR_Y + 0.01
const PLAN = [
  [-3.2, PY, -2], [3.2, PY, -2], [3.2, PY, 2], [-3.2, PY, 2], [-3.2, PY, -2],
]
const PLAN_WALL_A = [[-0.9, PY, -2], [-0.9, PY, 0.5]]
const PLAN_WALL_B = [[-0.9, PY, 0.5], [1.2, PY, 0.5]]

/* ---------- Step 2: camera positions with their field of view ---------- */
const CAM_SPOTS = [[-2.7, -1.6], [2.7, -1.6], [-2.7, 1.6], [2.7, 1.6]]

function FovMarkers({ show }) {
  return CAM_SPOTS.map(([x, z], i) => (
    <Pop key={i} show={show} speed={6 - i * 1.1} position={[x, FLOOR_Y + 0.03, z]}>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={CYAN} toneMapped={false} />
      </mesh>
      <group rotation-y={Math.atan2(z, -x)}>
        <mesh rotation-x={-Math.PI / 2}>
          <circleGeometry args={[2.8, 40, -0.55, 1.1]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.22} side={DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </Pop>
  ))
}

/* ---------- Camera model ---------- */
function CctvModel() {
  const { scene } = useGLTF(MODEL_URL)
  const fit = useMemo(() => {
    const object = scene.clone(true)
    const box = new Box3().setFromObject(object)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const longest = Math.max(size.x, size.y, size.z) || 1
    return { object, center, scale: CAMERA_SIZE / longest }
  }, [scene])

  return (
    <group scale={fit.scale}>
      <primitive object={fit.object} position={[-fit.center.x, -fit.center.y, -fit.center.z]} />
    </group>
  )
}

/* Used only if the model cannot load. */
function SimpleCamera() {
  return (
    <group>
      <mesh rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.28, 0.28, 1.3, 32]} />
        <meshStandardMaterial color="#eef2f8" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.66, 0, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 32]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[-0.1, -0.4, 0]}>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color="#141b2d" metalness={0.8} roughness={0.35} />
      </mesh>
    </group>
  )
}

/* Step 3: the camera flies in from above and lands on the pole. */
function CameraRig({ step }) {
  const grp = useRef()
  const v = useRef(0)
  useFrame((_, dt) => {
    if (!grp.current) return
    v.current = MathUtils.damp(v.current, step >= 2 ? 1 : 0, 3.2, dt)
    const e = 1 - Math.pow(1 - v.current, 3)
    grp.current.visible = v.current > 0.01
    grp.current.position.set((1 - e) * 3.4, 0.2 + (1 - e) * 3.6, (1 - e) * 1.6)
    grp.current.rotation.set(0, MODEL_YAW + (1 - e) * 3.2, (1 - e) * 0.6)
  })
  return (
    <group ref={grp} visible={false}>
      <SafeBoundary fallback={<SimpleCamera />}>
        <Suspense fallback={null}>
          <CctvModel />
        </Suspense>
      </SafeBoundary>
    </group>
  )
}

/* ---------- Step 4: handover badge ---------- */
function Badge({ show }) {
  return (
    <Pop show={show} position={[1.9, 0.9, 0.4]}>
      <Billboard>
        <mesh>
          <circleGeometry args={[0.62, 48]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.16} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.5, 0.035, 16, 64]} />
          <meshBasicMaterial color={CYAN} toneMapped={false} />
        </mesh>
        <Line points={[[-0.22, 0, 0.01], [-0.06, -0.17, 0.01], [0.25, 0.2, 0.01]]} color="#ffffff" lineWidth={5} />
      </Billboard>
    </Pop>
  )
}

/* ---------- Step 5: ongoing support, a light orbiting the camera ---------- */
function Orbit({ show }) {
  const spin = useRef()
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.9
  })
  return (
    <Pop show={show} position={[0, 0.2, 0]}>
      <group rotation-x={0.5}>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[1.35, 0.012, 8, 120]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.7} toneMapped={false} />
        </mesh>
        <group ref={spin}>
          <mesh position={[1.35, 0, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </Pop>
  )
}

/* Slow side-to-side drift of the viewpoint. */
function Sway() {
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.7
    state.camera.lookAt(0, -0.1, 0)
  })
  return null
}

function Scene({ step }) {
  return (
    <>
      <Sway />

      {/* Studio lighting built in code: no HDR file is downloaded */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, -6]} scale={[10, 6, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[5, 1, 3]} scale={[1.5, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={3} color={BLUE} position={[-5, 1, -2]} scale={[1.5, 6, 1]} rotation-y={Math.PI / 2} />
      </Environment>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <pointLight position={[-4, 2, -2]} color={BLUE} intensity={30} />

      {/* Floor and plan */}
      <Grid
        position={[0, FLOOR_Y, 0]}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#16325f"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor={BLUE}
        fadeDistance={16}
        fadeStrength={1.5}
        infiniteGrid
      />
      <Line points={PLAN} color={BLUE} lineWidth={1.6} transparent opacity={0.7} />
      <Line points={PLAN_WALL_A} color={BLUE} lineWidth={1.2} transparent opacity={0.5} />
      <Line points={PLAN_WALL_B} color={BLUE} lineWidth={1.2} transparent opacity={0.5} />

      {/* Step 1: free site survey */}
      <PulseRing show={step === 0} y={FLOOR_Y + 0.02} max={3.6} period={2.4} />
      <Pop show={step === 0} position={[0, FLOOR_Y + 0.08, 0]}>
        <mesh>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshBasicMaterial color={CYAN} toneMapped={false} />
        </mesh>
      </Pop>

      {/* Step 2: system design */}
      <FovMarkers show={step === 1} />

      {/* Steps 3 to 5: pole and camera */}
      <Pop show={step >= 2} speed={4} position={[0, FLOOR_Y, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1, 24]} />
          <meshStandardMaterial color="#141b2d" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.03, 40]} />
          <meshStandardMaterial color="#141b2d" metalness={0.8} roughness={0.35} />
        </mesh>
      </Pop>
      <CameraRig step={step} />
      <PulseRing show={step === 2} y={-0.2} max={1.4} period={1.6} />

      {/* Step 4: handover */}
      <Badge show={step === 3} />

      {/* Step 5: ongoing support */}
      <Orbit show={step === 4} />
      <PulseRing show={step === 4} y={0.2} max={2.2} period={2.2} color={BLUE} />
    </>
  )
}

/**
 * Props:
 *   step     index of the active "How it works" step (0 to 4)
 *   label    optional small caption shown in the corner, for example "Step 3 · Installation"
 *   fallback what to show if WebGL or the scene fails (for example the photo panel)
 */
export default function ProcessScene({ step = 0, label, fallback = null }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)
  const [reduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // Pause rendering when the panel is off screen.
  useEffect(() => {
    const el = wrap.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (reduce) return fallback

  return (
    <SafeBoundary fallback={fallback}>
      <div
        ref={wrap}
        aria-hidden="true"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '2 / 1',
          borderRadius: 24,
          overflow: 'hidden',
          background: 'radial-gradient(70% 90% at 70% 40%, #12306b 0%, #0a1224 70%)',
          border: '1px solid rgba(56, 212, 255, 0.2)',
          boxShadow: '0 24px 60px rgba(10, 18, 36, 0.35)',
          pointerEvents: 'none',
        }}
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 2.4, 6.4], fov: 38 }}
          gl={{ alpha: true, antialias: true }}
          frameloop={visible ? 'always' : 'never'}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Scene step={step} />
          </Suspense>
        </Canvas>
        {label && (
          <span
            style={{
              position: 'absolute',
              left: 16,
              bottom: 14,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(10, 18, 36, 0.7)',
              color: '#fff',
              fontSize: '0.85rem',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {label}
          </span>
        )}
      </div>
    </SafeBoundary>
  )
}