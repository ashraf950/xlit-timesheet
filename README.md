# XLIT Timesheet Portal (React + Vite)

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in /dist

## Demo login
Admin: admin@xlit.com / admin123

## Workflow
1. Admin: Employees > Add employee (login credentials are generated and shown once).
2. Employee: sign in > Add entry (goes to the admin as Pending).
3. Admin: Approvals > Approve, Return (remark required) or Edit (reason required).
4. Employee: sees the remark on a returned entry > Correct and resubmit.

## Structure
- src/store.js          state, actions and localStorage persistence (swap for API calls later)
- src/App.jsx           layout, navigation, modal host
- src/components/       Login, EntryTable, Modal (add user, entry form, return, history)
- src/pages/            Admin (dashboard, approvals, employees) and Employee timesheet

Data is stored in the browser (localStorage). For multi-device use, connect store.js to a backend API.
