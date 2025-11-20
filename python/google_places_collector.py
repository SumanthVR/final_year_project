import requests
import json
import os
from datetime import datetime
from typing import Optional, List, Dict

class GooglePlacesReviewCollector:
    def __init__(self, api_key: str, place_id: str):
        """
        Initialize Google Places Review Collector
        
        Args:
            api_key: Your Google Places API key (from Google Cloud Console)
            place_id: The Place ID of the location you want to collect reviews from
        """
        self.api_key = api_key
        self.place_id = place_id
        self.api_url = "https://maps.googleapis.com/maps/api/place/details/json"
        self.output_folder = "collected_reviews"
        
        if not os.path.exists(self.output_folder):
            os.makedirs(self.output_folder)
    
    def fetch_reviews(self) -> Optional[List[Dict]]:
        """Fetch reviews from Google Places API"""
        try:
            params = {
                'place_id': self.place_id,
                'fields': 'name,rating,reviews,user_ratings_total,types,formatted_address',
                'key': self.api_key
            }
            
            print(f"Fetching reviews for Place ID: {self.place_id}")
            response = requests.get(self.api_url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('status') == 'OK':
                result = data.get('result', {})
                reviews = result.get('reviews', [])
                
                # Get place metadata
                place_name = result.get('name', 'Unknown')
                place_address = result.get('formatted_address', '')
                place_types = result.get('types', [])
                
                # Determine category based on place types
                category = self._determine_category(place_types)
                
                formatted_reviews = []
                for idx, review in enumerate(reviews):
                    formatted_reviews.append({
                        'id': idx + 1,
                        'user': review.get('author_name', 'Anonymous'),
                        'rating': review.get('rating', 0),
                        'review': review.get('text', ''),
                        'date': review.get('time', datetime.now().timestamp()),
                        'profile_photo': review.get('profile_photo_url', ''),
                        'relative_time': review.get('relative_time_description', ''),
                        'place_name': place_name,
                        'place_address': place_address,
                        'category': category
                    })
                
                print(f"✓ Successfully fetched {len(formatted_reviews)} reviews")
                print(f"  Place: {place_name}")
                print(f"  Address: {place_address}")
                print(f"  Category: {category}")
                print(f"  Overall Rating: {result.get('rating', 'N/A')}/5")
                print(f"  Total Ratings: {result.get('user_ratings_total', 'N/A')}")

                if len(formatted_reviews) == 0:
                    print("⚠ Google Places returned zero reviews for this Place ID.")
                    place_types_lower = [t.lower() for t in place_types]
                    total_ratings = result.get('user_ratings_total')

                    if any(t in place_types_lower for t in ['street_address', 'route', 'premise', 'plus_code']):
                        print("  This Place ID describes an address or area, which typically has no public reviews.")
                    elif not total_ratings:
                        print("  Google reports no ratings for this listing yet.")
                    else:
                        print("  Some listings hide their reviews from the API due to policy or region settings.")

                    print("  Tip: Use the Place ID Finder to pick the exact business/location that exposes reviews.")
                    print("       https://developers.google.com/maps/documentation/places/web-service/place-id")
                
                return formatted_reviews
            else:
                print(f"Error: {data.get('status')} - {data.get('error_message', 'Unknown error')}")
                return None
        
        except requests.exceptions.RequestException as e:
            print(f"Error fetching reviews: {e}")
            return None
    
    def _determine_category(self, types: List[str]) -> str:
        """Determine category based on Google Places types"""
        types_lower = [t.lower() for t in types]
        
        # Hotel-related types
        hotel_keywords = ['lodging', 'hotel', 'resort', 'motel', 'hostel', 'bed_and_breakfast']
        if any(keyword in ' '.join(types_lower) for keyword in hotel_keywords):
            return 'hotel'
        
        # Restaurant-related types
        restaurant_keywords = ['restaurant', 'food', 'cafe', 'meal_takeaway', 'bakery', 'bar', 'meal_delivery']
        if any(keyword in ' '.join(types_lower) for keyword in restaurant_keywords):
            return 'restaurant'
        
        # Default to product (for stores, shops, etc.)
        return 'product'
    
    def save_to_json(self, data: List[Dict]) -> Optional[str]:
        """Save collected reviews to JSON file"""
        if data is None or len(data) == 0:
            print("No data to save")
            return None
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.output_folder}/google_reviews_{timestamp}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            
            print(f"✓ Reviews saved to {filename}")
            return filename
            
        except Exception as e:
            print(f"Error saving to JSON: {e}")
            return None
    
    def collect_and_save(self) -> Optional[str]:
        """Main function to collect and save reviews"""
        print(f"\n{'='*60}")
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting Google Places review collection...")
        print(f"{'='*60}\n")
        
        reviews = self.fetch_reviews()
        if reviews:
            return self.save_to_json(reviews)
        return None


if __name__ == "__main__":
    # Get API key from environment variable or config
    api_key = os.getenv('GOOGLE_PLACES_API_KEY')
    place_id = os.getenv('GOOGLE_PLACE_ID')
    
    if not api_key:
        print("Error: GOOGLE_PLACES_API_KEY environment variable not set")
        print("Set it with: export GOOGLE_PLACES_API_KEY='your_key_here'")
        exit(1)
    
    if not place_id:
        print("Error: GOOGLE_PLACE_ID environment variable not set")
        print("Set it with: export GOOGLE_PLACE_ID='your_place_id_here'")
        exit(1)
    
    collector = GooglePlacesReviewCollector(api_key, place_id)
    collector.collect_and_save()

