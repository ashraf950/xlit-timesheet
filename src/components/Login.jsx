import { useState } from 'react';
import { useApp } from '../store';

export default function Login({ onDone }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = e => {
    e.preventDefault();
    const u = login(email, pw);
    if (u) onDone(u); else setErr('Email or password is incorrect.');
  };
  return (
    <div className="login">
      <div className="lh" style={{ backgroundImage: 'url(/office-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="lh-overlay"></div>
        <div className="lh-content">
          <div className="brand"><i>XL</i><div>XLIT<small>Timesheet Portal</small></div></div>
          <h1>Track every hour. Approve with confidence.</h1>
          <p>Employees log their time, administrators review it, and anything that needs fixing goes back with a clear remark.</p>
        </div>
      </div>
      <div className="lf">
        <form onSubmit={submit}>
          <h2>Sign in</h2>
          <p className="hint">Use the credentials your administrator gave you.</p>
          <label htmlFor="le">Email</label>
          <input id="le" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" />
          <label htmlFor="lp">Password</label>
          <input id="lp" type="password" required value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" />
          {err && <div className="err">{err}</div>}
          <button className="btn p" style={{ width: '100%', marginTop: 18, padding: 10 }}>Sign in</button>
          <p className="hint" style={{ marginTop: 16 }}>First time? Admin login: admin@xlit.com / admin123</p>
        </form>
      </div>
    </div>
  );
}
