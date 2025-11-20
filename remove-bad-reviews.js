// Quick script to remove the two incorrectly classified reviews
// Copy and paste this entire script into your browser console (F12)

(function() {
  const reviews = JSON.parse(localStorage.getItem('sentiment-analysis-reviews') || '[]');
  const beforeCount = reviews.length;
  
  const filtered = reviews.filter(r => {
    const content = r.content.toLowerCase();
    // Remove: "Product arrived late despite being from a local Bengaluru seller"
    if (content.includes('product arrived late despite')) return false;
    // Remove: "Luxury stay at UB City, loved the skyline view and spa service"
    if (content.includes('luxury stay at ub city')) return false;
    return true;
  });
  
  localStorage.setItem('sentiment-analysis-reviews', JSON.stringify(filtered));
  const removed = beforeCount - filtered.length;
  
  console.log(`✅ Removed ${removed} review(s)`);
  console.log(`📊 ${filtered.length} reviews remaining`);
  
  if (removed > 0) {
    console.log('🔄 Reloading page...');
    setTimeout(() => location.reload(), 500);
  } else {
    console.log('ℹ️ No matching reviews found to remove');
  }
})();


