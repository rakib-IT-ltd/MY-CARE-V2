# Hostel services (planned)

Right now, the Firestore calls (reads/writes/listeners) for the Hostel module live
directly inside the page files (`HostelLayout.jsx`, `Students.jsx`, `Meals.jsx`,
`Rent.jsx`, `Reports.jsx`, `ManagerDashboard.jsx`, `StudentDashboard.jsx`).

The next refactor step is to pull that logic out into dedicated service functions
here, e.g.:

- `studentService.js` — add/update/list students, connection requests
- `mealService.js` — save/read daily menus and choices, meal history queries
- `rentService.js` — record payments, read payment history, rent settings
- `hostelService.js` — create/read hostel document, role assignment

Each page would then import plain async functions (e.g. `markRentPaid(hostelId, studentId, amount)`)
instead of calling Firestore directly — easier to test, and the same pattern can be
reused for Health, Finance, Family, etc. once those get real backends too.
