import React from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import '../index.css';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const BentoCard = ({ title, desc, color }: { title: string, desc: string, color: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
    style={{ 
      background: 'rgba(255,255,255,0.03)', 
      border: '1px solid rgba(255,255,255,0.05)', 
      borderRadius: '16px', 
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      transition: 'background-color 0.3s'
    }}
  >
    <div style={{ color: color, fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</div>
    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.4 }}>{desc}</div>
  </motion.div>
);

const FeatureRow = ({ icon, text }: { icon: string, text: string }) => (
  <motion.div 
    whileHover={{ x: 10 }}
    style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}
  >
    <div style={{ fontSize: '1.5rem' }}>{icon}</div>
    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.5 }}>{text}</div>
  </motion.div>
);

const StepSection = ({ step, title, color, children, imageSrc, imageAlt, reverse }: any) => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, padding: '4rem 0' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '4rem', 
        maxWidth: '1200px', 
        width: '100%', 
        padding: '0 2rem' 
      }}>
        
        <div style={{ flex: '1 1 400px', order: reverse ? 2 : 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div
             initial={{ opacity: 0, x: reverse ? 50 : -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: '-20%' }}
             transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div style={{ color: color, fontSize: '0.9rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Step 0{step}
            </div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, WebkitBoxAlign: 'center', lineHeight: 1.1, marginBottom: '2rem', color: '#fff' }}>
              {title}
            </h2>
            <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
               {children}
            </div>
          </motion.div>
        </div>

        <div style={{ flex: '1 1 400px', order: reverse ? 1 : 2, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
          <motion.div
             initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 10, rotateY: reverse ? -10 : 10 }}
             whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0 }}
             viewport={{ once: true, margin: '-20%' }}
             transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
             whileHover={{ y: -10, scale: 1.02, boxShadow: `0 30px 60px -15px ${color}60` }}
             style={{ 
               width: '100%', 
               borderRadius: '24px', 
               overflow: 'hidden', 
               boxShadow: `0 20px 40px -10px rgba(0,0,0,0.5)`,
               border: '1px solid rgba(255,255,255,0.08)',
               cursor: 'pointer',
               position: 'relative'
             }}
          >
             {/* Glow behind image */}
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`, filter: 'blur(40px)', zIndex: 0 }} />
             <img src={imageSrc} style={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 1 }} alt={imageAlt} />
          </motion.div>
        </div>

      </div>
    </div>
  )
}

const BackgroundBlobs = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <motion.div 
      animate={{ x: [0, 100, 0], y: [0, 50, 0] }} 
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: '0%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 60%)', filter: 'blur(80px)', opacity: 0.5 }} 
    />
    <motion.div 
      animate={{ x: [0, -100, 0], y: [0, -50, 0] }} 
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: '30%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(176,38,255,0.1) 0%, transparent 60%)', filter: 'blur(80px)', opacity: 0.5 }} 
    />
    <motion.div 
      animate={{ x: [0, 50, 0], y: [0, 100, 0] }} 
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', bottom: '10%', left: '10%', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(255,0,60,0.1) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.5 }} 
    />
  </div>
);

export const ExplanationArticle: React.FC = () => {
  return (
    <div style={{
      width: '100vw',
      backgroundColor: 'var(--dark-bg)',
      color: 'rgba(255, 255, 255, 0.85)',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <BackgroundBlobs />
      
      {/* Intro Hero Section */}
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', zIndex: 1, padding: '10vh 2rem' }}>
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              style={{ maxWidth: '800px' }}
          >
              <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ 
                      display: 'inline-block', padding: '0.5rem 1.2rem', borderRadius: '50px', 
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
                      color: '#fff', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem',
                      backdropFilter: 'blur(10px)'
                  }}
              >
                  Lorem Ipsum Dolor Sit
              </motion.div>
              <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '2rem', background: 'linear-gradient(135deg, #fff 0%, #888 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Lorem Ipsum<br/>Dolor
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
          </motion.div>
      </div>

      <StepSection step={1} title="Lorem Ipsum" color="#00f0ff" imageSrc="/3d_scenario_gen_1772057174429.png" imageAlt="Scenario Gen">
         <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
         </p>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
             <BentoCard title="Lorem" desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." color="#00f0ff" />
             <BentoCard title="Ipsum" desc="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo." color="#b026ff" />
             <BentoCard title="Dolor" desc="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." color="#39ff14" />
             <BentoCard title="Sit Amet" desc="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est." color="#ff003c" />
         </div>
      </StepSection>

      <StepSection step={2} title="Lorem Ipsum Dolor" color="#b026ff" reverse imageSrc="/3d_propagation_ghost_1772057178217.png" imageAlt="Propagation">
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FeatureRow icon="📡" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." />
              <FeatureRow icon="👁️" text="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo." />
              <FeatureRow icon="🌫️" text="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." />
              <FeatureRow icon="📐" text="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est." />
          </div>
      </StepSection>

      <StepSection step={3} title="Lorem Ipsum" color="#39ff14" imageSrc="/3d_pilot_assignment_1772057261350.png" imageAlt="Assignment">
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
         <div style={{ padding: '1.5rem', borderLeft: '3px solid #39ff14', background: 'linear-gradient(90deg, rgba(57, 255, 20, 0.1) 0%, transparent 100%)', borderRadius: '0 12px 12px 0' }}>
             <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Lorem Ipsum Dolor</strong>
             <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, display: 'block' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</span>
         </div>
      </StepSection>

      <StepSection step={4} title="Lorem Ipsum Dolor" color="#ff003c" reverse imageSrc="/3d_spectral_efficiency_1772057264658.png" imageAlt="Spectral Efficiency">
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
          <div style={{ padding: '0.5rem 1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1.5rem', color: '#ff003c', fontSize: '1.1rem', overflowX: 'auto' }}>
               <BlockMath math="E = mc^2" />
          </div>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px', padding: '1.5rem', background: 'rgba(255,0,60,0.05)', borderRadius: '16px', border: '1px solid rgba(255,0,60,0.2)' }}>
                  <div style={{ fontSize: '1.5rem', color: '#ff003c', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Lorem Ipsum</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
              </div>
              <div style={{ flex: '1 1 200px', padding: '1.5rem', background: 'rgba(255,0,60,0.05)', borderRadius: '16px', border: '1px solid rgba(255,0,60,0.2)' }}>
                  <div style={{ fontSize: '1.5rem', color: '#ff003c', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Dolor Sit</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
              </div>
          </div>
      </StepSection>

      {/* Ultra-Premium Modern Footer */}
      <footer style={{ 
          marginTop: '10rem', 
          padding: '8rem 2rem 4rem 2rem', 
          position: 'relative',
          zIndex: 10,
          background: 'linear-gradient(to bottom, transparent, rgba(0,240,255,0.03))',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden'
      }}>
          {/* Background Footer Glows */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), transparent)' }} />
          <div style={{ position: 'absolute', top: '-10rem', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '20rem', background: 'radial-gradient(ellipse at top, rgba(0,240,255,0.15), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '1.5rem', color: '#fff' }}
              >
                  Lorem Ipsum Dolor Sit?
              </motion.h2>
              
              <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', marginBottom: '4rem', lineHeight: 1.6 }}
              >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
              </motion.p>
              
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ position: 'relative' }}
              >
                  {/* Outer glow for the button */}
                  <div style={{ position: 'absolute', inset: -4, background: 'linear-gradient(90deg, #00f0ff, #b026ff, #ff003c)', borderRadius: '50px', filter: 'blur(15px)', opacity: 0.5 }} />
                  
                  <motion.a 
                      href="https://github.com/elpanayurich/pruebas-tfg" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '1rem', 
                          padding: '1.2rem 3rem', 
                          background: 'rgba(10, 10, 15, 0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)', 
                          borderRadius: '50px',
                          color: '#fff', 
                          textDecoration: 'none', 
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          position: 'relative',
                          zIndex: 2,
                          backdropFilter: 'blur(10px)',
                          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)'
                      }}
                  >
                      <Github size={28} />
                      <span>View Project on GitHub</span>
                  </motion.a>
              </motion.div>

              {/* Bottom Info Bar */}
              <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.8 }}
                  style={{ width: '100%', marginTop: '8rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
              >
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                      © {new Date().getFullYear()} 6G Cell-Free Simulation
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                     <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>React</span>
                     <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>Three.js</span>
                     <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>MATLAB</span>
                  </div>
              </motion.div>
          </div>
      </footer>
    </div>
  );
};
