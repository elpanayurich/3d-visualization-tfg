import { useMemo, useRef, useEffect } from 'react';
import { Box, Sphere, Environment, Plane, Line, Edges, Cylinder, useTexture, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Constants for scene layout
const CITY_SIZE = 60;
const NUM_USERS = 15;

// Utility to get random position
const randomSpread = (spread: number) => (Math.random() - 0.5) * spread;

// Generate Data on a Grid matching MATLAB reference topology
const generateData = () => {
  // 12x12 Building Grid -> 144 buildings total.
  // With 12x12 buildings and 4x4 AP blocks, each block gets exactly 3x3 buildings!
  const buildings: any[] = [];
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      // 120x120 total size -> 10x10 units per block. Building at center of block.
      const x = -CITY_SIZE + i * 10 + 5;
      const z = -CITY_SIZE + j * 10 + 5;
      const isAP = (i % 3 === 1) && (j % 3 === 1);
      
      buildings.push({
        basePosition: [x, 0, z] as [number, number, number],
        position: [x, 0, z] as [number, number, number],
        isAP,
        apOffsetX: isAP ? (Math.random() - 0.5) * 20 : 0, 
        apOffsetZ: isAP ? (Math.random() - 0.5) * 20 : 0,
        width: 4 + Math.random() * 2, // 4-6 units wide, leaving 4-6 units for streets
        depth: 4 + Math.random() * 2,
        height: 6 + Math.random() * 14,
        textureId: Math.floor(Math.random() * 3) + 1,
      });
    }
  }

  const users = Array.from({ length: NUM_USERS }).map(() => ({
    // Users roam anywhere, typically on streets
    position: [randomSpread(CITY_SIZE * 1.8), 0.2, randomSpread(CITY_SIZE * 1.8)] as [number, number, number]
  }));

  // Network Topology: 16 APs are hosted on the 'isAP' buildings.
  // We will generate their exact interpolated positions during the render phase.

  // Network Topology: 25 RISs exactly on the intersection corners of the 3x3 blocks
  const risCoords = [];
  for(let i=0; i<5; i++) {
    for(let j=0; j<5; j++) {
       // Exact intersections (-60, -30, 0, 30, 60)
       const x = -60 + i * 30;
       const z = -60 + j * 30;
       risCoords.push({ x, z });
    }
  }

  // Snap RISs to nearest buildings and flush mount them on the outward facing wall
  const risPanels = risCoords.map((coord) => {
    const b = buildings.reduce((prev, curr) => {
      const distPrev = Math.hypot(prev.position[0] - coord.x, prev.position[2] - coord.z);
      const distCurr = Math.hypot(curr.position[0] - coord.x, curr.position[2] - coord.z);
      return distCurr < distPrev ? curr : prev;
    });

    // Pick a completely random face: 0=Front(+z), 1=Back(-z), 2=Right(+x), 3=Left(-x)
    const face = Math.floor(Math.random() * 4);
    
    // All RIS panels will be mounted at exactly the same absolute height
    const RIS_MOUNT_HEIGHT = 5.0;

    if (face === 0) {
      // Front face
      return {
        position: [b.position[0], RIS_MOUNT_HEIGHT, b.position[2] + b.depth / 2 + 0.05] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        args: [Math.min(b.width * 0.9, 3.5), 3.0, 0.2] as [number, number, number]
      };
    } else if (face === 1) {
      // Back face
      return {
        position: [b.position[0], RIS_MOUNT_HEIGHT, b.position[2] - b.depth / 2 - 0.05] as [number, number, number],
        rotation: [0, Math.PI, 0] as [number, number, number],
        args: [Math.min(b.width * 0.9, 3.5), 3.0, 0.2] as [number, number, number]
      };
    } else if (face === 2) {
      // Right face
      return {
        position: [b.position[0] + b.width / 2 + 0.05, RIS_MOUNT_HEIGHT, b.position[2]] as [number, number, number],
        rotation: [0, Math.PI / 2, 0] as [number, number, number],
        args: [Math.min(b.depth * 0.9, 3.5), 3.0, 0.2] as [number, number, number]
      };
    } else {
      // Left face
      return {
        position: [b.position[0] - b.width / 2 - 0.05, RIS_MOUNT_HEIGHT, b.position[2]] as [number, number, number],
        rotation: [0, -Math.PI / 2, 0] as [number, number, number],
        args: [Math.min(b.depth * 0.9, 3.5), 3.0, 0.2] as [number, number, number]
      };
    }
  });

  return { buildings, users, risPanels };
};

