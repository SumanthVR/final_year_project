# Pros and Cons Classification System

## 📋 Overview

The system uses a **rule-based sentiment analysis** approach to classify pros and cons from review text. It analyzes each sentence individually and classifies them based on sentiment strength and confidence.

## 🔍 How It Works

### Step 1: Sentence Splitting
```typescript
const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
```
- Splits review text into sentences by periods (.), exclamation marks (!), and question marks (?)
- Filters out sentences shorter than 20 characters

### Step 2: Sentiment Analysis per Sentence
For each sentence, the system analyzes its sentiment using:

**Sentiment Lexicon** - A predefined dictionary of positive and negative words:

**Positive Words:**
- **Strong**: amazing, fantastic, excellent, outstanding, perfect, exceptional, superb, magnificent, brilliant, divine, incredible, wonderful, spectacular, flawless, phenomenal
- **Moderate**: good, great, nice, pleasant, enjoyable, solid, decent, satisfactory, adequate, fine, helpful, friendly, clean, comfortable, impressive, delicious
- **Weak**: okay, acceptable, reasonable, fair, tolerable, alright

**Negative Words:**
- **Strong**: terrible, awful, horrible, disgusting, appalling, atrocious, dreadful, abysmal, catastrophic, unacceptable, deplorable, horrendous, disastrous
- **Moderate**: bad, poor, disappointing, unsatisfactory, mediocre, subpar, inadequate, inferior, deficient, lacking, slow, cold, overpriced
- **Weak**: meh, bland, boring, ordinary, unremarkable, dated

### Step 3: Context Awareness

The system considers:
1. **Negation words**: not, never, no, barely, hardly, without
   - Example: "not good" → flips sentiment to negative

2. **Intensifiers**: very, extremely, incredibly, absolutely, completely, totally
   - Example: "very good" → stronger positive score (multiplied by 1.5)

### Step 4: Scoring System

Each word contributes to a sentiment score:
- Strong positive words: +3 points
- Moderate positive words: +2 points
- Weak positive words: +1 point
- Strong negative words: -3 points
- Moderate negative words: -2 points
- Weak negative words: -1 point

The score is then normalized based on the number of sentiment words found.

### Step 5: Classification Rules

A sentence becomes a **PRO** if:
```typescript
sentiment === 'positive' && 
score > 0.25 && 
confidence > 0.5
```

A sentence becomes a **CON** if:
```typescript
sentiment === 'negative' && 
score < -0.25 && 
confidence > 0.5
```

### Step 6: Limiting Results
- Maximum of 8 pros extracted
- Maximum of 8 cons extracted

## 📊 Classification Criteria

| Criterion | Threshold | Purpose |
|-----------|-----------|---------|
| **Sentence Length** | ≥ 20 characters | Filter out fragments |
| **Pro Score** | > 0.25 | Only strong positives |
| **Con Score** | < -0.25 | Only strong negatives |
| **Confidence** | > 0.5 | Ensure reliable classification |

## 💡 Example Classification

### Example Review:
> "The hotel was amazing with excellent service. The staff was friendly and helpful. However, the elevator was slow and the WiFi didn't work well."

### Classification Process:

1. **Sentence 1**: "The hotel was amazing with excellent service"
   - Sentiment: POSITIVE
   - Score: 0.85 (contains "amazing" = +3, "excellent" = +3)
   - Confidence: 0.92
   - **Result**: ✅ PRO

2. **Sentence 2**: "The staff was friendly and helpful"
   - Sentiment: POSITIVE
   - Score: 0.65 (contains "friendly" = +2, "helpful" = +2)
   - Confidence: 0.88
   - **Result**: ✅ PRO

3. **Sentence 3**: "However, the elevator was slow"
   - Sentiment: NEGATIVE
   - Score: -0.45 (contains "slow" = -2)
   - Confidence: 0.72
   - **Result**: ✅ CON

4. **Sentence 4**: "the WiFi didn't work well"
   - Sentiment: NEGATIVE
   - Score: -0.35 (negation + "work" = negative)
   - Confidence: 0.68
   - **Result**: ✅ CON

### Final Output:
- **Pros**: 
  - "The hotel was amazing with excellent service"
  - "The staff was friendly and helpful"
- **Cons**:
  - "However, the elevator was slow"
  - "the WiFi didn't work well"

## 🎯 Key Features

### Strengths:
✅ **Sentence-level analysis** - More granular than document-level  
✅ **Context awareness** - Handles negation and intensifiers  
✅ **Confidence scoring** - Filters unreliable classifications  
✅ **Category-specific** - Uses business-specific terms when available  

### Limitations:
⚠️ **Rule-based** - Not machine learning, may miss nuanced sentiment  
⚠️ **Language-dependent** - Works best with English text  
⚠️ **Word-based matching** - May miss context or idioms  
⚠️ **Limited lexicon** - Doesn't include all possible words  

## 🔧 Technical Details

**Function Location**: `src/utils/sentimentAnalysis.ts`  
**Function Name**: `extractProsAndCons(text: string)`  
**Called From**: 
- `processBulkReviews()` - For bulk text input
- `parseCSVReviews()` - For CSV imports
- `AddReviewForm` component - For single reviews

**Dependencies**:
- `analyzeSentiment()` - Core sentiment analysis function
- `sentimentLexicon` - Word dictionary
- `emotionKeywords` - Emotion detection (used elsewhere)

## 🚀 Improving Classification

To improve the classification accuracy, you could:
1. **Expand the lexicon** - Add more positive/negative words
2. **Adjust thresholds** - Modify score thresholds (0.25, -0.25)
3. **Improve negation handling** - Add more negation patterns
4. **Add ML model** - Replace with trained ML model for better accuracy
5. **Category-specific lexicons** - Use different words for hotels vs restaurants

## 📝 Business-Specific Terms

The system includes category-specific positive/negative terms:

**Hotel Terms:**
- Positive: spacious, luxurious, view, amenities, location, concierge, spa, pool, breakfast, comfortable bed
- Negative: noise, dirty, small, outdated, broken, maintenance, overbooked, rude staff

**Restaurant Terms:**
- Positive: delicious, fresh, flavorful, authentic, creative, presentation, atmosphere, wine selection
- Negative: cold food, slow service, overcooked, bland, stale, waiting time, rude waiter

These terms help improve accuracy for domain-specific reviews.


