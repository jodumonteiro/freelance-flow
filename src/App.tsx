import React, { useState, useEffect } from 'react';

interface DocumentItem {
  id: string;
  name: string;
  status: 'Valid' | 'Pending' | 'Expiring';
  date: string;
}

interface TaskItem {
  id: string;
  title: string;
  freelancer: string;
  hours: number;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
}

interface InvoiceItem {
  id: string;
  freelancer: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  status: 'Submitted' | 'Approved' | 'Scheduled' | 'Paid';
  date: string;
}

interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  actor: string;
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'freelancers' | 'tasks' | 'invoices' | 'audit'>('dashboard');
  const [userRole, setUserRole] = useState<'agency' | 'freelancer'>('agency');

  // Multi-Entity Global Office Selector para a Agência
  const [agencyEntity, setAgencyEntity] = useState<'US Delaware HQ' | 'UK Branch' | 'EU Entity'>('US Delaware HQ');

  // Estados principais do contratado
  const [taxData, setTaxData] = useState({
    name: 'Ana Silva',
    taxId: 'US-987654321',
    rate: '45',
    currency: 'USD' as 'USD' | 'EUR' | 'GBP',
    language: 'EN (US)' as 'EN (US)' | 'EN (UK)' | 'Global Business',
    category: 'UI/UX Designer',
    rating: 4.9,
    completedProjects: 24,
    twoFactorEnabled: true, // 2FA Security Status
    weeklyCapacityHours: 40,
    loggedHoursThisWeek: 32,
  });

  const [taxIdStatus, setTaxIdStatus] = useState<'idle' | 'valid' | 'invalid'>('valid');
  const [escrowBalance, setEscrowBalance] = useState(1250);

  // Live Timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: '1', name: 'W-8BEN Tax Form', status: 'Valid', date: '2026-01-15' },
    { id: '2', name: 'Liability Insurance', status: 'Expiring', date: '2026-09-20' },
  ]);

  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: '1', title: 'Landing Page Redesign', freelancer: 'Ana Silva', hours: 14, status: 'In Review' },
    { id: '2', title: 'Checkout API Integration', freelancer: 'John Doe', hours: 8, status: 'To Do' },
    { id: '3', title: 'Design System Audit', freelancer: 'Ana Silva', hours: 6, status: 'In Progress' },
    { id: '4', title: 'User Testing Report', freelancer: 'John Doe', hours: 5, status: 'Completed' },
  ]);

  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: 'INV-001', freelancer: 'Ana Silva', amount: 630, currency: 'USD', status: 'Approved', date: '2026-09-10' },
    { id: 'INV-002', freelancer: 'John Doe', amount: 400, currency: 'USD', status: 'Submitted', date: '2026-09-12' },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', action: 'Tax profile verified via VIES/EIN engine', timestamp: '2026-09-14 10:30', actor: 'Ana Silva' },
    { id: '2', action: 'Invoice INV-001 approved for payout', timestamp: '2026-09-14 14:15', actor: 'Agency Admin' },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'New invoice INV-002 submitted by John Doe', time: '10m ago', unread: true },
    { id: '2', title: 'Liability insurance expiring for Ana Silva', time: '2h ago', unread: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Estados para modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'task' | 'contractor' | 'invoice' | 'escrow'>('task');
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formHours, setFormHours] = useState('');
  const [escrowDepositAmount, setEscrowDepositAmount] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);

  const handleTaxIdChange = (val: string) => {
    setTaxData({ ...taxData, taxId: val });
    if (val.length > 5) {
      if (val.toUpperCase().startsWith('US') || val.length >= 9) {
        setTaxIdStatus('valid');
      } else {
        setTaxIdStatus('invalid');
      }
    } else {
      setTaxIdStatus('idle');
    }
  };

  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setAuditLogs([{ id: Date.now().toString(), action: `Updated profile (2FA: ${taxData.twoFactorEnabled ? 'ON' : 'OFF'}, Entity/Lang: ${taxData.language})`, timestamp: 'Just now', actor: taxData.name }, ...auditLogs]);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    setDocuments([{ id: Date.now().toString(), name: newDocName, status: 'Valid', date: 'Today' }, ...documents]);
    setAuditLogs([{ id: Date.now().toString(), action: `Uploaded compliance document: ${newDocName}`, timestamp: 'Just now', actor: taxData.name }, ...auditLogs]);
    setNewDocName('');
  };

  const handleCreateFromModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'task') {
      const newTask: TaskItem = {
        id: Date.now().toString(),
        title: formTitle || 'New Task',
        freelancer: taxData.name,
        hours: Number(formHours) || 4,
        status: 'To Do',
      };
      setTasks([newTask, ...tasks]);
      setAuditLogs([{ id: Date.now().toString(), action: `Created task: ${newTask.title}`, timestamp: 'Just now', actor: 'Agency Admin' }, ...auditLogs]);
    } else if (modalType === 'invoice') {
      const newInv: InvoiceItem = {
        id: `INV-00${invoices.length + 1}`,
        freelancer: taxData.name,
        amount: Number(formAmount) || 500,
        currency: taxData.currency,
        status: 'Submitted',
        date: 'Today',
      };
      setInvoices([newInv, ...invoices]);
      setNotifications([{ id: Date.now().toString(), title: `New invoice ${newInv.id} submitted for ${newInv.amount} ${newInv.currency}`, time: 'Just now', unread: true }, ...notifications]);
      setAuditLogs([{ id: Date.now().toString(), action: `Submitted invoice ${newInv.id} for ${newInv.amount} ${newInv.currency}`, timestamp: 'Just now', actor: taxData.name }, ...auditLogs]);
    } else if (modalType === 'escrow') {
      const added = Number(escrowDepositAmount) || 0;
      setEscrowBalance(escrowBalance + added);
      setAuditLogs([{ id: Date.now().toString(), action: `Funded Escrow milestone with +${added} USD`, timestamp: 'Just now', actor: 'Agency Admin' }, ...auditLogs]);
      setEscrowDepositAmount('');
    }
    setFormTitle('');
    setFormAmount('');
    setFormHours('');
    setIsModalOpen(false);
  };

  const quickTriggerPayout = (invoiceId: string) => {
    setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv));
    setAuditLogs([{ id: Date.now().toString(), action: `Quick-triggered payout for invoice ${invoiceId}`, timestamp: 'Just now', actor: 'Agency Admin' }, ...auditLogs]);
  };

  const simulateDownloadPDF = (invoiceId: string) => {
    setPdfNotification(`Downloading official PDF for ${invoiceId}...`);
    setTimeout(() => setPdfNotification(null), 4000);
  };

  const currencySymbol = taxData.currency === 'EUR' ? '€' : taxData.currency === 'GBP' ? '£' : '$';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#f4f4f5', fontFamily: 'system-ui, sans-serif', maxWidth: '440px', margin: '0 auto', position: 'relative', borderLeft: '1px solid #27272a', borderRight: '1px solid #27272a', paddingBottom: '90px' }}>
      
      {/* Toast Notification */}
      {pdfNotification && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#065f46', color: '#34d399', padding: '10px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '1px solid #34d399' }}>
          {pdfNotification}
        </div>
      )}

      {/* Top Header */}
      <header style={{ padding: '16px', borderBottom: '1px solid #27272a', backgroundColor: '#09090b', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399', margin: 0 }}>FreelanceFlow</h1>
            <p style={{ fontSize: '10px', color: '#a1a1aa', margin: '2px 0 0 0' }}>Global Enterprise Subcontractor Hub</p>
          </div>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#f4f4f5', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', position: 'relative' }}
              >
                🔔 {notifications.filter(n => n.unread).length > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{ position: 'absolute', right: 0, top: '36px', width: '280px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.8)', zIndex: 40 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #27272a', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase' }}>Notifications</span>
                    <button onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))} style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '10px', cursor: 'pointer' }}>Mark read</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} style={{ backgroundColor: n.unread ? '#27272a' : '#121215', padding: '8px', borderRadius: '8px', fontSize: '11px' }}>
                        <p style={{ margin: '0 0 2px 0', color: '#f4f4f5' }}>{n.title}</p>
                        <span style={{ fontSize: '9px', color: '#a1a1aa' }}>{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => { setModalType('task'); setIsModalOpen(true); }}
              style={{ backgroundColor: '#34d399', color: '#09090b', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
            >
              + New
            </button>
          </div>
        </div>

        {/* Global Entity & Role Switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {userRole === 'agency' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121215', padding: '4px 8px', borderRadius: '8px', border: '1px solid #27272a', fontSize: '10px' }}>
              <span style={{ color: '#a1a1aa' }}>Active Entity HQ:</span>
              <select 
                value={agencyEntity}
                onChange={(e) => setAgencyEntity(e.target.value as any)}
                style={{ backgroundColor: 'transparent', color: '#34d399', border: 'none', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
              >
                <option value="US Delaware HQ">US Delaware HQ</option>
                <option value="UK Branch">UK Branch</option>
                <option value="EU Entity">EU Entity</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', backgroundColor: '#18181b', padding: '4px', borderRadius: '10px', border: '1px solid #27272a' }}>
            <button 
              onClick={() => setUserRole('agency')}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 500, cursor: 'pointer', backgroundColor: userRole === 'agency' ? '#27272a' : 'transparent', color: userRole === 'agency' ? '#34d399' : '#a1a1aa' }}
            >
              🏢 Agency View
            </button>
            <button 
              onClick={() => setUserRole('freelancer')}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 500, cursor: 'pointer', backgroundColor: userRole === 'freelancer' ? '#27272a' : 'transparent', color: userRole === 'freelancer' ? '#34d399' : '#a1a1aa' }}
            >
              👤 Contractor Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {userRole === 'agency' ? (
          <>
            {currentTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: '#18181b', padding: '14px', borderRadius: '12px', border: '1px solid #27272a' }}>
                    <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0, textTransform: 'uppercase' }}>Active Contractors</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399', margin: '6px 0 0 0' }}>12</p>
                  </div>
                  <div style={{ backgroundColor: '#18181b', padding: '14px', borderRadius: '12px', border: '1px solid #27272a' }}>
                    <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0, textTransform: 'uppercase' }}>Pending Payouts</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24', margin: '6px 0 0 0' }}>{currencySymbol}{invoices.reduce((a, c) => a + c.amount, 0)}</p>
                  </div>
                </div>

                {/* Escrow Milestone Widget */}
                <div style={{ backgroundColor: '#18181b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase' }}>🔒 Secured Escrow Funds</span>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#f4f4f5', margin: '4px 0 0 0' }}>${escrowBalance} USD</p>
                  </div>
                  <button 
                    onClick={() => { setModalType('escrow'); setIsModalOpen(true); }}
                    style={{ backgroundColor: '#27272a', color: '#34d399', border: '1px solid #3f3f46', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    + Fund Escrow
                  </button>
                </div>

                {/* Cash Flow Forecasting */}
                <div style={{ backgroundColor: '#18181b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#f4f4f5', margin: '0 0 8px 0', textTransform: 'uppercase' }}>📈 Payout Forecasting (Next 30 Days)</h3>
                  <p style={{ fontSize: '11px', color: '#a1a1aa', margin: '0 0 10px 0' }}>Estimated workload expenditure based on active tasks.</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121215', padding: '10px', borderRadius: '8px', border: '1px solid #27272a' }}>
                    <span style={{ fontSize: '11px', color: '#f4f4f5' }}>Projected Commitments</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#34d399' }}>$2,850.00 USD</span>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'freelancers' && (
              <div style={{ backgroundColor: '#18181b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', margin: 0 }}>Contractor Directory</h2>
                  <select 
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    style={{ backgroundColor: '#09090b', color: '#f4f4f5', border: '1px solid #27272a', borderRadius: '6px', padding: '4px 8px', fontSize: '10px' }}
                  >
                    <option value="All">All Categories</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Developer">Developer</option>
                  </select>
                </div>

                <div style={{ backgroundColor: '#121215', padding: '12px', borderRadius: '10px', border: '1px solid #27272a', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '13px' }}>{taxData.name}</p>
                    <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>⭐ {taxData.rating} / 5.0</span>
                  </div>
                  <p style={{ margin: 0, color: '#a1a1aa', fontSize: '11px' }}>{taxData.category} • <span style={{ color: '#34d399' }}>{currencySymbol}{taxData.rate}/h</span></p>
                  
                  {/* Utilização Semanal de Horas */}
                  <div style={{ backgroundColor: '#18181b', padding: '8px', borderRadius: '8px', border: '1px solid #27272a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#a1a1aa', marginBottom: '4px' }}>
                      <span>Weekly Utilization ({taxData.loggedHoursThisWeek}h / {taxData.weeklyCapacityHours}h)</span>
                      <span style={{ color: '#34d399' }}>{Math.round((taxData.loggedHoursThisWeek / taxData.weeklyCapacityHours) * 100)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', backgroundColor: '#27272a', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(taxData.loggedHoursThisWeek / taxData.weeklyCapacityHours) * 100}%`, height: '100%', backgroundColor: '#34d399' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#a1a1aa', borderTop: '1px solid #27272a', paddingTop: '6px' }}>
                    <span>Projects: {taxData.completedProjects}</span>
                    <span style={{ color: '#34d399' }}>Security 2FA: {taxData.twoFactorEnabled ? 'Active 🔒' : 'Off'}</span>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'tasks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', margin: 0 }}>Task Kanban Board</h2>
                  <button 
                    onClick={() => { setModalType('task'); setIsModalOpen(true); }}
                    style={{ backgroundColor: '#27272a', color: '#34d399', border: '1px solid #3f3f46', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    + Add Task
                  </button>
                </div>

                {['To Do', 'In Progress', 'In Review', 'Completed'].map((statusGroup) => (
                  <div key={statusGroup} style={{ backgroundColor: '#121215', padding: '12px', borderRadius: '12px', border: '1px solid #27272a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', fontWeight: 'bold', color: '#a1a1aa' }}>
                      <span>{statusGroup.toUpperCase()}</span>
                      <span>({tasks.filter(t => t.status === statusGroup).length})</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {tasks.filter(t => t.status === statusGroup).length === 0 ? (
                        <p style={{ fontSize: '11px', color: '#52525b', margin: '4px 0', fontStyle: 'italic' }}>No tasks</p>
                      ) : (
                        tasks.filter(t => t.status === statusGroup).map(t => (
                          <div key={t.id} style={{ backgroundColor: '#18181b', padding: '10px', borderRadius: '8px', border: '1px solid #27272a', fontSize: '12px' }}>
                            <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>{t.title}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#a1a1aa' }}>
                              <span>{t.freelancer}</span>
                              <span style={{ color: '#34d399', fontWeight: 'bold' }}>{t.hours} hrs</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentTab === 'invoices' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h2 style={{ fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', margin: 0 }}>Invoices & Fast Payouts</h2>
                {invoices.map(inv => (
                  <div key={inv.id} style={{ backgroundColor: '#18181b', padding: '14px', borderRadius: '12px', border: '1px solid #27272a', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600 }}>{inv.id} • {inv.freelancer}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#34d399', fontWeight: 'bold' }}>{inv.currency === 'EUR' ? '€' : inv.currency === 'GBP' ? '£' : '$'}{inv.amount}</span>
                        <button 
                          onClick={() => simulateDownloadPDF(inv.id)}
                          style={{ backgroundColor: '#27272a', color: '#34d399', border: 'none', padding: '4px 6px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer' }}
                        >
                          📥 PDF
                        </button>
                        {inv.status !== 'Paid' && (
                          <button 
                            onClick={() => quickTriggerPayout(inv.id)}
                            style={{ backgroundColor: '#065f46', color: '#34d399', border: 'none', padding: '4px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            ⚡ Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a1a1aa' }}>
                      <span>Submitted: {inv.date}</span>
                      <span style={{ backgroundColor: inv.status === 'Paid' ? '#1e3a8a33' : '#065f4633', color: inv.status === 'Paid' ? '#60a5fa' : '#34d399', padding: '2px 8px', borderRadius: '6px' }}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentTab === 'audit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h2 style={{ fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', margin: 0 }}>Security & Audit Trail</h2>
                <div style={{ backgroundColor: '#18181b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {auditLogs.map(log => (
                    <div key={log.id} style={{ borderBottom: '1px solid #27272a', paddingBottom: '8px', fontSize: '11px' }}>
                      <p style={{ margin: '0 0 2px 0', color: '#f4f4f5', fontWeight: 500 }}>{log.action}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '10px' }}>
                        <span>Actor: {log.actor}</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          // CONTRACTOR PORTAL
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Live Time Tracker */}
            <div style={{ backgroundColor: '#18181b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#f4f4f5', margin: 0 }}>⏱️ Live Time Tracker</h2>
                <span style={{ fontSize: '10px', color: isTimerRunning ? '#34d399' : '#a1a1aa', fontWeight: 'bold' }}>{isTimerRunning ? '● RECORDING' : 'IDLE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090b', padding: '12px', borderRadius: '8px', border: '1px solid #27272a' }}>
                <span style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', color: '#34d399' }}>{formatTime(timerSeconds)}</span>
                <button 
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  style={{ backgroundColor: isTimerRunning ? '#ef4444' : '#34d399', color: isTimerRunning ? '#fff' : '#09090b', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
                >
                  {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: '#18181b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#f4f4f5', margin: '0 0 12px 0' }}>📄 Submit Invoice for Payout</h2>
              <form onSubmit={(e) => { e.preventDefault(); setModalType('invoice'); setIsModalOpen(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Amount ({taxData.currency})</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 500" 
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" style={{ backgroundColor: '#34d399', color: '#09090b', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                  Submit Invoice
                </button>
              </form>
            </div>

            {/* Perfil Fiscal com Configuração de 2FA e Preferências */}
            <div style={{ backgroundColor: '#18181b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#f4f4f5', margin: '0 0 12px 0' }}>⚙️ Tax, Security & Localization</h2>
              {isSaved && (
                <div style={{ backgroundColor: '#065f4633', color: '#34d399', padding: '8px', borderRadius: '8px', fontSize: '11px', textAlign: 'center', marginBottom: '10px' }}>
                  Profile updated successfully!
                </div>
              )}
              <form onSubmit={handleSaveTax} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Full Name / Entity</label>
                  <input 
                    type="text" 
                    value={taxData.name} 
                    onChange={(e) => setTaxData({...taxData, name: e.target.value})}
                    style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Tax ID / EIN / VAT</label>
                  <input 
                    type="text" 
                    value={taxData.taxId} 
                    onChange={(e) => handleTaxIdChange(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090b', padding: '10px', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>Two-Factor Auth (2FA)</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a1a1aa' }}>Required for global payouts</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={taxData.twoFactorEnabled}
                    onChange={(e) => setTaxData({...taxData, twoFactorEnabled: e.target.checked})}
                    style={{ width: '16px', height: '16px', accentColor: '#34d399', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Currency</label>
                    <select 
                      value={taxData.currency}
                      onChange={(e) => setTaxData({...taxData, currency: e.target.value as any})}
                      style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Language</label>
                    <select 
                      value={taxData.language}
                      onChange={(e) => setTaxData({...taxData, language: e.target.value as any})}
                      style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                    >
                      <option value="EN (US)">EN (US)</option>
                      <option value="EN (UK)">EN (UK)</option>
                      <option value="Global Business">Global</option>
                    </select>
                  </div>
                </div>
                <button type="submit" style={{ backgroundColor: '#27272a', color: '#f4f4f5', border: '1px solid #3f3f46', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Save Preferences
                </button>
              </form>
            </div>

            <div style={{ backgroundColor: '#18181b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#f4f4f5', margin: '0 0 12px 0' }}>📁 Compliance Documents</h2>
              <form onSubmit={handleUploadDoc} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Document Name (e.g. W-8BEN Form)" 
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ backgroundColor: '#27272a', color: '#f4f4f5', border: '1px solid #3f3f46', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                  Upload File
                </button>
              </form>
            </div>

          </div>
        )}

      </main>

      {/* Modal Interativo */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '380px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f4f4f5', margin: 0 }}>
                {modalType === 'escrow' ? 'Fund Escrow Milestone' : 'Create New Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '16px', cursor: 'pointer' }}>✕</button>
            </div>

            {modalType !== 'escrow' && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button 
                  onClick={() => setModalType('task')}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer', backgroundColor: modalType === 'task' ? '#34d399' : '#27272a', color: modalType === 'task' ? '#09090b' : '#a1a1aa' }}
                >
                  Task
                </button>
                <button 
                  onClick={() => setModalType('invoice')}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer', backgroundColor: modalType === 'invoice' ? '#34d399' : '#27272a', color: modalType === 'invoice' ? '#09090b' : '#a1a1aa' }}
                >
                  Invoice
                </button>
              </div>
            )}

            <form onSubmit={handleCreateFromModal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {modalType === 'escrow' ? (
                <div>
                  <label style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Amount to Deposit (USD)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 1000"
                    value={escrowDepositAmount}
                    onChange={(e) => setEscrowDepositAmount(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              ) : modalType === 'task' ? (
                <>
                  <div>
                    <label style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Task Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dashboard Wireframes"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Estimated Hours</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 10"
                      value={formHours}
                      onChange={(e) => setFormHours(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Invoice Amount ({taxData.currency})</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 750"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#27272a', color: '#f4f4f5', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, backgroundColor: '#34d399', color: '#09090b', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                  Confirm
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Floating Bottom Navigation */}
      {userRole === 'agency' && (
        <nav style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', backgroundColor: '#18181bfb', backdropFilter: 'blur(8px)', border: '1px solid #27272a', padding: '6px', borderRadius: '16px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 30, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <button 
            onClick={() => setCurrentTab('dashboard')}
            style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', backgroundColor: currentTab === 'dashboard' ? '#27272a' : 'transparent', color: currentTab === 'dashboard' ? '#34d399' : '#a1a1aa' }}
          >
            <span style={{ fontSize: '14px' }}>📊</span>
            <span style={{ fontSize: '9px' }}>Home</span>
          </button>
          <button 
            onClick={() => setCurrentTab('freelancers')}
            style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', backgroundColor: currentTab === 'freelancers' ? '#27272a' : 'transparent', color: currentTab === 'freelancers' ? '#34d399' : '#a1a1aa' }}
          >
            <span style={{ fontSize: '14px' }}>👥</span>
            <span style={{ fontSize: '9px' }}>Team</span>
          </button>
          <button 
            onClick={() => setCurrentTab('tasks')}
            style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', backgroundColor: currentTab === 'tasks' ? '#27272a' : 'transparent', color: currentTab === 'tasks' ? '#34d399' : '#a1a1aa' }}
          >
            <span style={{ fontSize: '14px' }}>⏱️</span>
            <span style={{ fontSize: '9px' }}>Tasks</span>
          </button>
          <button 
            onClick={() => setCurrentTab('invoices')}
            style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', backgroundColor: currentTab === 'invoices' ? '#27272a' : 'transparent', color: currentTab === 'invoices' ? '#34d399' : '#a1a1aa' }}
          >
            <span style={{ fontSize: '14px' }}>📄</span>
            <span style={{ fontSize: '9px' }}>Invoices</span>
          </button>
          <button 
            onClick={() => setCurrentTab('audit')}
            style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', backgroundColor: currentTab === 'audit' ? '#27272a' : 'transparent', color: currentTab === 'audit' ? '#34d399' : '#a1a1aa' }}
          >
            <span style={{ fontSize: '14px' }}>🛡️</span>
            <span style={{ fontSize: '9px' }}>Audit</span>
          </button>
        </nav>
      )}

    </div>
  );
}