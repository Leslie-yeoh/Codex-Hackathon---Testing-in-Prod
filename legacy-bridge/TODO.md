No, for the hackathon MVP you probably do **not** need more pages yet.

Your current structure already covers the core demo flow:

- `/` via `app/page.js`  
  Should become the main dashboard / project overview.

- `/upload` via `app/upload/page.jsx`  
  This should be the main “money page”: upload legacy image/PDF, show OCR text, show normalized FHIR JSON.

- `/logs` via `app/logs/page.jsx`  
  Good for audit trail, validation history, and showing healthcare readiness.

The bigger gap is not another page. The gap is functionality behind `/upload`:

- OCR result panel
- AI normalization result panel
- FHIR JSON preview
- validation status
- submit/test button calling backend/API

One thing to fix: `app/home/page.jsx` exists but is empty. I would either remove `/home` or turn it into a redirect/duplicate dashboard later. For now, having both `/` and `/home` is unnecessary.

Optional pages only if you have extra time:

- `/patients/[id]` for patient-specific extracted records
- `/settings` for OCR/LLM/FHIR endpoint config
- `/demo` for preloaded mock samples during judging

But for a strong hackathon pitch, stay with **3 pages**: dashboard, upload workspace, logs. Then spend time making `/upload` impressive.