import React, { useState } from 'react';
import { Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { DEPARTMENTS } from '../../data/mockData';

export default function UserComplaintForm({ onBack }) {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <div className="card glass-morphism" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <CheckCircle2 size={64} color="var(--status-green)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Complaint Received!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Your complaint has been logged and assigned a tracking ID #ORD-{Math.floor(Math.random() * 10000)}.
                        You will receive updates directly in your portal.
                    </p>
                    <button onClick={onBack} className="btn btn-primary">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <button onClick={onBack} className="btn" style={{ background: 'transparent', padding: 0 }}>
                    <ArrowLeft size={20} /> Back
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Submit a Complaint</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Every voice matters. Simply describe your issue, and our AI system will automatically route it to the correct department. We prioritize complaints based on urgency and time.
                    </p>
                    <div className="card glass-morphism" style={{ border: 'none', background: 'rgba(255,255,255,0.03)' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Response Time</h4>
                        <p style={{ fontSize: '0.875rem' }}>Red: Responded within 1 hour</p>
                        <p style={{ fontSize: '0.875rem' }}>Yellow: Responded within 24 hours</p>
                        <p style={{ fontSize: '0.875rem' }}>Green: Resolution/History</p>
                    </div>
                </div>

                <div className="card glass-morphism">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Complaint Title</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Brief summary of the issue"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Detailed Description</label>
                            <textarea
                                className="input-field"
                                rows="5"
                                placeholder="Explain the problem in detail..."
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            <Send size={18} /> Submit Complaint
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