export const Scene = ({ showGrid = false, risRadius = 15, setConnectedCount, transparentBuildings = false, apFactor = 0, selectedUserId = null, selectedApId = null, setSimulationStats }: { showGrid?: boolean, risRadius?: number, setConnectedCount?: (n: number) => void, transparentBuildings?: boolean, apFactor?: number, selectedUserId?: number | null, selectedApId?: number | null, setSimulationStats?: (stats: any) => void }) => {
  const baseData = useMemo(() => generateData(), []);

  const { buildings, users, aps, risPanels } = useMemo(() => {
    // 1. Calculate shifted buildings
    const shiftedBuildings = baseData.buildings.map((b: any) => {
      if (b.isAP) {
        return {
          ...b,
          position: [
            b.basePosition[0] + b.apOffsetX * apFactor,
            b.basePosition[1],
            b.basePosition[2] + b.apOffsetZ * apFactor
          ] as [number, number, number]
        };
      }
      return b;
    });

    // 2. Generate APs mapped to those shifted buildings
    const dynamicAps = shiftedBuildings
      .filter((b: any) => b.isAP)
      .map((b: any) => ({
        position: [b.position[0], b.height + 1.0, b.position[2]] as [number, number, number]
      }));

    return {
      buildings: shiftedBuildings,
      users: baseData.users,
      aps: dynamicAps,
      risPanels: baseData.risPanels
    };
  }, [baseData, apFactor]);

  useEffect(() => {
    if (setSimulationStats) {
      setSimulationStats({
        users: users.length,
        aps: aps.length,
        ris: risPanels.length
      });
    }
  }, [users.length, aps.length, risPanels.length, setSimulationStats]);

  return (
    <group>
      {/* Debug Topology Grid (Elevated) removed as per user request */}

      {/* City Floor and Streets */}
      <Plane args={[CITY_SIZE * 2, CITY_SIZE * 2]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <meshStandardMaterial color="#08080a" roughness={0.9} />
      </Plane>
      {/* Visual Street Grid - explicitly creating a 4x4 divided layout giving 16 main squares */}
      <gridHelper args={[CITY_SIZE * 2, 4, '#00f0ff', '#00f0ff']} position={[0, 0.01, 0]} />

      {/* Buildings */}
      {buildings.map((b, i) => (
        <Building key={`building-${i}`} {...b} isTransparent={transparentBuildings} />
      ))}

      {/* RIS Panels */}
      {risPanels.map((ris, i) => (
        <group key={`ris-${i}`} position={ris.position} rotation={ris.rotation}>
          <Box args={ris.args as any}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} toneMapped={false} />
            <Edges linewidth={4} color="#39ff14" toneMapped={false} />
          </Box>
          {/* subtle glow box for RIS */}
          <Box args={[ris.args[0] * 1.4, ris.args[1] * 1.4, ris.args[2] + 0.4] as any}>
            <meshBasicMaterial color="#39ff14" transparent opacity={0.6} depthWrite={false} toneMapped={false} />
          </Box>
          {/* RIS Connectivity Radius Debug Sphere */}
          {showGrid && (
             <Sphere args={[risRadius, 32, 16]}>
               <meshBasicMaterial color="#39ff14" wireframe transparent opacity={0.1} depthWrite={false} toneMapped={false} />
             </Sphere>
          )}
        </group>
      ))}

      {/* Cell-Free Access Points */}
      {aps.map((ap, i) => (
         <AccessPoint key={`ap-${i}`} position={ap.position} color="#00f0ff" />
      ))}

      {/* Users */}
      {users.map((user, i) => (
         <Person key={`user-${i}`} position={user.position} color={selectedUserId === null || selectedUserId === i ? "#ff003c" : "#333"} />
      ))}

      {/* Connections (6G Beams) */}
      <Connections users={users} aps={aps} risPanels={risPanels} risRadius={risRadius} setConnectedCount={setConnectedCount} selectedUserId={selectedUserId} selectedApId={selectedApId} />

      {/* Lighting & Environment for Photorealism */}
      <Environment preset="night" background={false} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 20, 10]} intensity={2.5} color="#4455bb" />
      <pointLight position={[0, 10, 0]} intensity={3} color="#00f0ff" />
      
      <SkyAndMoon />
    </group>
  );
};

