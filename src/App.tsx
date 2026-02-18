import { Suspense, useState, useEffect } from 'react'
import Scene from './components/Scene'
import AuthCard from './components/AuthCard'
import ChatRoom from './components/ChatRoom'
import { AnimatePresence, motion } from 'framer-motion'
import { auth, onAuthStateChanged, signOut } from './firebase'
import type { User } from './firebase'

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isAuthenticated = !!user;

  if (authLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        fontSize: '1.2rem',
        letterSpacing: '0.2em'
      }}>
        LOADING...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      {/* Background 3D Scene */}
      <motion.div
        animate={{ filter: isAuthenticated ? "blur(10px) brightness(0.4)" : "blur(0px) brightness(1)" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </motion.div>

      <AnimatePresence>
        {!isAuthenticated ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              padding: '2rem',
              boxSizing: 'border-box',
              pointerEvents: 'none'
            }}
          >
            {/* Hero Content */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              maxWidth: '1200px',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '0',
              gap: '3rem'
            }}>

              <div style={{ textAlign: 'center' }}>
                <h1 style={{
                  fontSize: '8vw',
                  fontFamily: 'Anton, sans-serif',
                  lineHeight: '0.85',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase'
                }}>
                  <span className="text-outline">BUSINESS</span> <span className="logo-x-glow">X</span> <span className="text-outline">AI</span>
                </h1>

                <div style={{
                  marginTop: '1.5rem',
                  fontSize: '1rem',
                  color: '#cccccc',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.2em',
                  fontWeight: 500
                }}>
                  // INTEGRATING INTELLIGENCE INTO BUSINESS
                </div>
              </div>

              <div style={{ zIndex: 10, pointerEvents: 'auto', display: 'flex', justifyContent: 'center' }}>
                <AuthCard />
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}
          >
            <ChatRoom onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default App
