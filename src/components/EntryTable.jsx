import { Fragment } from 'react';
import { useApp } from '../store';
import { t12, dfmt } from '../utils';

export const Stats = ({ items }) => (
  <div className="stats">
    {items.map(([label, value, cls]) => (
      <div key={label} className={'st ' + (cls || '')}><span>{label}</span><div>{value}</div></div>
    ))}
  </div>
);

function Actions({ e, mode, open }) {
  const { approve } = useApp();
  return (
    <>
      {mode === 'admin' && e.status === 'Pending' && <>
        <button className="btn s g" onClick={() => approve(e.id)}>Approve</button>
        <button className="btn s r" onClick={() => open({ type: 'return', id: e.id })}>Return</button>
        <button className="btn s" onClick={() => open({ type: 'entry', id: e.id, mode: 'admin' })}>Edit</button>
      </>}
      {mode === 'emp' && e.status === 'Returned' &&
        <button className="btn s p" onClick={() => open({ type: 'entry', id: e.id, mode: 'emp' })}>Correct and resubmit</button>}
      {mode === 'emp' && e.status === 'Pending' &&
        <button className="btn s" onClick={() => open({ type: 'entry', id: e.id, mode: 'emp' })}>Edit</button>}
      <button className="btn s" onClick={() => open({ type: 'hist', id: e.id })}>History</button>
    </>
  );
}

export default function EntryTable({ list, mode, open }) {
  const { user } = useApp();
  const admin = mode === 'admin';
  if (!list.length) return <div className="empty">{admin ? 'Nothing here. New entries from employees will appear for review.' : 'No time entries yet. Choose Add entry to log your hours.'}</div>;
  const rows = [...list].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="tw"><table>
      <thead><tr>{admin && <th>Employee</th>}<th>Date</th><th>In</th><th>Out</th><th>Break</th><th>Hours</th><th>Type</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {rows.map(e => (
          <Fragment key={e.id}>
            <tr>
              {admin && <td><b>{user(e.uid).name}</b></td>}
              <td>{dfmt(e.date)}</td><td>{t12(e.in)}</td><td>{t12(e.out)}</td><td>{e.br || 0}m</td>
              <td><b>{e.hrs.toFixed(2)}</b></td><td>{e.cls}</td><td>{e.notes.slice(0, 40)}</td>
              <td><span className={'bd ' + e.status}>{e.status}</span>{e.edited && <span className="hint"> edited</span>}</td>
              <td><Actions e={e} mode={mode} open={open} /></td>
            </tr>
            {e.status === 'Returned' && e.remark &&
              <tr className="rem"><td colSpan={admin ? 10 : 9}><b>Admin remark:</b> {e.remark}</td></tr>}
          </Fragment>
        ))}
      </tbody>
    </table></div>
  );
}
