# CSV Review Import Guide

## Where to Place CSV Files

You can place CSV files with reviews in the `src/data/` directory. These files will be automatically processed and displayed on the website.

## CSV File Format

The CSV parser supports multiple formats:

### Full Format (Recommended)
Include all columns for complete review information:
```csv
author,content,rating,category,date,location,verified
John Doe,"Great hotel with amazing views",5,hotel,2024-12-15,"New York, NY",true
Jane Smith,"Poor service at restaurant",2,restaurant,2024-12-10,"Los Angeles, CA",false
```

### Minimal Format
Only require content, category, and rating:
```csv
content,category,rating
"Great hotel with amazing views",hotel,5
"Poor service at restaurant",restaurant,2
```

### Medium Format
Include additional fields without all columns:
```csv
content,category,rating,author,location
"Great hotel with amazing views",hotel,5,John Doe,"New York, NY"
"Poor service at restaurant",restaurant,2,Jane Smith,"Los Angeles, CA"
```

## Column Descriptions

- **author** (optional): Reviewer name. If not provided, defaults to "Reviewer 1", "Reviewer 2", etc.
- **content** (required): The review text
- **rating** (required): Rating from 1 to 5
- **category** (required): Must be one of: `hotel`, `restaurant`, or `product`
- **date** (optional): Date in YYYY-MM-DD format. If not provided, a random date within the last 90 days is assigned.
- **location** (optional): Location string. If not provided, a random US city is assigned.
- **verified** (optional): Boolean (true/false or yes/no). Defaults to false if not provided.

## How to Use CSV Files

### Method 1: Upload via UI
1. Go to the "Add Review" tab
2. Switch to "Bulk Import" mode
3. Click the "CSV File" button
4. Click "Upload CSV File" and select your CSV file
5. The reviews will be automatically processed and added

### Method 2: Programmatic Loading
CSV files in the `src/data/` directory can be imported and loaded programmatically. 
The `parseCSVReviews` function from `src/utils/sentimentAnalysis.ts` can be used to parse CSV content.

## Important Notes

1. **Quoted Fields**: If your review content contains commas, wrap it in double quotes: `"Great hotel, amazing service"`
2. **Headers**: Headers are optional but recommended for clarity
3. **Auto-Analysis**: All reviews are automatically analyzed for sentiment, pros/cons, and emotions
4. **Categories**: Must be exactly: `hotel`, `restaurant`, or `product` (case-insensitive)
5. **Ratings**: Must be integers from 1 to 5

## Example Files

See `src/data/reviews.csv` for a complete example with all fields populated.

