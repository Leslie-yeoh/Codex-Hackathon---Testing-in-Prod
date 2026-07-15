# Mock Accounts

These accounts are for frontend testing only. They are stored in the mock login service and do not represent production credentials.

| Role | Username | Email | Password | Access |
| --- | --- | --- | --- | --- |
| Admin | Admin User | admin@legacybridge.local | Admin@1234 | Home, Admin Panel, Upload, Records, About, Settings |
| User | Clinical User | user@legacybridge.local | User@1234 | Home, Upload, Records, About, Settings |

Notes:
- Guest users can view Home and About only.
- Records are stored per signed-in email account in browser storage.
- The admin account cannot view another user's private records from the Records page.
