import React, { useState, useEffect } from 'react';
import { apiService } from '../../api';
import { Clock, Filter, AlertCircle, CheckCircle, MessageSquare, Send, ChevronLeft, Loader2 } from 'lucide-react';

export default function AdminDashboard({ department, onLogout }) {
    const [hourlySlots, setHourlySlots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchHourlyData();
    }, [department]);

    const fetchHourlyData = async () => {
        setIsLoading(true);
        try {
            const data = await apiService.getHourlyStats(department);
            // Verify data structure, backend returns list of HourlySlot
            // { hour_label, red, yellow, green, status, count, complaints: [...] }
            // Suggest reply is not in backend model, adding frontend side or backend?
            // Backend maps `admin_reply` in `complaints` list.
            // But we need `suggestedReply` for the UI.

            const processedSlots = data.map(slot => ({
                ...slot,
                complaints: slot.complaints.map(c => ({
                    ...c,
                    user: c.user_name, // Map backend user_name to frontend user
                    suggestedReply: c.admin_reply || generateSuggestedReply(c)
                }))
            }));

            setHourlySlots(processedSlots);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateSuggestedReply = (c) => {
        if (c.department === "Weather & Traffic") {
            return "We are currently experiencing delays due to external factors (weather/traffic).";
        } else if (c.department === "Logistics") {
            return "There is a logistics delay at our sorting facility.";
        }
        return `Hello, we have received your complaint regarding '${c.title}'. Our team is looking into it.`;
    };

    const handleSendReply = async () => {
        if (!selectedComplaint) return;
        setIsSending(true);
        try {
            await apiService.sendReply(selectedComplaint.id, replyText);
            setReplyText("");
            setSelectedComplaint(null);
            fetchHourlyData(); // Refresh
        } catch (error) {
            alert("Failed to send reply.");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader2 size={48} className="animate-spin" color="var(--primary)" />
            </div>
        );
    }

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
                                background: `var(--status-${selectedComplaint.status})`,
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }}>{selectedComplaint.status} Priority</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ID: #PH-X{selectedComplaint.id}</span>
                        </div>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{selectedComplaint.title}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Submitted by <strong>{selectedComplaint.user}</strong> • {new Date(selectedComplaint.timestamp).toLocaleString()}</p>

                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{selectedComplaint.description}</p>
                        </div>
                    </div>

                    <div className="card glass-morphism" style={{ border: '1px solid var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <MessageSquare size={24} color="var(--primary)" />
                            <h4 style={{ fontSize: '1.25rem' }}>Response Management</h4>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Admin Official Reply</label>
                            <textarea
                                className="input-field"
                                rows="8"
                                placeholder="Type your response here..."
                                value={replyText || selectedComplaint.suggestedReply}
                                onChange={(e) => setReplyText(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                            ></textarea>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSendReply} disabled={isSending}>
                            {isSending ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Send Response</>}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedSlot) {
        const list = selectedSlot.complaints.filter(c => c.status === selectedSlot.color);
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
                {hourlySlots.map((stats) => {
                    return (
                        <div key={stats.hour_label} className="card glass-morphism" style={{ border: stats.count > 0 ? `1px solid var(--status-${stats.status})` : '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{stats.hour_label}</span>
                                {stats.count > 0 && <span style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{stats.count} ACTIVE</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <button
                                    onClick={() => stats.red > 0 && setSelectedSlot({ hour: stats.hour_label, color: 'red', complaints: stats.complaints })}
                                    style={{ background: 'transparent', border: 'none', cursor: stats.red > 0 ? 'pointer' : 'default', textAlign: 'center', opacity: stats.red > 0 ? 1 : 0.3 }}
                                >
                                    <div style={{ height: '8px', background: 'var(--status-red)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                                    <div style={{ fontWeight: '700', fontSize: '1.25rem' }}>{stats.red}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>RED</div>
                                </button>

                                <button
                                    onClick={() => stats.yellow > 0 && setSelectedSlot({ hour: stats.hour_label, color: 'yellow', complaints: stats.complaints })}
                                    style={{ background: 'transparent', border: 'none', cursor: stats.yellow > 0 ? 'pointer' : 'default', textAlign: 'center', opacity: stats.yellow > 0 ? 1 : 0.3 }}
                                >
                                    <div style={{ height: '8px', background: 'var(--status-yellow)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                                    <div style={{ fontWeight: '700', fontSize: '1.25rem' }}>{stats.yellow}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>YELLOW</div>
                                </button>

                                <button
                                    onClick={() => stats.green > 0 && setSelectedSlot({ hour: stats.hour_label, color: 'green', complaints: stats.complaints })}
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
