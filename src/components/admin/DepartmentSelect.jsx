// DepartmentSelect.jsx
import React from 'react';
import { DEPARTMENTS } from '../../data/mockData';
import { Building2, ChevronRight, LogOut } from 'lucide-react';

export default function DepartmentSelect({ onSelect, onBack }) {
    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '4rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Select Department</h2>
                <p style={{ color: 'var(--text-muted)' }}>Choose the jurisdiction you manage to view active complaints.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {DEPARTMENTS.map(dept => (
                    <div
                        key={dept}
                        className="card glass-morphism"
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', transition: 'transform 0.2s' }}
                        onClick={() => onSelect(dept)}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                                <Building2 size={24} color="var(--primary)" />
                            </div>
                            <span style={{ fontWeight: '600' }}>{dept}</span>
                        </div>
                        <ChevronRight size={20} color="var(--text-muted)" />
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button onClick={onBack} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </div>
    );
}