// Component to handle dynamic connection beams
const Connections = ({ users, aps, risPanels, risRadius, setConnectedCount, selectedUserId, selectedApId }: any) => {
  const { lines, connectedCount } = useMemo(() => {
    const beams: any[] = [];
    
    // Calculate global RIS connected users stat regardless of UI filters
    const globalRisConnectedUsers = new Set<string>();
    
    // Maintain a map of RIS index to the User/AP's position signature
    const risAssignedUserMap = new Map<number, string>();
    const risAssignedApMap = new Map<number, string>();

    risPanels.forEach((ris: any, risIndex: number) => {
      const validUsers = users.filter((u: any) => {
         return new THREE.Vector3(...u.position).distanceTo(new THREE.Vector3(...ris.position)) <= risRadius;
      });
      if (validUsers.length > 0) {
        // Enforce 1:1 constraint (RIS -> closest user ONLY)
        const closestUser = [...validUsers].sort((a, b) => {
           const distA = new THREE.Vector3(...a.position).distanceTo(new THREE.Vector3(...ris.position));
           const distB = new THREE.Vector3(...b.position).distanceTo(new THREE.Vector3(...ris.position));
           return distA - distB;
        })[0];
        
        const userSig = closestUser.position.join(',');
        globalRisConnectedUsers.add(userSig);
        risAssignedUserMap.set(risIndex, userSig);

        // Figure out the closest AP for this RIS
        const closestApToRis = [...aps].sort((a, b) => {
           const distA = new THREE.Vector3(...a.position).distanceTo(new THREE.Vector3(...ris.position));
           const distB = new THREE.Vector3(...b.position).distanceTo(new THREE.Vector3(...ris.position));
           return distA - distB;
        })[0];
        risAssignedApMap.set(risIndex, closestApToRis.position.join(','));
      }
    });

    const getUTarget = (u: any) => [u.position[0], u.position[1] + 0.35, u.position[2]];
    const getApTarget = (ap: any) => [ap.position[0], ap.position[1] + 1.2, ap.position[2]];

    // Active users list based on selection filter
    const activeUsers = selectedUserId !== null ? [users[selectedUserId]] : users;

    // We process user by user to easily track the 4 closest AP indices
    activeUsers.forEach((u: any) => {
      const uTarget = getUTarget(u);
      const uSig = u.position.join(',');

      // Sort APs by distance to this specific user
      const sortedAps = [...aps].sort((a, b) => {
         const distA = new THREE.Vector3(...a.position).distanceTo(new THREE.Vector3(...u.position));
         const distB = new THREE.Vector3(...b.position).distanceTo(new THREE.Vector3(...u.position));
         return distA - distB;
      });

      // Top 4 Closest APs for this user
      const top4Aps = sortedAps.slice(0, 4);
      const opacities = [0.6, 0.4, 0.25, 0.15];

      top4Aps.forEach((apHit, apIndex) => {
        // If an AP is selected, SKIP drawing this link if it's not the requested index
        if (selectedApId !== null && apIndex !== selectedApId) return;

        const apTarget = getApTarget(apHit);
        const apHitSig = apHit.position.join(',');

        // 1. Direct AP Link
        beams.push({ start: uTarget, end: apTarget, color: '#00f0ff', opacity: opacities[apIndex] });

        // 2. See if there is a RIS panel specifically ASSIGNED to THIS user that bounces to THIS AP
        risPanels.forEach((ris: any, risIndex: number) => {
           if (risAssignedUserMap.get(risIndex) === uSig && risAssignedApMap.get(risIndex) === apHitSig) {
              // It matches! Draw the cascaded link: User -> RIS -> AP
              beams.push({ start: uTarget, end: ris.position, color: '#39ff14', opacity: 0.5 });
              beams.push({ start: ris.position, end: apTarget, color: '#39ff14', opacity: 0.5 });
           }
        });
      });
    });

    return { lines: beams, connectedCount: globalRisConnectedUsers.size };
  }, [users, aps, risPanels, risRadius, selectedUserId, selectedApId]);

  useEffect(() => {
    if (setConnectedCount) {
      setConnectedCount(connectedCount);
    }
  }, [connectedCount, setConnectedCount]);

  return (
    <group>
      {/* Static Beams */}
      {lines.map((l: any, i: number) => (
         <Line
           key={`line-${i}`}
           points={[new THREE.Vector3(...l.start), new THREE.Vector3(...l.end)]}
           color={l.color}
           lineWidth={2}
           transparent
           opacity={l.opacity}
           toneMapped={false}
         />
      ))}
      {/* Animated Data Packets */}
      <DataPackets beams={lines} />
    </group>
  );
};

