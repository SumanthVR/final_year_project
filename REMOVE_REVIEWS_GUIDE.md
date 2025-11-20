# How to Remove Incorrectly Classified Reviews

## Quick Method: Browser Console

Open your browser's Developer Console (F12) and run these commands:

### Remove Specific Reviews by Content

```javascript
// Remove the "arrived late" review
const reviews = JSON.parse(localStorage.getItem('sentiment-analysis-reviews') || '[]');
const filtered = reviews.filter(r => !r.content.includes('Product arrived late despite'));
localStorage.setItem('sentiment-analysis-reviews', JSON.stringify(filtered));
console.log('Removed 1 review');
location.reload(); // Refresh to see changes

// Remove the "Luxury stay" review
const reviews2 = JSON.parse(localStorage.getItem('sentiment-analysis-reviews') || '[]');
const filtered2 = reviews2.filter(r => !r.content.includes('Luxury stay at UB City'));
localStorage.setItem('sentiment-analysis-reviews', JSON.stringify(filtered2));
console.log('Removed 1 review');
location.reload(); // Refresh to see changes
```

### Remove Both at Once

```javascript
const reviews = JSON.parse(localStorage.getItem('sentiment-analysis-reviews') || '[]');
const filtered = reviews.filter(r => 
  !r.content.includes('Product arrived late despite') && 
  !r.content.includes('Luxury stay at UB City')
);
localStorage.setItem('sentiment-analysis-reviews', JSON.stringify(filtered));
console.log(`Removed ${reviews.length - filtered.length} reviews`);
location.reload();
```

### Remove All Misclassified Reviews (Neutral with extreme ratings)

```javascript
const reviews = JSON.parse(localStorage.getItem('sentiment-analysis-reviews') || '[]');
const filtered = reviews.filter(r => {
  // Keep reviews that are NOT neutral with extreme ratings
  if (r.sentiment === 'neutral') {
    // Remove neutral reviews with rating 5 (should be positive)
    if (r.rating >= 4 && Math.abs(r.sentimentScore || 0) < 0.1) {
      return false;
    }
    // Remove neutral reviews with rating 1-2 (should be negative)
    if (r.rating <= 2 && Math.abs(r.sentimentScore || 0) < 0.1) {
      return false;
    }
  }
  return true;
});
localStorage.setItem('sentiment-analysis-reviews', JSON.stringify(filtered));
console.log(`Removed ${reviews.length - filtered.length} misclassified reviews`);
location.reload();
```

## What Was Fixed

✅ **Added "loved", "luxury", "luxurious"** to positive lexicon  
✅ **Added "loved the", "luxury stay"** as positive phrases  
✅ **Improved phrase detection** for multi-word expressions  
✅ **Added "despite being"** as negative phrase indicator  
✅ **Lowered classification threshold** to catch more reviews

## After Removal

Once you remove the incorrect reviews:
1. **Re-upload them** through the CSV import or manual form
2. They will be **correctly classified** with the updated sentiment analysis
3. The "arrived late" review will show as **Negative**
4. The "Luxury stay" review will show as **Positive**

## Verification

After removal, you can verify by checking:
```javascript
const reviews = JSON.parse(localStorage.getItem('sentiment-analysis-reviews') || '[]');
console.log(`Total reviews: ${reviews.length}`);
console.log('Reviews:', reviews.map(r => ({ content: r.content.substring(0, 50), sentiment: r.sentiment, rating: r.rating })));
```


