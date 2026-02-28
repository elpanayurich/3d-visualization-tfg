import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { ExplanationArticle } from './components/ExplanationArticle';
import './index.css';

// Custom Free-Camera Rig mapping true WASD horizontal movement and Q/E vertical movement
const CameraRig = () => {
  const controlsRef = useRef<any>(null);
  const keys = useRef({ w: false, a: false, s: false, d: false, q: false, e: false, shift: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) {
        (keys.current as any)[key] = true;
      }
      if (e.key === 'Shift') keys.current.shift = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) {
        (keys.current as any)[key] = false;
      }
      if (e.key === 'Shift') keys.current.shift = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    
    // Base speed, multiplied by shift modifier
    const speed = (keys.current.shift ? 80 : 40) * delta; 
    const move = new THREE.Vector3();
    
    // Get camera's flat forward vector (ignoring pitch)
    const forward = new THREE.Vector3();
    controlsRef.current.object.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    // Get camera's flat right vector
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // Map WASD to flat vector translations
    if (keys.current.w) move.add(forward.clone().multiplyScalar(speed));
    if (keys.current.s) move.add(forward.clone().multiplyScalar(-speed));
    if (keys.current.a) move.add(right.clone().multiplyScalar(-speed));
    if (keys.current.d) move.add(right.clone().multiplyScalar(speed));
    
    // Map Q/E to vertical Y translation
    if (keys.current.e) move.y += speed;
    if (keys.current.q) move.y -= speed;

    if (move.lengthSq() > 0) {
      // Both the actual camera position AND the OrbitControls pivot point must be shifted together
      controlsRef.current.target.add(move);
      controlsRef.current.object.position.add(move);
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      makeDefault
      enableDamping 
      dampingFactor={0.05} 
      minDistance={2} 
      maxDistance={150} 
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from dropping beneath the floor
      enablePan={false} // Disable default buggy right-click pan to force use of keyboard
    />
  );
};

const App = () => {
  const [showGrid, setShowGrid] = useState(false);
  const [risRadius, setRisRadius] = useState(15);
  const [connectedUsersCount, setConnectedUsersCount] = useState(0);
  const [transparentBuildings, setTransparentBuildings] = useState(false);
  const [apFactor, setApFactor] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedApId, setSelectedApId] = useState<number | null>(null);
  const [simulationStats, setSimulationStats] = useState({ users: 15, aps: 0, ris: 0 });

  // If we unselect a user, we must also reset the AP selection
  useEffect(() => {
    if (selectedUserId === null) {
      setSelectedApId(null);
    }
  }, [selectedUserId]);

  return (
    <>
      {/* 3D App Container - Forced to exactly one screen height */}
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Canvas
          camera={{ position: [30, 25, 30], fov: 45 }}
          style={{ width: '100%', height: '100%', background: '#050508' }}
        >
        <color attach="background" args={['#050508']} />
        
        {/* The beautiful 3D World */}
        <Suspense fallback={null}>
          <Scene 
            showGrid={showGrid} 
            risRadius={risRadius} 
            setConnectedCount={setConnectedUsersCount} 
            transparentBuildings={transparentBuildings} 
            apFactor={apFactor} 
            selectedUserId={selectedUserId}
            selectedApId={selectedApId}
            setSimulationStats={setSimulationStats}
          />
        </Suspense>

        {/* Post-processing layer for glowing neon elements */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.5} 
            luminanceSmoothing={0.9} 
            intensity={1.5} 
          />
        </EffectComposer>

        {/* Custom Physics Camera Controls */}
        <CameraRig />
      </Canvas>

        {/* The UI Overlay */}
        <Overlay 
           showGrid={showGrid} setShowGrid={setShowGrid} 
           risRadius={risRadius} setRisRadius={setRisRadius} 
           connectedUsersCount={connectedUsersCount}
           transparentBuildings={transparentBuildings} setTransparentBuildings={setTransparentBuildings}
           apFactor={apFactor} setApFactor={setApFactor}
           selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId}
           selectedApId={selectedApId} setSelectedApId={setSelectedApId}
           simulationStats={simulationStats}
        />

        {/* Scroll Indicator */}
        <div 
          className="scroll-indicator" 
          onClick={() => {
            const el = document.getElementById('tech-details');
            if (!el) return;
            
            const startPosition = window.pageYOffset;
            const targetPosition = el.offsetTop;
            const distance = targetPosition - startPosition;
            const duration = 2000; // 2 seconds
            let start: number | null = null;
            
            // easeInOutCubic easing function
            const easeInOut = (t: number) => {
              return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };

            const step = (timestamp: number) => {
              if (!start) start = timestamp;
              const progress = timestamp - start;
              const percent = Math.min(progress / duration, 1);
              
              window.scrollTo(0, startPosition + distance * easeInOut(percent));
              
              if (progress < duration) {
                window.requestAnimationFrame(step);
              }
            };
            
            window.requestAnimationFrame(step);
          }}
        >
          <span>Scroll for Technical Details</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>

        {/* Seamless transition gradient */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '12vh',
          background: 'linear-gradient(to bottom, transparent 0%, var(--dark-bg) 100%)',
          pointerEvents: 'none',
          zIndex: 50
        }} />
      </div>

      {/* The scrolling explanatory article */}
      <div id="tech-details">
        <ExplanationArticle />
      </div>
    </>
  );
};

export default App;
