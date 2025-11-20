## Google Places → CSV Pipeline

### 1. Prerequisites
- Python 3.9+
- pip install:
  ```
  pip install requests pandas
  ```
- Google Places API enabled in Google Cloud Console
- API key + Place ID

### 2. Set environment variables
```
export GOOGLE_PLACES_API_KEY="your_key"
export GOOGLE_PLACE_ID="your_place_id"
```
(On PowerShell use `$env:GOOGLE_PLACES_API_KEY="..."`)

### 3. Run the pipeline
From the project root:
```
cd python
python run_google_pipeline.py
```

### 4. What it does
1. Calls Google Places API, saves JSON in `collected_reviews/`
2. Cleans & validates reviews
3. Outputs `app_ready_reviews_YYYYMMDD_HHMMSS.csv` with columns:
   ```
   author,location,content,category,rating
   ```

### 5. Import into the app
1. Open the React app
2. Go to `Add Reviews` → `Bulk Import`
3. Choose `CSV File` mode
4. Upload the generated CSV file
5. Reviews appear instantly and are saved permanently

### 6. Notes
- Keep your API key secret (never commit it)
- You can rerun the pipeline anytime; each CSV has a timestamp
- The CSV matches the same format used by the Bulk Review form

