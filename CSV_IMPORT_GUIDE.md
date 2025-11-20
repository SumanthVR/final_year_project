# CSV Review Import - Complete Guide

## 📍 Where to Add CSV Files with Reviews

You can add CSV files with reviews in **two ways**:

### 1. **Via UI Upload (Recommended for Quick Testing)**
- Go to the "Add Review" tab
- Switch to "Bulk Import" mode
- Click the "CSV File" button
- Upload your CSV file directly through the interface
- Reviews will be automatically processed and displayed

### 2. **In the `src/data/` Directory (For Permanent Storage)**
- Place your CSV files in: `src/data/`
- Example: `src/data/reviews.csv`, `src/data/my-reviews.csv`, etc.
- These files can be manually imported or loaded programmatically

## 📝 CSV File Format

### Supported Formats:

#### **Full Format (Recommended)** - All fields
```csv
author,content,rating,category,date,location,verified
John Doe,"Great hotel with amazing views",5,hotel,2024-12-15,"New York, NY",true
Jane Smith,"Poor service at restaurant",2,restaurant,2024-12-10,"Los Angeles, CA",false
```

#### **Minimal Format** - Only required fields
```csv
content,category,rating
"Great hotel with amazing views",hotel,5
"Poor service at restaurant",restaurant,2
```

#### **Medium Format** - Some optional fields
```csv
content,category,rating,author,location
"Great hotel with amazing views",hotel,5,John Doe,"New York, NY"
"Poor service at restaurant",restaurant,2,Jane Smith,"Los Angeles, CA"
```

### Column Requirements:

| Column | Required | Description | Default if Missing |
|--------|----------|-------------|-------------------|
| `content` | ✅ Yes | Review text (use quotes if contains commas) | - |
| `category` | ✅ Yes | Must be: `hotel`, `restaurant`, or `product` | - |
| `rating` | ✅ Yes | Integer from 1 to 5 | - |
| `author` | ❌ No | Reviewer name | "Reviewer 1", "Reviewer 2", etc. |
| `date` | ❌ No | Date in YYYY-MM-DD format | Random date (last 90 days) |
| `location` | ❌ No | Location string | Random US city |
| `verified` | ❌ No | Boolean (true/false or yes/no) | false |

## 🚀 How to Use

### Method 1: Upload via Web Interface
1. Navigate to your website
2. Click on "Add Review" tab
3. Click "Bulk Import" button
4. Switch to "CSV File" mode (button at top right)
5. Click "Upload CSV File" area
6. Select your CSV file
7. Reviews are automatically processed and added!

### Method 2: Load from Data Directory (Programmatic)
If you want to automatically load CSV files when the app starts:

1. Edit `src/App.tsx`
2. Uncomment the code block (lines 16-35)
3. Import your CSV file:
   ```typescript
   import reviewsCSV from './data/reviews.csv?raw';
   const csvReviews = await loadCSVFromFile(reviewsCSV);
   ```

## 📂 Example Files

- **Example CSV**: `src/data/reviews.csv` - Contains sample reviews in full format
- **Format Guide**: `src/data/CSV_FORMAT_GUIDE.md` - Detailed documentation

## ⚙️ How It Works

1. **CSV Parser** (`src/utils/sentimentAnalysis.ts`):
   - Parses CSV content (handles quoted fields, headers, multiple formats)
   - Validates and normalizes data
   - Performs automatic sentiment analysis
   - Extracts pros/cons and emotions

2. **Bulk Processor** (`src/components/BulkReviewProcessor.tsx`):
   - Supports both text input and CSV file uploads
   - Provides UI for file selection
   - Processes and displays reviews

3. **Review Display**:
   - All reviews (CSV or manual) appear in the same reviews list
   - Full analytics and sentiment analysis applied automatically

## 💡 Important Notes

- **Quoted Fields**: If review content contains commas, wrap it in double quotes: `"Great hotel, amazing service"`
- **Headers**: Headers are optional but recommended
- **Auto-Analysis**: All reviews are automatically analyzed for sentiment, pros/cons, and emotions
- **Categories**: Must be exactly: `hotel`, `restaurant`, or `product` (case-insensitive)
- **Ratings**: Must be integers from 1 to 5

## 📊 Example CSV File

See `src/data/reviews.csv` for a complete working example with multiple reviews in full format.

## 🔧 Technical Details

- **Parser Location**: `src/utils/sentimentAnalysis.ts` - `parseCSVReviews()` function
- **Loader Utility**: `src/utils/loadCSVReviews.ts` - Helper functions for loading CSV files
- **Component**: `src/components/BulkReviewProcessor.tsx` - UI for CSV uploads

