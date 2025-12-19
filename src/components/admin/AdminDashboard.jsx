import React, { useState } from 'react';
import { MOCK_COMPLAINTS, getStatusColor } from '../../data/mockData';
import { Clock, Filter, AlertCircle, CheckCircle, MessageSquare, Send, ChevronLeft } from 'lucide-react';

export default function AdminDashboard({ department, onLogout }) {
    const [selectedSlot, setSelectedSlot] = useState(null); // { hour: string, color: string, complaints: Complaint[] }
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const filteredComplaints = MOCK_COMPLAINTS.filter(c => c.department === department);

    // Group by hour
    const hours = Array.from({ length: 24 }, (_, i) => {
        const period = i < 12 ? 'AM' : 'PM';
        const displayHour = i % 12 === 0 ? 12 : i % 12;
        const nextHour = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
        const nextPeriod = (i + 1) >= 12 && (i + 1) < 24 ? 'PM' : (i + 1) === 24 ? 'AM' : period;
        return `${displayHour} ${period} - ${nextHour} ${nextPeriod}`;
    }).reverse();

    const getHourlyStats = (hourLabel) => {
        // In a real app, this would filter by the actual timestamp match to the label
        // For demo, we'll assign our mock data to specific labels
        const slotComplaints = filteredComplaints.filter(c => {
            const h = new Date(c.timestamp).getHours();
            const period = h < 12 ? 'AM' : 'PM';
            const displayH = h % 12 === 0 ? 12 : h % 12;
            const nextH = (h + 1) % 12 === 0 ? 12 : (h + 1) % 12;
            const nextP = (h + 1) >= 12 && (h + 1) < 24 ? 'PM' : (h + 1) === 24 ? 'AM' : period;
            const label = `${displayH} ${period} - ${nextH} ${nextP}`;
            return label === hourLabel;
        });

        const redCount = slotComplaints.filter(c => getStatusColor(c.timestamp) === 'red').length;
        const yellowCount = slotComplaints.filter(c => getStatusColor(c.timestamp) === 'yellow').length;
        const greenCount = slotComplaints.filter(c => getStatusColor(c.timestamp) === 'green').length;

        let overallStatus = 'green';
        if (redCount > 0) {
            overallStatus = 'red';
        } else if (yellowCount > 0) {
            overallStatus = 'yellow';
        }

        return {
            red: redCount,
            yellow: yellowCount,
            green: greenCount,
            count: slotComplaints.length,
            status: overallStatus,
            complaints: slotComplaints
        };
    };

    if (selectedComplaint) {
        return (
            <div className="container animate-fade-in">
                <button onClick={() => setSelectedComplaint(null)} className="btn" style={{ marginBottom: '1.5rem', background: 'transparent' }}>
                    <ChevronLeft size={20} /> Back to List
                </button>

                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="card glass-morphism">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                background: `var(--status-${getStatusColor(selectedComplaint.timestamp)})`,
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }}>{getStatusColor(selectedComplaint.timestamp)} Priority</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ID: #29384</span>
                        </div>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{selectedComplaint.title}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Submitted by <strong>{selectedComplaint.user}</strong> • {new Date(selectedComplaint.timestamp).toLocaleString()}</p>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                            <p>{selectedComplaint.description}</p>
                        </div>
                    </div>

                    <div className="card glass-morphism" style={{ border: '1px solid var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <MessageSquare size={24} color="var(--primary)" />
                            <h4 style={{ fontSize: '1.25rem' }}>Suggested Reply</h4>
                        </div>

                        <div className="input-group">
                            <label className="input-label">System Generated Response</label>
                            <textarea
                                className="input-field"
                                rows="6"
                                defaultValue={selectedComplaint.suggestedReply}
                                style={{ background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }}
                            ></textarea>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => {
                            alert('Response sent to user!');
                            setSelectedComplaint(null);
                        }}>
                            <Send size={18} /> Send Response
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedSlot) {
        const list = selectedSlot.complaints.filter(c => getStatusColor(c.timestamp) === selectedSlot.color);
        return (
            <div className="container animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => setSelectedSlot(null)} className="btn" style={{ background: 'transparent' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem' }}>{selectedSlot.hour}: {selectedSlot.color.toUpperCase()}</h2>
                    </div>
                    <span className="card" style={{ padding: '0.5rem 1rem', background: `var(--status-${selectedSlot.color})`, color: 'white', fontWeight: '700' }}>
                        {list.length} Complaints
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {list.length > 0 ? list.map(c => (
                        <div
                            key={c.id}
                            className="card glass-morphism"
                            style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => setSelectedComplaint(c)}
                        >
                            <div>
                                <h4 style={{ marginBottom: '0.25rem' }}>{c.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.user} • {new Date(c.timestamp).toLocaleTimeString()}</p>
                            </div>
                            <ChevronLeft size={20} style={{ transform: 'rotate(180deg)', color: 'var(--text-muted)' }} />
                        </div>
                    )) : (
                        <div className="card glass-morphism" style={{ textAlign: 'center', padding: '4rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No {selectedSlot.color} complaints in this hour range.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Control</span>
                    <h2 style={{ fontSize: '2rem' }}>{department} Portal</h2>
                </div>
                <button onClick={onLogout} className="btn" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.875rem' }}>Logout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {hours.map((hourLabel) => {
                    const stats = getHourlyStats(hourLabel);
                    return (
                        <div key={hourLabel} className="card glass-morphism" style={{ border: stats.count > 0 ? `1px solid var(--status-${stats.status})` : '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{hourLabel}</span>
                                {stats.count > 0 && <span style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{stats.count} ACTIVE</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <button
                                    onClick={() => stats.red > 0 && setSelectedSlot({ hour: hourLabel, color: 'red', complaints: stats.complaints })}
                                    style={{ background: 'transparent', border: 'none', cursor: stats.red > 0 ? 'pointer' : 'default', textAlign: 'center', opacity: stats.red > 0 ? 1 : 0.3 }}
                                >
                                    <div style={{ height: '8px', background: 'var(--status-red)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                                    <div style={{ fontWeight: '700', fontSize: '1.25rem' }}>{stats.red}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>RED</div>
                                </button>

                                <button
                                    onClick={() => stats.yellow > 0 && setSelectedSlot({ hour: hourLabel, color: 'yellow', complaints: stats.complaints })}
                                    style={{ background: 'transparent', border: 'none', cursor: stats.yellow > 0 ? 'pointer' : 'default', textAlign: 'center', opacity: stats.yellow > 0 ? 1 : 0.3 }}
                                >
                                    <div style={{ height: '8px', background: 'var(--status-yellow)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                                    <div style={{ fontWeight: '700', fontSize: '1.25rem' }}>{stats.yellow}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>YELLOW</div>
                                </button>

                                <button
                                    onClick={() => stats.green > 0 && setSelectedSlot({ hour: hourLabel, color: 'green', complaints: stats.complaints })}
                                    style={{ background: 'transparent', border: 'none', cursor: stats.green > 0 ? 'pointer' : 'default', textAlign: 'center', opacity: stats.green > 0 ? 1 : 0.3 }}
                                >
                                    <div style={{ height: '8px', background: 'var(--status-green)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                                    <div style={{ fontWeight: '700', fontSize: '1.25rem' }}>{stats.green}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>GREEN</div>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
