import os
from datetime import datetime
from google_places_collector import GooglePlacesReviewCollector
from google_places_preprocessor import GooglePlacesPreprocessor

# Try to import config file (if it exists)
try:
    from config import GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID
    USE_CONFIG_FILE = True
except ImportError:
    USE_CONFIG_FILE = False


def run_pipeline():
    print("=" * 70)
    print("Google Places → CSV Pipeline")
    print("=" * 70)

    # Get API key and place ID from config file or environment variables
    if USE_CONFIG_FILE:
        api_key = GOOGLE_PLACES_API_KEY
        place_id = GOOGLE_PLACE_ID
        print("✓ Using API key from config.py")
    else:
        api_key = os.getenv("GOOGLE_PLACES_API_KEY")
        place_id = os.getenv("GOOGLE_PLACE_ID")
        if api_key:
            print("✓ Using API key from environment variable")

    if not api_key or not place_id:
        print("❌ Missing API key or Place ID.")
        print("   Option 1: Create config.py with your API key (recommended)")
        print("   Option 2: Set environment variables:")
        print("     export GOOGLE_PLACES_API_KEY='your_key_here'")
        print("     export GOOGLE_PLACE_ID='your_place_id'")
        return

    collector = GooglePlacesReviewCollector(api_key, place_id)
    json_file = collector.collect_and_save()

    if not json_file:
        print("❌ Failed to collect reviews. Aborting.")
        return

    preprocessor = GooglePlacesPreprocessor()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"app_ready_reviews_{timestamp}.csv"
    processed_file = preprocessor.process_all(
        specific_file=json_file,
        output_file=output_file
    )

    if processed_file:
        print("\n🎉 Pipeline complete!")
        print(f"   CSV ready at: {processed_file}")
        print("   Upload this file via the app's Bulk Import → CSV mode.")
    else:
        print("❌ Preprocessing failed.")


if __name__ == "__main__":
    run_pipeline()

