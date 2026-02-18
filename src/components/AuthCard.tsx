import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from '../firebase';

interface AuthCardProps {
    onLogin?: () => void;
}

export default function AuthCard({ onLogin }: AuthCardProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            onLogin?.();
        } catch (err: any) {
            const code = err?.code || '';
            switch (code) {
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password');
                    break;
                case 'auth/email-already-in-use':
                    setError('Email already in use');
                    break;
                case 'auth/weak-password':
                    setError('Password must be at least 6 characters');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid email or password');
                    break;
                default:
                    setError(err?.message || 'Authentication failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2rem',
            width: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#ffffff', letterSpacing: '0.05em' }}>
                {isLogin ? 'WELCOME BACK' : 'JOIN THE REVOLUTION'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#cccccc', marginBottom: '1rem' }}>
                {isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started'}
            </p>

            {/* Error Message */}
            {error && (
                <div style={{
                    background: 'rgba(255, 68, 68, 0.15)',
                    border: '1px solid rgba(255, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '0.6rem 1rem',
                    fontSize: '0.85rem',
                    color: '#ff6b6b',
                    textAlign: 'left'
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#dddddd', marginLeft: '4px' }}>EMAIL</label>
                <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    style={{
                        padding: '0.8rem',
                        width: '100%',
                        boxSizing: 'border-box',
                        borderRadius: '8px',
                        border: '1px solid #444',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#dddddd', marginLeft: '4px' }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        style={{
                            padding: '0.8rem',
                            width: '100%',
                            boxSizing: 'border-box',
                            borderRadius: '8px',
                            border: '1px solid #444',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '5px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#888',
                            padding: 0
                        }}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    marginTop: '1rem',
                    background: loading ? '#888' : '#ffffff',
                    color: 'black',
                    border: 'none',
                    fontWeight: 'bold',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.1s',
                    opacity: loading ? 0.7 : 1
                }}>
                {loading ? 'PLEASE WAIT...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
            </button>

            <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem', color: '#888' }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <span
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    style={{ color: '#ffffff', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}
                >
                    {isLogin ? 'Sign up' : 'Sign in'}
                </span>
            </p>
        </div>
    );
}
