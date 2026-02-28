import React, { useState } from 'react';
import { Network, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OverlayProps {
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  risRadius: number;
  setRisRadius: (val: number) => void;
  connectedUsersCount: number;
  transparentBuildings: boolean;
  setTransparentBuildings: (val: boolean) => void;
  apFactor: number;
  setApFactor: (val: number) => void;
  selectedUserId: number | null;
  setSelectedUserId: (val: number | null) => void;
  selectedApId: number | null;
  setSelectedApId: (val: number | null) => void;
  simulationStats: { users: number; aps: number; ris: number; };
}

export const Overlay: React.FC<OverlayProps> = ({ showGrid, setShowGrid, risRadius, setRisRadius, connectedUsersCount, transparentBuildings, setTransparentBuildings, apFactor, setApFactor, selectedUserId, setSelectedUserId, selectedApId, setSelectedApId, simulationStats }) => {
  const [isLegendMinimized, setIsLegendMinimized] = useState(false);
  const [isStatsMinimized, setIsStatsMinimized] = useState(false);
  const [isCameraControlsMinimized, setIsCameraControlsMinimized] = useState(false);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // Let clicks pass through to the 3D canvas
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem'
    }}>
      {/* Draggable Panels Container */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10 }}>
        
        {/* Simulation Title Panel */}
        <motion.div 
          drag 
          dragMomentum={false}
          className="glass-panel"
          style={{ position: 'absolute', top: '2rem', left: '2rem', pointerEvents: 'auto', padding: '1.2rem 1.5rem', width: 'fit-content', cursor: 'grab' }}
          whileDrag={{ cursor: 'grabbing', scale: 1.02, zIndex: 20 }}
        >
          <h1 className="text-gradient" style={{ fontSize: '2rem', margin: 0 }}>
            6G Cell-Free & RIS Simulation
          </h1>
        </motion.div>
        {/* Simulation Legend Panel */}
        <motion.div 
          drag 
          dragMomentum={false}
          className="glass-panel"
          style={{ position: 'absolute', top: '140px', left: '2rem', pointerEvents: 'auto', minWidth: '220px', cursor: 'grab' }}
          whileDrag={{ cursor: 'grabbing', scale: 1.02, zIndex: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Simulation Legend</h3>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsLegendMinimized(!isLegendMinimized); }}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.2rem' }}
            >
              <div style={{ width: '12px', height: '2px', backgroundColor: '#fff', borderRadius: '1px' }} />
            </button>
          </div>
          <AnimatePresence>
            {!isLegendMinimized && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#ff003c', boxShadow: '0 0 10px #ff003c' }} />
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>Mobile Users</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Zap size={16} color="#00f0ff" />
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>Cell-Free APs</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 20, height: 6, backgroundColor: '#39ff14', boxShadow: '0 0 10px #39ff14' }} />
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>RIS Panels</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Network size={16} color="rgba(255,255,255,0.8)" />
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>6G Connections</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Simulation Stats Panel */}
        <motion.div 
          drag 
          dragMomentum={false}
          className="glass-panel"
          style={{ position: 'absolute', top: '400px', left: '2rem', pointerEvents: 'auto', minWidth: '220px', cursor: 'grab' }}
          whileDrag={{ cursor: 'grabbing', scale: 1.02, zIndex: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Network Stats</h3>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsStatsMinimized(!isStatsMinimized); }}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.2rem' }}
            >
              <div style={{ width: '12px', height: '2px', backgroundColor: '#fff', borderRadius: '1px' }} />
            </button>
          </div>
          <AnimatePresence>
            {!isStatsMinimized && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Total UEs:</span>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>{simulationStats.users}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Total APs:</span>
                    <span style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '0.9rem' }}>{simulationStats.aps}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Total RISs:</span>
                    <span style={{ color: '#39ff14', fontWeight: 'bold', fontSize: '0.9rem' }}>{simulationStats.ris}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.3rem', paddingTop: '0.8rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Served by RIS:</span>
                    <span style={{ color: '#39ff14', fontWeight: 'bold', fontSize: '1rem' }}>{connectedUsersCount} / {simulationStats.users}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Camera Controls Panel */}
        <motion.div 
          drag 
          dragMomentum={false}
          className="glass-panel"
          style={{ position: 'absolute', top: '660px', left: '2rem', pointerEvents: 'auto', minWidth: '220px', cursor: 'grab' }}
          whileDrag={{ cursor: 'grabbing', scale: 1.02, zIndex: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Camera Controls</h3>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsCameraControlsMinimized(!isCameraControlsMinimized); }}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.2rem' }}
            >
              <div style={{ width: '12px', height: '2px', backgroundColor: '#fff', borderRadius: '1px' }} />
            </button>
          </div>
          <AnimatePresence>
            {!isCameraControlsMinimized && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                  <p>⌨️ <b style={{ color: '#fff' }}>W, A, S, D</b> - Move Forward/Back/Left/Right</p>
                  <p>⌨️ <b style={{ color: '#fff' }}>Q / E</b> - Move Down / Up</p>
                  <p>🏃 <b style={{ color: '#fff' }}>Shift</b> - Sprint (Move Faster)</p>
                  <p>🖱️ <b style={{ color: '#fff' }}>Left Click + Drag</b> - Rotate View</p>
                  <p>↕️ <b style={{ color: '#fff' }}>Scroll Wheel</b> - Zoom In/Out</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Topology Grid Toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-end', pointerEvents: 'none' }}>
        <button 
          onClick={() => setShowGrid(!showGrid)}
          className="glass-panel"
          style={{
            pointerEvents: 'auto', padding: '0.8rem 1.2rem', 
            backgroundColor: showGrid ? 'rgba(255, 0, 60, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${showGrid ? '#ff003c' : 'rgba(255,255,255,0.1)'}`,
            color: '#fff', borderRadius: '8px', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = showGrid ? 'rgba(255, 0, 60, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = showGrid ? 'rgba(255, 0, 60, 0.2)' : 'rgba(255, 255, 255, 0.05)'}
        >
          {showGrid ? 'Hide RIS Radius' : 'Show RIS Radius'}
        </button>

        {/* Ghost Buildings Toggle */}
        <button 
          onClick={() => setTransparentBuildings(!transparentBuildings)}
          className="glass-panel"
          style={{
            pointerEvents: 'auto', padding: '0.8rem 1.2rem', 
            backgroundColor: transparentBuildings ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${transparentBuildings ? '#00f0ff' : 'rgba(255,255,255,0.1)'}`,
            color: '#fff', borderRadius: '8px', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = transparentBuildings ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = transparentBuildings ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'}
        >
          {transparentBuildings ? 'Solid Buildings' : 'Ghost Buildings'}
        </button>
      </div>

      {/* Settings Panel (Bottom Right) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'absolute', bottom: '2rem', right: '2rem', pointerEvents: 'none' }}>
        
        {/* Isolate User Connections Panel */}
        <div className="glass-panel" style={{
          pointerEvents: 'auto', padding: '1.5rem', width: '250px'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.1rem' }}>Isolate Connections</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <button
              onClick={() => setSelectedUserId(null)}
              style={{
                padding: '0.5rem',
                backgroundColor: selectedUserId === null ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${selectedUserId === null ? '#00f0ff' : 'rgba(255,255,255,0.1)'}`,
                color: '#fff', borderRadius: '4px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.85rem', width: '100%'
              }}
            >
              Show All Connections
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem', marginTop: '0.5rem' }}>
              {Array.from({ length: 15 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedUserId(i)}
                  style={{
                    padding: '0.3rem',
                    backgroundColor: selectedUserId === i ? 'rgba(255, 0, 60, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${selectedUserId === i ? '#ff003c' : 'rgba(255,255,255,0.1)'}`,
                    color: selectedUserId === i ? '#fff' : 'rgba(255,255,255,0.7)', 
                    borderRadius: '4px', cursor: 'pointer',
                    fontSize: '0.75rem', fontWeight: 'bold'
                  }}
                >
                  U{i + 1}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {selectedUserId !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>Select AP Connection:</span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => setSelectedApId(null)}
                      style={{
                        flex: 1, padding: '0.3rem',
                        backgroundColor: selectedApId === null ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${selectedApId === null ? '#00f0ff' : 'rgba(255,255,255,0.1)'}`,
                        color: selectedApId === null ? '#fff' : 'rgba(255,255,255,0.7)', 
                        borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold'
                      }}
                    >
                      All
                    </button>
                    {[0, 1, 2, 3].map(i => (
                      <button
                        key={i}
                        onClick={() => setSelectedApId(i)}
                        style={{
                          flex: 1, padding: '0.3rem',
                          backgroundColor: selectedApId === i ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${selectedApId === i ? '#00f0ff' : 'rgba(255,255,255,0.1)'}`,
                          color: selectedApId === i ? '#fff' : 'rgba(255,255,255,0.7)', 
                          borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold'
                        }}
                      >
                        AP{i + 1}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass-panel" style={{
          pointerEvents: 'auto', padding: '1.5rem', width: '250px'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.1rem' }}>Simulation Params</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>RIS Range</span>
                <span style={{ color: '#39ff14', fontSize: '0.9rem', fontWeight: 'bold' }}>{risRadius}</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="40" 
                value={risRadius} 
                onChange={(e) => setRisRadius(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: '#39ff14' }}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>AP Offset Factor</span>
                <span style={{ color: '#00f0ff', fontSize: '0.9rem', fontWeight: 'bold' }}>{apFactor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.7"
                step="0.01"
                value={apFactor}
                onChange={(e) => setApFactor(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: '#00f0ff' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
