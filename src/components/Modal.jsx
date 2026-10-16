import { useState } from 'react';
import { useApp } from '../store';
import { hrs, today, dfmt } from '../utils';

const CLASSES = ['Regular', 'Overtime', 'Sick', 'Vacation', 'PTO', 'Holiday'];
const Err = ({ children }) => children ? <div className="err">{children}</div> : null;

function UserForm({ open, close }) {
  const { me, addUser } = useApp();
  const [f, setF] = useState({ first: '', last: '', email: '', title: '', type: 'Hourly' });
  const [err, setErr] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const save = () => { const r = addUser(f); if (r.error) setErr(r.error); else open({ type: 'cred', ...r }); };
  return <>
    <h3>Add employee</h3><p>A login is created and the credentials are shown once saved.</p>
    <div className="row"><div><label>First name</label><input value={f.first} onChange={set('first')} /></div><div><label>Last name</label><input value={f.last} onChange={set('last')} /></div></div>
    <label>Email address</label><input type="email" placeholder="name@xlit.com" value={f.email} onChange={set('email')} />
    <label>Job title</label><input value={f.title} onChange={set('title')} />
    <div className="row"><div><label>Pay type</label><select value={f.type} onChange={set('type')}><option>Hourly</option><option>Salary</option></select></div>
      <div><label>Reports to</label><input value={me.name} disabled /></div></div>
    <Err>{err}</Err>
    <div className="acts"><button className="btn" onClick={close}>Cancel</button><button className="btn p" onClick={save}>Save employee</button></div>
  </>;
}

function Credentials({ m, close }) {
  return <>
    <h3>Employee added</h3><p>Share these login details with {m.first}.</p>
    <div className="cred">Email: {m.email}<br />Password: {m.pw}</div>
    <div className="acts"><button className="btn p" onClick={close}>Done</button></div>
  </>;
}

function EntryForm({ m, close }) {
  const { S, user, saveEntry } = useApp();
  const e = m.id ? S.entries.find(x => x.id === m.id) : { date: today(), in: '09:00', out: '17:00', br: 30, cls: 'Regular', notes: '' };
  const admin = m.mode === 'admin';
  const [f, setF] = useState({ date: e.date, in: e.in, out: e.out, br: e.br || 0, cls: e.cls, notes: e.notes });
  const [reason, setReason] = useState('');
  const [approve, setApprove] = useState(false);
  const [err, setErr] = useState('');
  const set = k => ev => setF({ ...f, [k]: ev.target.value });
  const h = hrs(f.in, f.out, f.br);
  const save = () => {
    if (!f.date || !f.in || !f.out) return setErr('Enter the date, clock in and clock out times.');
    if (h <= 0) return setErr('Clock out must be after clock in, after the break.');
    if (admin && !reason.trim()) return setErr('Enter a reason for this edit.');
    saveEntry({ id: m.id, mode: m.mode, data: { ...f, br: +f.br || 0, hrs: h, notes: f.notes.trim() }, reason: reason.trim(), approve });
    close();
  };
  const returned = !admin && e.status === 'Returned';
  return <>
    <h3>{admin ? 'Edit time entry' : returned ? 'Correct and resubmit' : m.id ? 'Edit entry' : 'Add time entry'}</h3>
    {admin ? <p>{user(e.uid).name}</p> : returned ? <div className="err" style={{ marginTop: 8 }}><b>Admin remark:</b> {e.remark}</div> : <p>Log your work for the day.</p>}
    <div className="row"><div><label>Date</label><input type="date" value={f.date} onChange={set('date')} /></div>
      <div><label>Time class</label><select value={f.cls} onChange={set('cls')}>{CLASSES.map(c => <option key={c}>{c}</option>)}</select></div></div>
    <div className="row"><div><label>Clock in</label><input type="time" value={f.in} onChange={set('in')} /></div>
      <div><label>Clock out</label><input type="time" value={f.out} onChange={set('out')} /></div></div>
    <div className="row"><div><label>Break (minutes)</label><input type="number" min="0" value={f.br} onChange={set('br')} /></div>
      <div><label>Total hours</label><input value={h.toFixed(2)} disabled /></div></div>
    <label>Notes</label><textarea rows="3" placeholder="What did you work on?" value={f.notes} onChange={set('notes')} />
    {admin && <>
      <label>Reason for edit (required)</label><input value={reason} onChange={ev => setReason(ev.target.value)} />
      <label style={{ fontWeight: 400 }}><input type="checkbox" style={{ width: 'auto' }} checked={approve} onChange={ev => setApprove(ev.target.checked)} /> Approve after saving</label>
    </>}
    <Err>{err}</Err>
    <div className="acts"><button className="btn" onClick={close}>Cancel</button>
      <button className="btn p" onClick={save}>{admin ? 'Save changes' : returned ? 'Resubmit for approval' : m.id ? 'Save entry' : 'Submit entry'}</button></div>
  </>;
}

function ReturnForm({ m, close }) {
  const { S, user, returnEntry } = useApp();
  const e = S.entries.find(x => x.id === m.id);
  const [r, setR] = useState('');
  const [err, setErr] = useState('');
  const send = () => { if (!r.trim()) return setErr('Enter a remark so the employee knows what to fix.'); returnEntry(m.id, r.trim()); close(); };
  return <>
    <h3>Return for correction</h3><p>{user(e.uid).name} · {dfmt(e.date)} · {e.hrs.toFixed(2)} hrs</p>
    <label>Remark for the employee (required)</label>
    <textarea rows="4" value={r} onChange={ev => setR(ev.target.value)} placeholder="Explain what needs to be corrected, e.g. Break time is missing." />
    <Err>{err}</Err>
    <div className="acts"><button className="btn" onClick={close}>Cancel</button><button className="btn r" onClick={send}>Return to employee</button></div>
  </>;
}

function History({ m, close }) {
  const { S, user } = useApp();
  const e = S.entries.find(x => x.id === m.id);
  return <>
    <h3>Entry history</h3><p>{user(e.uid).name} · {dfmt(e.date)}</p>
    <div className="hist">{e.h.map((x, i) => <div key={i}><b>{x.a}</b> by {x.by}<br /><small>{x.t}</small>{x.n && <><br />{x.n}</>}</div>)}</div>
    <div className="acts"><button className="btn" onClick={close}>Close</button></div>
  </>;
}

const BODIES = { user: UserForm, cred: Credentials, entry: EntryForm, return: ReturnForm, hist: History };

export default function Modal({ m, open }) {
  if (!m) return null;
  const close = () => open(null);
  const Body = BODIES[m.type];
  return <div className="ov" onClick={ev => ev.target === ev.currentTarget && close()}><div className="md"><Body m={m} open={open} close={close} /></div></div>;
}
