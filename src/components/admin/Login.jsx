// Login.jsx
import React, { useState } from 'react';
import { Lock, User, ArrowLeft } from 'lucide-react';

export default function Login({ onLogin, onBack }) {
    const [email, setEmail] = useState('admin@city.gov');
    const [password, setPassword] = useState('password');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', paddingTop: '6rem' }}>
            <div className="card glass-morphism" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Lock size={32} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.75rem' }}>Admin Access</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to manage complaints</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Login to Dashboard
                    </button>
                </form>

                <button onClick={onBack} className="btn" style={{ width: '100%', marginTop: '1rem', background: 'transparent' }}>
                    Go Back
                </button>
            </div>
        </div>
    );
}
