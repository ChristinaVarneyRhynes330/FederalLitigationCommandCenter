import { useState, useEffect } from 'react';
import { Clock, TrendingUp, AlertCircle, Calendar, FileText, ChevronRight, Target, Zap, CheckCircle, Shield, Gavel, Scale } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { ProgressRing } from './ProgressRing';

export function Dashboard() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 14,
    hours: 8,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const caseReadiness = 68;
  
  const upcomingDeadlines = [
    { id: 1, task: 'Expert Witness Disclosure', date: 'Dec 23, 2025', days: 14, status: 'urgent', priority: 'high' },
    { id: 2, task: 'Summary Judgment Motion', date: 'Jan 05, 2026', days: 27, status: 'in-progress', priority: 'medium' },
    { id: 3, task: 'Pretrial Conference', date: 'Jan 15, 2026', days: 37, status: 'scheduled', priority: 'medium' },
  ];

  const recentActivity = [
    { id: 1, action: 'Exhibit A-127 uploaded to Evidence Vault', time: '2h ago', type: 'upload', icon: FileText },
    { id: 2, action: 'AI case analysis completed', time: '5h ago', type: 'system', icon: Zap },
    { id: 3, action: 'Rule 3.01(g) conference logged', time: '1d ago', type: 'conference', icon: Calendar },
    { id: 4, action: 'Deposition transcript indexed', time: '2d ago', type: 'indexing', icon: FileText },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #0a0d1a 0%, #0f1117 50%, #1a1d29 100%)',
    }}>
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        
        {/* Command Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(159, 81, 102, 0.2)',
          borderRadius: '16px',
          padding: '32px 40px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 1px rgba(159, 81, 102, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#24bca3',
                  boxShadow: '0 0 12px rgba(36, 188, 163, 0.8)'
                }} />
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  letterSpacing: '0.1em', 
                  color: '#24bca3',
                  textTransform: 'uppercase'
                }}>ACTIVE LITIGATION</span>
              </div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '-0.02em'
              }}>Smith v. Corporation XYZ</h1>
              <p style={{ 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '24px'
              }}>Civil Rights Violation • Case No. 2025-CV-1847 • U.S. District Court</p>
              
              <div className="flex gap-8">
                <div>
                  <div style={{ 
                    fontSize: '42px', 
                    fontWeight: '700', 
                    color: '#9F5166',
                    lineHeight: '1',
                    marginBottom: '8px'
                  }}>14</div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'rgba(255, 255, 255, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: '600'
                  }}>Days to Trial</div>
                </div>
                <div>
                  <div style={{ 
                    fontSize: '42px', 
                    fontWeight: '700', 
                    color: '#24bca3',
                    lineHeight: '1',
                    marginBottom: '8px'
                  }}>68%</div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'rgba(255, 255, 255, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: '600'
                  }}>Case Ready</div>
                </div>
                <div>
                  <div style={{ 
                    fontSize: '42px', 
                    fontWeight: '700', 
                    color: '#ffffff',
                    lineHeight: '1',
                    marginBottom: '8px'
                  }}>247</div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'rgba(255, 255, 255, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: '600'
                  }}>Evidence Items</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button style={{
                background: 'linear-gradient(135deg, #9F5166 0%, #8b4758 100%)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(159, 81, 102, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <Target className="w-5 h-5" />
                Enter Hearing Mode
              </button>
              <button style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.9)',
                padding: '14px 24px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <Zap className="w-5 h-5" />
                Quick Actions
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(159, 81, 102, 0.2)',
            borderRadius: '12px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #9F5166 0%, transparent 100%)'
            }} />
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Evidence Items</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff', lineHeight: '1' }}>247</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(159, 81, 102, 0.1)',
                border: '1px solid rgba(159, 81, 102, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield className="w-6 h-6" style={{ color: '#9F5166' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#24bca3' }} />
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>+12 this week</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(36, 188, 163, 0.2)',
            borderRadius: '12px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #24bca3 0%, transparent 100%)'
            }} />
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>AI Consultations</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff', lineHeight: '1' }}>38</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(36, 188, 163, 0.1)',
                border: '1px solid rgba(36, 188, 163, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap className="w-6 h-6" style={{ color: '#24bca3' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: '#24bca3' }} />
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>+5 this week</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(46, 56, 107, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #2e386b 0%, transparent 100%)'
            }} />
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Active Tasks</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff', lineHeight: '1' }}>16</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(46, 56, 107, 0.2)',
                border: '1px solid rgba(46, 56, 107, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Gavel className="w-6 h-6" style={{ color: '#6b7ba8' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>3 overdue</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Docket Clock */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(159, 81, 102, 0.2)',
              borderLeft: '4px solid #9F5166',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: 'rgba(159, 81, 102, 0.15)',
                      border: '1px solid rgba(159, 81, 102, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Clock className="w-5 h-5" style={{ color: '#9F5166' }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '2px' }}>Docket Clock</h2>
                      <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>Next deadline: Expert Witness Disclosure</p>
                    </div>
                  </div>
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Calendar className="w-4 h-4" />
                    View Calendar
                  </button>
                </div>
              </div>
              <div style={{ padding: '40px 32px' }}>
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { value: timeRemaining.days, label: 'Days' },
                    { value: timeRemaining.hours, label: 'Hours' },
                    { value: timeRemaining.minutes, label: 'Minutes' },
                    { value: timeRemaining.seconds, label: 'Seconds' }
                  ].map((item, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '56px',
                        fontWeight: '700',
                        color: '#ffffff',
                        lineHeight: '1',
                        marginBottom: '12px',
                        fontVariantNumeric: 'tabular-nums'
                      }}>{String(item.value).padStart(2, '0')}</div>
                      <div style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: '600'
                      }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div className="flex items-center justify-between">
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Upcoming Deadlines</h3>
                  <button style={{
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.6)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                {upcomingDeadlines.map((deadline, i) => (
                  <div key={deadline.id} style={{
                    padding: '20px 32px',
                    borderBottom: i < upcomingDeadlines.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    transition: 'background 0.2s ease'
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: deadline.status === 'urgent' ? '#ef4444' : deadline.status === 'in-progress' ? '#f59e0b' : '#6b7ba8',
                          boxShadow: deadline.status === 'urgent' ? '0 0 12px rgba(239, 68, 68, 0.6)' : 'none'
                        }} />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>{deadline.task}</span>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              background: deadline.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              color: deadline.priority === 'high' ? '#ef4444' : '#f59e0b',
                              border: `1px solid ${deadline.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                            }}>
                              {deadline.priority}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>{deadline.date}</p>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: deadline.status === 'urgent' ? '#ef4444' : '#ffffff'
                      }}>{deadline.days}d</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Case Readiness */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(36, 188, 163, 0.15) 0%, rgba(64, 143, 134, 0.1) 100%)',
              border: '1px solid rgba(36, 188, 163, 0.3)',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>Case Readiness</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Overall preparation status</p>
                </div>
                <Tooltip text="Based on completed tasks, evidence collection, and filing compliance">
                  <button style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
              
              <div className="flex justify-center mb-8">
                <ProgressRing 
                  progress={caseReadiness} 
                  size={140} 
                  strokeWidth={10}
                  color="#24bca3"
                  backgroundColor="rgba(255, 255, 255, 0.1)"
                />
              </div>
              
              <div className="space-y-3">
                {[
                  { label: 'Evidence Collection', value: 87, icon: CheckCircle },
                  { label: 'Filing Compliance', value: 62, icon: FileText },
                  { label: 'Discovery Progress', value: 55, icon: Scale }
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '14px 16px'
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                        <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>{item.value}%</span>
                    </div>
                    <div style={{
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${item.value}%`,
                        background: 'linear-gradient(90deg, #24bca3 0%, #408f86 100%)',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Recent Activity</h3>
              </div>
              <div>
                {recentActivity.map((activity, i) => (
                  <div key={activity.id} style={{
                    padding: '16px 24px',
                    borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    transition: 'background 0.2s ease'
                  }}>
                    <div className="flex items-start gap-3">
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(36, 188, 163, 0.1)',
                        border: '1px solid rgba(36, 188, 163, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <activity.icon className="w-4 h-4" style={{ color: '#24bca3' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px', lineHeight: '1.4' }}>{activity.action}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