// Animated Data Packets Component
const DataPackets = ({ beams }: { beams: any[] }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCountPerBeam = 3; // Number of packets traveling along each beam simultaneously
  const totalParticles = beams.length * particleCountPerBeam;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Store individual particle progress [0-1] and base speed
  const progressOffsets = useMemo(() => {
    return Array.from({ length: totalParticles }, () => ({
      progress: Math.random(), // start at random positions along the beam
      speed: 0.2 + Math.random() * 0.3 // base speed of 0.2-0.5 per second
    }));
  }, [totalParticles]);

  useFrame((_: any, delta: any) => {
    if (!meshRef.current || beams.length === 0) return;

    let index = 0;
    beams.forEach((beam) => {
      const pStart = new THREE.Vector3(...beam.start);
      const pEnd = new THREE.Vector3(...beam.end);
      const length = pStart.distanceTo(pEnd);
      
      // Calculate a color that matches the beam color but much brighter
      const beamColor = new THREE.Color(beam.color);
      
      for (let i = 0; i < particleCountPerBeam; i++) {
        const pState = progressOffsets[index];
        // Shorter beams should animate slower proportionally to maintain visual consistency
        pState.progress += (pState.speed * delta * 20) / Math.max(length, 1);
        if (pState.progress > 1) pState.progress = 0; // loop back to start

        // Interpolate position
        const currentPos = new THREE.Vector3().lerpVectors(pStart, pEnd, pState.progress);
        
        dummy.position.copy(currentPos);
        dummy.updateMatrix();
        
        meshRef.current!.setMatrixAt(index, dummy.matrix);
        meshRef.current!.setColorAt(index, beamColor);
        
        index++;
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (beams.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, totalParticles]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.9} />
    </instancedMesh>
  );
};

// Sub-components for better aesthetics

const Building = ({ width, height, depth, position, textureId, isTransparent }: any) => {
  const themeColors = [
    { base: '#080a10', frame: '#181b2a', winOff: '#060a14', winOn: '#00e5ff', door: '#00e5ff' }, // Cyan
    { base: '#100810', frame: '#2a182a', winOff: '#140614', winOn: '#b026ff', door: '#b026ff' }, // Purple
    { base: '#100c08', frame: '#2a2218', winOff: '#140c06', winOn: '#ffaa00', door: '#ffbb33' }, // Orange
  ];
  
  const theme = themeColors[(textureId - 1) % 3];

  const floorsCount = Math.floor(height / 1.5);
  const floors = Array.from({ length: Math.max(2, floorsCount) });
  const fHeight = height / floors.length;

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Main Core */}
      <Box args={[width * 0.85, height, depth * 0.85]} position={[0, height / 2, 0]}>
        {isTransparent ? (
          <meshBasicMaterial color="#00f0ff" transparent={true} opacity={0.05} depthWrite={false} />
        ) : (
          <meshStandardMaterial color={theme.base} roughness={0.7} metalness={0.2} />
        )}
      </Box>

      {/* 4 Corner Pillars extending out */}
      <Box args={[width * 0.15, height, depth * 0.15]} position={[width/2, height/2, depth/2]} visible={!isTransparent}>
        <meshStandardMaterial color={theme.frame} />
        <Edges linewidth={1} color="#000" />
      </Box>
      <Box args={[width * 0.15, height, depth * 0.15]} position={[-width/2, height/2, depth/2]} visible={!isTransparent}>
        <meshStandardMaterial color={theme.frame} />
        <Edges linewidth={1} color="#000" />
      </Box>
      <Box args={[width * 0.15, height, depth * 0.15]} position={[width/2, height/2, -depth/2]} visible={!isTransparent}>
        <meshStandardMaterial color={theme.frame} />
        <Edges linewidth={1} color="#000" />
      </Box>
      <Box args={[width * 0.15, height, depth * 0.15]} position={[-width/2, height/2, -depth/2]} visible={!isTransparent}>
        <meshStandardMaterial color={theme.frame} />
        <Edges linewidth={1} color="#000" />
      </Box>

      {/* Floor Ledges and Windows */}
      {floors.map((_, i) => {
        // We use pseudo-randomness inside map loop for the windows
        const winFrontLit = Math.random() > 0.4;
        const winSideLit = Math.random() > 0.4;
        
        return (
          <group key={`floor-${i}`} position={[0, i * fHeight + fHeight / 2, 0]} visible={!isTransparent}>
            {/* Ledge wrapping the building protruding outwards */}
            <Box args={[width * 1.05, 0.1, depth * 1.05]} position={[0, -fHeight/2 + 0.05, 0]}>
              <meshStandardMaterial color={theme.frame} roughness={0.6} />
            </Box>
            
            {/* Front/Back Windows (inset slightly from pillars but wider than core) */}
            <Box args={[width * 0.7, fHeight * 0.6, depth * 0.9]} position={[0, 0, 0]}>
              {winFrontLit ? 
                 <meshBasicMaterial color={theme.winOn} toneMapped={false} /> :
                 <meshStandardMaterial color={theme.winOff} roughness={0.1} metalness={0.8} />
              }
            </Box>
            
            {/* Left/Right Windows */}
            <Box args={[width * 0.9, fHeight * 0.6, depth * 0.7]} position={[0, 0, 0]}>
              {winSideLit ? 
                 <meshBasicMaterial color={theme.winOn} toneMapped={false} /> :
                 <meshStandardMaterial color={theme.winOff} roughness={0.1} metalness={0.8} />
              }
            </Box>
          </group>
        );
      })}

      {/* Ground Floor Entrance / Door */}
      <group position={[0, 0, depth/2]} visible={!isTransparent}>
         {/* Door Frame jutting out */}
         <Box args={[width * 0.4, 1.2, 0.4]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color={theme.frame} />
         </Box>
         {/* Glowing Door Glass */}
         <Box args={[width * 0.3, 1.0, 0.45]} position={[0, 0.5, 0]}>
            <meshBasicMaterial color={theme.door} toneMapped={false} transparent opacity={0.8} />
         </Box>
      </group>

      {/* Roof Parapet / Details */}
      <Box args={[width * 0.95, 0.2, depth * 0.95]} position={[0, height + 0.1, 0]} visible={!isTransparent}>
        <meshStandardMaterial color={theme.frame} />
      </Box>
      {/* Small roof AC unit / antenna base */}
      <Box args={[width * 0.3, 0.8, depth * 0.3]} position={[0, height + 0.4, 0]} visible={!isTransparent}>
        <meshStandardMaterial color={theme.base} />
        <Edges linewidth={1} color={theme.winOn} toneMapped={false} />
      </Box>
    </group>
  );
};

const SkyAndMoon = () => {
  const moonTex = useTexture('./moon_texture.png');
  const skyTex = useTexture('./galaxy.jpg');
  
  return (
    <group>
      {/* Huge background sphere for the starry sky */}
      <mesh>
        <sphereGeometry args={[200, 64, 64]} />
        <meshBasicMaterial 
          map={skyTex} 
          side={THREE.BackSide} 
          toneMapped={false}
          color="#aa77ff" // Beautiful magenta-ish tint to the galaxy
        />
      </mesh>

      {/* Big glowing moon in the sky, billboarded so it always faces camera */}
      <Billboard position={[-60, 40, -80]}>
        <mesh>
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial 
            map={moonTex} 
            transparent 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false} 
          />
        </mesh>
      </Billboard>
      
      {/* Light coming from the moon */}
      <directionalLight position={[-60, 40, -80]} intensity={2} color="#dbe6ff" />
    </group>
  );
};

const Person = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <group position={position}>
       {/* Body */}
       <Box args={[0.25, 0.4, 0.15]} position={[0, 0.2, 0]}>
         <meshStandardMaterial color="#222" />
         <Edges linewidth={1} color={color} toneMapped={false} />
       </Box>
       {/* Head */}
       <Sphere args={[0.12, 16, 16]} position={[0, 0.5, 0]}>
         <meshStandardMaterial color="#222" />
         <Edges linewidth={1} color={color} toneMapped={false} />
       </Sphere>
       {/* Phone emitting light */}
       <Box args={[0.08, 0.1, 0.02]} position={[0.1, 0.35, 0.15]} rotation={[-0.2, -0.2, 0]}>
         <meshBasicMaterial color="#fff" toneMapped={false} />
       </Box>
       {/* Outer glow aura */}
       <Box args={[0.4, 0.7, 0.3]} position={[0, 0.3, 0]}>
         <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} toneMapped={false} />
       </Box>
    </group>
  );
};

