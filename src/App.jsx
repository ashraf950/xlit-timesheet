import { useState } from 'react';
import { useApp } from './store';
import Login from './components/Login';
import Modal from './components/Modal';
import { Dashboard, Approvals, Employees } from './pages/Admin';
import MyTimesheet from './pages/Employee';
import { ini } from './utils';

const TITLES = { dash: 'Admin dashboard', appr: 'Timesheet approvals', emp: 'Employees', ts: 'My timesheet' };

export default function App() {
  const { S, me, logout } = useApp();
  const [view, setView] = useState('dash');
  const [modal, open] = useState(null);
  if (!me) return <Login onDone={u => setView(u.role === 'admin' ? 'dash' : 'ts')} />;

  const adm = me.role === 'admin';
  const pend = S.entries.filter(e => e.status === 'Pending').length;
  const nav = adm ? [['dash', 'Dashboard'], ['appr', 'Approvals'], ['emp', 'Employees']] : [['ts', 'My Timesheet']];
  return (
    <div className="app">
      <aside className="side">
        <div className="brand"><i>XL</i><div>XLIT<small>Timesheet Portal</small></div></div>
        <div className="nav">
          {nav.map(([k, l]) => (
            <button key={k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>
              {l}{adm && k === 'appr' && pend > 0 && <b>{pend}</b>}
            </button>
          ))}
        </div>
      </aside>
      <div className="main">
        <div className="top">
          <h1>{TITLES[view]}</h1>
          <div className="who"><b>{me.name}</b><br /><small>{adm ? 'Administrator' : me.title}</small></div>
          <div className="av">{ini(me.name)}</div>
          <button className="btn" onClick={logout}>Sign out</button>
        </div>
        <div className="pg">
          {view === 'dash' && <Dashboard open={open} go={setView} />}
          {view === 'appr' && <Approvals open={open} />}
          {view === 'emp' && <Employees open={open} />}
          {view === 'ts' && <MyTimesheet open={open} />}
        </div>
      </div>
      <Modal m={modal} open={open} />
    </div>
  );
}
