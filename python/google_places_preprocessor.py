import json
import os
import pandas as pd
from glob import glob
from datetime import datetime
from typing import Optional, Tuple

class GooglePlacesPreprocessor:
    def __init__(self, json_folder="collected_reviews"):
        """
        Initialize preprocessor for Google Places API data
        json_folder: Folder containing JSON files from Google Places API
        """
        self.json_folder = json_folder
    
    def load_google_places_json(self, specific_file=None):
        """Load JSON files specifically from Google Places API format"""
        all_reviews = []
        
        if specific_file:
            files = [specific_file]
        else:
            pattern = os.path.join(self.json_folder, "google_reviews_*.json")
            files = glob(pattern)
        
        if not files:
            print(f"No Google Places JSON files found in {self.json_folder}")
            print("Looking for files with pattern: google_reviews_*.json")
            return []
        
        print(f"Found {len(files)} Google Places JSON file(s)")
        
        for file_path in files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                    if isinstance(data, list):
                        all_reviews.extend(data)
                        print(f"✓ Loaded {len(data)} reviews from {os.path.basename(file_path)}")
                    else:
                        print(f"⚠ Unexpected format in {file_path}")
            
            except Exception as e:
                print(f"Error loading {file_path}: {e}")
        
        return all_reviews
    
    def extract_google_places_data(self, reviews):
        """Extract and format data specifically from Google Places API structure"""
        processed_data = []
        
        for review in reviews:
            # Extract timestamp and convert to readable date
            timestamp = review.get('date', None)
            if timestamp:
                try:
                    date_obj = datetime.fromtimestamp(int(timestamp))
                    formatted_date = date_obj.strftime('%Y-%m-%d')
                except:
                    formatted_date = datetime.now().strftime('%Y-%m-%d')
            else:
                formatted_date = datetime.now().strftime('%Y-%m-%d')
            
            # Extract review text
            review_text = review.get('review', '').strip()
            
            # Skip empty reviews
            if not review_text or len(review_text) < 5:
                continue
            
            # Get location (prefer place address, fallback to place name)
            location = review.get('place_address', '') or review.get('place_name', 'Not specified')
            
            processed_data.append({
                'id': review.get('id', None),
                'user': review.get('user', 'Anonymous'),
                'review_text': review_text,
                'rating': review.get('rating', None),
                'date': formatted_date,
                'location': location,
                'category': review.get('category', 'product'),
                'relative_time': review.get('relative_time', None),
                'profile_photo': review.get('profile_photo', None)
            })
        
        return processed_data
    
    def clean_and_validate(self, df):
        """Clean and validate Google Places review data"""
        print(f"\n{'='*60}")
        print("Data Cleaning and Validation")
        print(f"{'='*60}")
        
        initial_count = len(df)
        print(f"Initial reviews: {initial_count}")
        
        # 1. Remove duplicates based on review text
        df = df.drop_duplicates(subset=['review_text'], keep='first')
        print(f"After removing duplicates: {len(df)} (removed {initial_count - len(df)})")
        
        # 2. Clean review text
        df['review_text'] = df['review_text'].astype(str).str.strip()
        
        # 3. Remove reviews that are too short
        df = df[df['review_text'].str.len() >= 10]
        print(f"After removing short reviews (<10 chars): {len(df)}")
        
        # 4. Handle missing ratings
        if df['rating'].isna().any():
            print(f"Warning: {df['rating'].isna().sum()} reviews have missing ratings")
            df['rating'] = df['rating'].fillna(3)
        
        # 5. Ensure ratings are in valid range (1-5)
        df['rating'] = df['rating'].clip(1, 5).astype(int)
        
        # 6. Validate category
        valid_categories = ['hotel', 'restaurant', 'product']
        df['category'] = df['category'].apply(
            lambda x: x if x in valid_categories else 'product'
        )
        
        print(f"\nFinal cleaned reviews: {len(df)}")
        print(f"{'='*60}\n")
        
        return df
    
    def create_dataframe(self, processed_data):
        """Create pandas DataFrame from processed Google Places data"""
        df = pd.DataFrame(processed_data)
        
        if len(df) == 0:
            print("No data to process!")
            return None
        
        print(f"\n✓ Created DataFrame with {len(df)} reviews")
        print(f"  Columns: {list(df.columns)}")
        
        # Clean and validate
        df = self.clean_and_validate(df)
        
        # Display statistics
        print("\nData Statistics:")
        print(f"  Average rating: {df['rating'].mean():.2f}/5")
        print(f"  Rating distribution:")
        for rating in sorted(df['rating'].unique()):
            count = len(df[df['rating'] == rating])
            percentage = (count / len(df)) * 100
            print(f"    {int(rating)} stars: {count} ({percentage:.1f}%)")
        
        return df
    
    def export_for_app(self, df, output_file="app_ready_reviews.csv"):
        """
        Export data in the exact format the React app expects:
        author,location,content,category,rating
        """
        if df is None or len(df) == 0:
            print("No data to export!")
            return None
        
        # Create export DataFrame with exact column names
        export_df = pd.DataFrame({
            'author': df['user'],
            'location': df['location'],
            'content': df['review_text'],
            'category': df['category'],
            'rating': df['rating']
        })
        
        # Save to CSV
        export_df.to_csv(output_file, index=False, encoding='utf-8')
        print(f"\n✓ Exported {len(export_df)} reviews to {output_file}")
        print(f"  Format: author,location,content,category,rating")
        print(f"  Ready for import into the React app!")
        
        return output_file
    
    def process_all(self, specific_file=None, output_file="app_ready_reviews.csv"):
        """Complete preprocessing pipeline for Google Places data"""
        print("=" * 60)
        print("Google Places Data Preprocessing")
        print("=" * 60)
        
        # Step 1: Load Google Places JSON files
        reviews = self.load_google_places_json(specific_file)
        
        if not reviews:
            print("\n❌ No reviews to process!")
            print("Make sure you have run the collector first.")
            return None
        
        print(f"\n✓ Total reviews loaded: {len(reviews)}")
        
        # Step 2: Extract Google Places specific data
        print("\nExtracting Google Places data structure...")
        processed_data = self.extract_google_places_data(reviews)
        print(f"✓ Extracted {len(processed_data)} valid reviews")
        
        # Step 3: Create DataFrame
        df = self.create_dataframe(processed_data)
        
        if df is None:
            return None
        
        # Step 4: Export for app
        output_path = self.export_for_app(df, output_file)
        
        print("\n" + "=" * 60)
        print("✓ Preprocessing Complete!")
        print("=" * 60)
        print(f"✅ Ready to import: {output_path}")
        
        return output_path


if __name__ == "__main__":
    import sys
    
    # Check for specific file argument
    specific_file = sys.argv[1] if len(sys.argv) > 1 else None
    output_file = sys.argv[2] if len(sys.argv) > 2 else "app_ready_reviews.csv"
    
    preprocessor = GooglePlacesPreprocessor()
    preprocessor.process_all(specific_file=specific_file, output_file=output_file)