const AccessPoint = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <group position={position}>
      {/* Central Mast */}
      <Cylinder args={[0.08, 0.08, 1.2, 8]} position={[0, 0.6, 0]}>
         <meshStandardMaterial color="#555" metalness={0.8} />
      </Cylinder>
      
      {/* Sector Antennas (3 panels facing outwards) */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((rot, i) => (
        <group key={`sector-${i}`} position={[0, 0.8, 0]} rotation={[0, rot, 0]}>
           <Box args={[0.15, 0.5, 0.05]} position={[0, 0, 0.15]}>
              <meshStandardMaterial color="#222" />
              <Edges linewidth={1} color={color} toneMapped={false} />
           </Box>
        </group>
      ))}

      {/* Top glowing transmission dome */}
      <Sphere args={[0.15, 16, 16]} position={[0, 1.2, 0]}>
         <meshBasicMaterial color={color} toneMapped={false} />
      </Sphere>

      {/* Outer Glow Aura for the top dome */}
      <Sphere args={[0.5, 16, 16]} position={[0, 1.2, 0]}>
         <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} toneMapped={false} />
      </Sphere>
      
      {/* Connection wires from panels to mast */}
      <Cylinder args={[0.12, 0.12, 0.05, 16]} position={[0, 0.6, 0]}>
         <meshStandardMaterial color="#111" />
      </Cylinder>
      <Cylinder args={[0.12, 0.12, 0.05, 16]} position={[0, 1.0, 0]}>
         <meshStandardMaterial color="#111" />
      </Cylinder>
    </group>
  );
};
