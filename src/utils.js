export const uid = () => Math.random().toString(36).slice(2, 9);
const mins = t => +t.slice(0, 2) * 60 + +t.slice(3, 5);
export const hrs = (a, b, br) => (a && b ? Math.max(0, (mins(b) - mins(a) - (+br || 0)) / 60) : 0);
export const today = () => new Date().toISOString().slice(0, 10);
export const t12 = t => { const h = +t.slice(0, 2); return `${h % 12 || 12}:${t.slice(3, 5)} ${h < 12 ? 'AM' : 'PM'}`; };
export const dfmt = d => new Date(d + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
export const stamp = () => new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
export const ini = n => n.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
export const sum = l => l.reduce((a, e) => a + e.hrs, 0).toFixed(2);
