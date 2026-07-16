# Doctor Handwriting OCR API Usage

## Start the Server

```bash
cd codex-thing
uvicorn backend.route:app --host 0.0.0.0 --port 8000
```

## Endpoints

### 1. Health Check

```bash
curl http://localhost:8000/health
```

### 2. Upload Image File

```bash
curl -X POST http://localhost:8000/ocr/handwriting \
  -F "file=@images/doctor_note_1.jpg" \
  -F "enhance=true"
```

### 3. Upload Multiple Files

```bash
curl -X POST http://localhost:8000/ocr/handwriting/batch \
  -F "files=@images/doctor_note_1.jpg" \
  -F "files=@images/prescription_1.jpg" \
  -F "enhance=true"
```

### 4. Send Base64 Image

```bash
curl -X POST http://localhost:8000/ocr/handwriting/base64 \
  -H "Content-Type: application/json" \
  -d "{\"image_base64\": \"$(base64 -w0 images/doctor_note_1.jpg)\"}"
```

On Windows PowerShell:

```powershell
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("images/doctor_note_1.jpg"))
$body = @{image_base64=$b64} | ConvertTo-Json
curl -X POST http://localhost:8000/ocr/handwriting/base64 `
  -H "Content-Type: application/json" `
  -d $body
```

### 5. Process Image from URL

```bash
curl -X POST http://localhost:8000/ocr/handwriting/url \
  -H "Content-Type: application/json" \
  -d "{\"image_url\": \"https://example.com/prescription.jpg\"}"
```

### 6. Web Upload Form

Open in browser:

```
http://localhost:8000/upload
```

## Response Format

```json
{
  "success": true,
  "natural_language": "Amoxicillin 500mg prescribed. Take 1 capsule 3 times daily...",
  "raw_text": "Rx: Amoxicillin 500mg...",
  "confidence": 0.87,
  "low_confidence_flag": false,
  "processing_time_ms": 6200.0,
  "preprocessed_image_saved": true,
  "metadata": {
    "reasoning": "The user wants me to extract the text...",
    "usage": {"prompt_tokens": 562, "completion_tokens": 584, "total_tokens": 1146},
    "timestamp": "2026-07-14T22:13:53.761558"
  }
}
```

## Batch Response Format

```json
{
  "results": [ { ... } ],
  "total_processed": 2,
  "successful": 2,
  "failed": 0,
  "total_time_ms": 13789.6
}
```

## Notes

- Set `enhance=false` to skip preprocessing and send the raw image.
- `low_confidence_flag` is `true` when confidence < 0.8.
- Add `custom_prompt` form field to override the default VLM instructions.
