import { useApp } from '../store';
import EntryTable, { Stats } from '../components/EntryTable';
import { sum } from '../utils';

export default function MyTimesheet({ open }) {
  const { S } = useApp();
  const list = S.entries.filter(e => e.uid === S.me);
  const c = s => list.filter(e => e.status === s).length;
  return <>
    <Stats items={[
      ['Total hours logged', sum(list)],
      ['Pending review', c('Pending'), 'w'],
      ['Needs correction', c('Returned'), 'b'],
      ['Approved hours', sum(list.filter(e => e.status === 'Approved')), 'g'],
    ]} />
    <div className="card">
      <div className="ch"><h2>Time entries</h2><button className="btn p" onClick={() => open({ type: 'entry', mode: 'emp' })}>Add entry</button></div>
      <EntryTable list={list} mode="emp" open={open} />
    </div>
  </>;
}
