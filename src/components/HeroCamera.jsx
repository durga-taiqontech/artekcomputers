import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, RoundedBox, Sparkles, useGLTF } from '@react-three/drei'
import { Box3, MathUtils, Vector3 } from 'three'

/* ---------- Settings you may want to tweak ---------- */
const MODEL_URL = '/models/cctv.glb' // file in public/models
const TARGET_SIZE = 3.2 // size of the model on screen (bigger = larger camera)
const MODEL_YAW = 0 // if the lens faces the wrong way: Math.PI (flip) or Math.PI / 2 (quarter turn)
const START_YAW = -0.6 // starting angle of the whole camera
const BLUE = '#1E6BFF'

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/* Renders `fallback` (or nothing) if anything inside throws: missing model, no WebGL, etc. */
class SafeBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('[HeroCamera]', error?.message || error)
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}

/* Mouse-follow, idle pan and scroll rotation, shared by the model and the built-in camera. */
function useCameraRig(animate) {
  const outer = useRef() // whole camera: turns with scroll
  const aim = useRef() // head: follows the cursor
  const mouse = useRef({ x: 0, y: 0, last: -Infinity })

  useEffect(() => {
    if (aim.current) aim.current.rotation.order = 'YXZ'
  }, [])

  useEffect(() => {
    if (!animate) return undefined
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
      mouse.current.last = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [animate])

  useFrame((state, dt) => {
    if (!animate || !outer.current || !aim.current) return
    const t = state.clock.elapsedTime
    const idle = performance.now() - mouse.current.last > 2500

    const yaw = idle ? Math.sin(t * 0.5) * 0.55 : mouse.current.x * 0.6
    const pitch = idle ? Math.sin(t * 0.35) * 0.06 : -mouse.current.y * 0.3
    aim.current.rotation.y = MathUtils.damp(aim.current.rotation.y, yaw, 3, dt)
    aim.current.rotation.x = MathUtils.damp(aim.current.rotation.x, pitch, 3, dt)

    const p = clamp01(window.scrollY / (window.innerHeight * 0.9))
    outer.current.rotation.y = MathUtils.damp(outer.current.rotation.y, START_YAW + p * Math.PI, 4, dt)
  })

  return { outer, aim }
}

/* ---------- Real 3D model (public/models/cctv.glb) ---------- */
function Model({ animate }) {
  const { scene } = useGLTF(MODEL_URL)
  const { outer, aim } = useCameraRig(animate)

  // Auto-fit: centre the model and scale its longest side to TARGET_SIZE.
  const fit = useMemo(() => {
    const object = scene.clone(true)
    const box = new Box3().setFromObject(object)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const longest = Math.max(size.x, size.y, size.z) || 1
    return { object, center, scale: TARGET_SIZE / longest }
  }, [scene])

  return (
    <group ref={outer} rotation={[0, START_YAW, 0]}>
      <group ref={aim}>
        <group rotation={[0, MODEL_YAW, 0]} scale={fit.scale}>
          <primitive object={fit.object} position={[-fit.center.x, -fit.center.y, -fit.center.z]} />
        </group>
      </group>
    </group>
  )
}

/* ---------- Built-in camera, used only if the model cannot load ---------- */
const Body = () => (
  <meshPhysicalMaterial color="#eef2f8" metalness={0.55} roughness={0.28} clearcoat={1} clearcoatRoughness={0.12} />
)
const Dark = () => <meshStandardMaterial color="#141b2d" metalness={0.8} roughness={0.35} />
const Glass = () => <meshPhysicalMaterial color="#05080f" metalness={1} roughness={0.04} clearcoat={1} />

function FallbackCamera({ animate }) {
  const { outer, aim } = useCameraRig(animate)
  return (
    <group ref={outer} rotation={[0, START_YAW, 0]} position={[0, -0.95, 0]} scale={1.05}>
      <RoundedBox args={[1.5, 0.12, 0.9]} radius={0.04} smoothness={4} position={[0, 2.12, 0]}>
        <Dark />
      </RoundedBox>
      <mesh position={[0, 1.58, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 1.1, 24]} />
        <Dark />
      </mesh>
      <group ref={aim} position={[0, 1.05, 0]}>
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <Dark />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 24]} />
          <Dark />
        </mesh>
        <group position={[0, -0.95, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 1.8, 48]} />
            <Body />
          </mesh>
          <mesh position={[0, 0, -0.9]}>
            <sphereGeometry args={[0.5, 48, 32]} />
            <Body />
          </mesh>
          <RoundedBox args={[1.12, 0.06, 2.3]} radius={0.03} smoothness={4} position={[0, 0.55, 0.2]}>
            <Body />
          </RoundedBox>
          <mesh position={[0, 0, 0.92]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.53, 0.53, 0.14, 48]} />
            <Dark />
          </mesh>
          <mesh position={[0, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.04, 48]} />
            <Glass />
          </mesh>
          <mesh position={[0, 0, 1.025]}>
            <torusGeometry args={[0.3, 0.022, 16, 64]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 1.03]} scale={[1, 1, 0.45]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <Glass />
          </mesh>
          <mesh position={[0, 0, 1.1]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={4} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* ---------- Canvas ---------- */
export default function HeroCamera() {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  // Pause rendering when the hero is off screen.
  useEffect(() => {
    const el = wrap.current
    if (!el) return undefined
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const scene = (
    <SafeBoundary fallback={<FallbackCamera animate={!reduce} />}>
      <Model animate={!reduce} />
    </SafeBoundary>
  )

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      style={{ width: '100%', height: 'clamp(320px, 42vw, 520px)', pointerEvents: 'none' }}
    >
      <SafeBoundary>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.2, 7.2], fov: 35 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          frameloop={visible ? 'always' : 'never'}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            {/* Studio lighting built in code: no HDR file is downloaded */}
            <Environment resolution={256} frames={1}>
              <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, -6]} scale={[10, 6, 1]} rotation-x={Math.PI / 2} />
              <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[5, 1, 3]} scale={[1.5, 6, 1]} rotation-y={-Math.PI / 2} />
              <Lightformer form="rect" intensity={3} color={BLUE} position={[-5, 1, -2]} scale={[1.5, 6, 1]} rotation-y={Math.PI / 2} />
              <Lightformer form="rect" intensity={2} color={BLUE} position={[0, -2, -6]} scale={[8, 1.5, 1]} />
            </Environment>

            <ambientLight intensity={0.35} />
            <directionalLight position={[4, 5, 5]} intensity={1.2} />
            <pointLight position={[-4, 1, -2]} color={BLUE} intensity={30} />

            {reduce ? (
              scene
            ) : (
              <>
                <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.5}>
                  {scene}
                </Float>
                <Sparkles count={45} scale={[7, 4, 3]} size={2.2} speed={0.25} opacity={0.7} color="#6ea8ff" position={[0, 0.5, -1]} />
              </>
            )}
          </Suspense>
        </Canvas>
      </SafeBoundary>
    </div>
  )
}