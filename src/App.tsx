import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ReviewsList } from './components/ReviewsList';
import { AddReviewForm } from './components/AddReviewForm';
import { Analytics } from './components/Analytics';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { mockReviews } from './data/mockReviews';
import { Review } from './types/review';
import { 
  loadReviewsFromStorage, 
  saveReviewsToStorage, 
  addReviewToStorage, 
  addReviewsToStorage,
  removeReviewFromStorage
} from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reviews from LocalStorage on startup
  useEffect(() => {
    const loadSavedReviews = () => {
      const savedReviews = loadReviewsFromStorage();
      
      if (savedReviews.length > 0) {
        // Use saved reviews if they exist
        setReviews(savedReviews);
      } else {
        // First time: initialize with mock reviews and save them
        const initialReviews = [...mockReviews];
        setReviews(initialReviews);
        saveReviewsToStorage(initialReviews);
      }
      setIsLoading(false);
    };

    loadSavedReviews();
  }, []);

  // Optional: Load CSV files from data directory on startup
  // To enable automatic CSV loading, uncomment the code below:
  /*
  import { useEffect } from 'react';
  import { loadCSVFromFile } from './utils/loadCSVReviews';
  
  useEffect(() => {
    const loadCSVFiles = async () => {
      try {
        // Import CSV file using Vite's ?raw import
        // import reviewsCSV from './data/reviews.csv?raw';
        // const csvReviews = await loadCSVFromFile(reviewsCSV);
        // if (csvReviews.length > 0) {
        //   setReviews(prev => [...csvReviews, ...prev]);
        // }
      } catch (error) {
        console.error('Error loading CSV files:', error);
      }
    };
    loadCSVFiles();
  }, []);
  */

  const handleAddReview = (newReview: Review) => {
    setReviews(prev => {
      const updated = [newReview, ...prev];
      // Save to LocalStorage for persistence
      addReviewToStorage(newReview);
      return updated;
    });
    setActiveTab('reviews');
  };

  const handleBulkAdd = (newReviews: Review[]) => {
    setReviews(prev => {
      const updated = [...newReviews, ...prev];
      // Save to LocalStorage for persistence
      addReviewsToStorage(newReviews);
      return updated;
    });
    setActiveTab('reviews');
  };

  const handleDeleteReview = (reviewId: string) => {
    // Remove from LocalStorage
    const removed = removeReviewFromStorage(reviewId);
    if (removed) {
      // Update state
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'reviews':
        return <ReviewsList reviews={reviews} onDeleteReview={handleDeleteReview} />;
      case 'add-review':
        return <AddReviewForm onAddReview={handleAddReview} onBulkAdd={handleBulkAdd} />;
      case 'analytics':
        return <Analytics reviews={reviews} />;
      case 'advanced':
        return <AdvancedAnalytics reviews={reviews} />;
      default:
        return <ReviewsList reviews={reviews} />;
    }
  };

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-12">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;