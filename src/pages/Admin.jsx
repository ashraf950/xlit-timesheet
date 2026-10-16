import { useState } from 'react';
import { useApp } from '../store';
import EntryTable, { Stats } from '../components/EntryTable';
import { sum } from '../utils';

const count = (l, s) => l.filter(e => e.status === s).length;

export function Dashboard({ open, go }) {
  const { S } = useApp();
  const pending = S.entries.filter(e => e.status === 'Pending');
  return <>
    <Stats items={[
      ['Employees', S.users.filter(u => u.role !== 'admin').length],
      ['Awaiting review', pending.length, 'w'],
      ['Returned for correction', count(S.entries, 'Returned'), 'b'],
      ['Approved hours', sum(S.entries.filter(e => e.status === 'Approved')), 'g'],
    ]} />
    <div className="card">
      <div className="ch"><h2>Awaiting your review</h2><button className="btn" onClick={() => go('appr')}>Open approvals</button></div>
      <EntryTable list={pending.slice(0, 6)} mode="admin" open={open} />
    </div>
  </>;
}

export function Approvals({ open }) {
  const { S } = useApp();
  const [filter, setFilter] = useState('Pending');
  const list = S.entries.filter(e => filter === 'All' || e.status === filter);
  return (
    <div className="card">
      <div className="ch"><h2>Time entries</h2>
        <div className="pills">{['Pending', 'Returned', 'Approved', 'All'].map(f =>
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
      </div>
      <EntryTable list={list} mode="admin" open={open} />
    </div>
  );
}

export function Employees({ open }) {
  const { S, toggleUser } = useApp();
  const list = S.users.filter(u => u.role !== 'admin');
  return (
    <div className="card">
      <div className="ch"><h2>{list.length} employee{list.length === 1 ? '' : 's'}</h2>
        <button className="btn p" onClick={() => open({ type: 'user' })}>Add employee</button></div>
      {list.length ? <div className="tw"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Job title</th><th>Pay type</th><th>Hours logged</th><th>Pending</th><th>Access</th></tr></thead>
        <tbody>{list.map(u => {
          const e = S.entries.filter(x => x.uid === u.id);
          return <tr key={u.id}><td><b>{u.name}</b></td><td>{u.email}</td><td>{u.title}</td><td>{u.type}</td>
            <td>{sum(e)}</td><td>{count(e, 'Pending')}</td>
            <td><button className={'btn s ' + (u.active === false ? '' : 'r')} onClick={() => toggleUser(u.id)}>{u.active === false ? 'Enable login' : 'Disable login'}</button></td></tr>;
        })}</tbody></table></div>
        : <div className="empty">No employees yet. Add your first employee to give them a login.</div>}
    </div>
  );
}
