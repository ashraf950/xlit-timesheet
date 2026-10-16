import { createContext, useContext, useEffect, useState, createElement } from 'react';
import { uid, stamp } from './utils';

const KEY = 'xlit_ts_react';
const seed = {
  users: [{ id: 'u0', name: 'XLIT Admin', email: 'admin@xlit.com', pw: 'admin123', role: 'admin', title: 'Administrator', type: 'Salary' }],
  entries: [], me: null,
};
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || seed; } catch { return seed; } };
const Ctx = createContext();
export const useApp = () => useContext(Ctx);

// Single store: users + time entries, persisted in localStorage.
// Replace these actions with API calls when you add a backend.
export function AppProvider({ children }) {
  const [S, setS] = useState(load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }, [S]);
  const me = S.users.find(u => u.id === S.me);
  const user = id => S.users.find(u => u.id === id) || { name: 'Unknown' };
  const upd = fn => setS(s => fn(structuredClone(s)));
  const log = (e, a, n = '') => e.h.push({ t: stamp(), by: me.name, a, n });
  const find = (s, id) => s.entries.find(x => x.id === id);

  const A = {
    login(email, pw) {
      const u = S.users.find(x => x.email.toLowerCase() === email.trim().toLowerCase() && x.pw === pw && x.active !== false);
      if (u) setS(s => ({ ...s, me: u.id }));
      return u || null;
    },
    logout() { setS(s => ({ ...s, me: null })); },
    addUser({ first, last, email, title, type }) {
      email = email.trim().toLowerCase();
      if (!first.trim() || !last.trim() || !/^\S+@\S+\.\S+$/.test(email)) return { error: 'Enter a first name, last name and valid email.' };
      if (S.users.some(u => u.email.toLowerCase() === email)) return { error: 'A user with this email already exists.' };
      const pw = 'Xl' + Math.random().toString(36).slice(2, 8) + '!';
      setS(s => ({ ...s, users: [...s.users, { id: uid(), name: `${first.trim()} ${last.trim()}`, email, pw, role: 'emp', title: title.trim() || 'Employee', type }] }));
      return { email, pw, first };
    },
    toggleUser(id) { upd(s => { const u = s.users.find(x => x.id === id); u.active = u.active === false; return s; }); },
    saveEntry({ id, mode, data, reason, approve }) {
      upd(s => {
        if (mode === 'emp' && !id) { const e = { id: uid(), uid: s.me, ...data, status: 'Pending', remark: '', h: [] }; log(e, 'Submitted'); s.entries.push(e); }
        else if (mode === 'emp') { const e = find(s, id), was = e.status; Object.assign(e, data, { status: 'Pending' }); if (was === 'Returned') e.remark = ''; log(e, was === 'Returned' ? 'Corrected and resubmitted' : 'Edited'); }
        else { const e = find(s, id); Object.assign(e, data, { edited: true, status: approve ? 'Approved' : 'Pending' }); log(e, approve ? 'Edited and approved' : 'Edited by admin', reason); }
        return s;
      });
    },
    approve(id) { upd(s => { const e = find(s, id); e.status = 'Approved'; e.remark = ''; log(e, 'Approved'); return s; }); },
    returnEntry(id, remark) { upd(s => { const e = find(s, id); e.status = 'Returned'; e.remark = remark; log(e, 'Returned for correction', remark); return s; }); },
  };
  return createElement(Ctx.Provider, { value: { S, me, user, ...A } }, children);
}
