import React, { useState } from 'react';
import { Review } from '../types/review';
import { parseCSVReviews } from '../utils/sentimentAnalysis';
import { parseFormattedReviews } from '../utils/parseFormattedReviews';
import { Upload, FileText, AlertCircle, CheckCircle, FileSpreadsheet, Star } from 'lucide-react';

interface BulkReviewProcessorProps {
  onBulkAdd: (reviews: Review[]) => void;
}

export function BulkReviewProcessor({ onBulkAdd }: BulkReviewProcessorProps) {
  const [bulkText, setBulkText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadMode, setUploadMode] = useState<'text' | 'csv'>('csv');

  // New format sample matching the form structure
  const sampleFormatCSV = `author,location,content,category,rating
John Doe,"New York, NY","Amazing hotel with great service and beautiful views",hotel,5
Jane Smith,"Los Angeles, CA","Food was cold and service was slow",restaurant,2
Mike Davis,"San Francisco, CA","Excellent product quality, highly recommended",product,5`;

  const sampleFormatText = `John Doe,"New York, NY","Amazing hotel with great service and beautiful views",hotel,5
Jane Smith,"Los Angeles, CA","Food was cold and service was slow",restaurant,2
Mike Davis,"San Francisco, CA","Excellent product quality, highly recommended",product,5`;

  const minimalFormat = `"Amazing hotel with great service and beautiful views",hotel,5
"Food was cold and service was slow",restaurant,2
"Excellent product quality, highly recommended",product,5`;

  const handleProcess = async () => {
    if (!bulkText.trim()) return;

    setIsProcessing(true);
    setErrors([]);
    setProcessedCount(0);

    try {
      let processed: Partial<Review>[];
      
      // Use the new formatted parser for both CSV and text
      processed = parseFormattedReviews(bulkText);
      
      if (processed.length === 0) {
        setErrors(['No valid reviews found. Please check the format.']);
        setIsProcessing(false);
        return;
      }

      // Simulate processing delay for better UX
      for (let i = 0; i < processed.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProcessedCount(i + 1);
      }

      const validReviews = processed.filter(r => r.content && r.category) as Review[];
      
      if (validReviews.length > 0) {
        onBulkAdd(validReviews);
        setBulkText('');
      } else {
        setErrors(['No valid reviews could be processed from the input.']);
      }
    } catch (error) {
      setErrors([`Error processing reviews: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the format and try again.`]);
    }

    setIsProcessing(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a CSV file
    if (!file.name.endsWith('.csv') && !file.type.includes('csv') && !file.type.includes('text')) {
      setErrors(['Please upload a CSV file (.csv extension)']);
      return;
    }

    setIsProcessing(true);
    setErrors([]);
    setProcessedCount(0);

    try {
      const fileContent = await file.text();
      setBulkText(fileContent);
      setUploadMode('csv');
      
      // Auto-process using formatted parser
      const processed = parseFormattedReviews(fileContent);
      
      if (processed.length === 0) {
        setErrors(['No valid reviews found in the CSV file. Please check the format.']);
        setIsProcessing(false);
        return;
      }

      // Simulate processing delay for better UX
      for (let i = 0; i < processed.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProcessedCount(i + 1);
      }

      const validReviews = processed.filter(r => r.content && r.category) as Review[];
      
      if (validReviews.length > 0) {
        onBulkAdd(validReviews);
        setBulkText('');
      } else {
        setErrors(['No valid reviews could be processed from the CSV file.']);
      }
    } catch (error) {
      setErrors([`Error reading CSV file: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the file format.`]);
    }

    setIsProcessing(false);
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Upload className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Bulk Review Processing</h3>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setUploadMode('text')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              uploadMode === 'text'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Text Input
          </button>
          <button
            onClick={() => setUploadMode('csv')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              uploadMode === 'csv'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 inline mr-2" />
            CSV File
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {uploadMode === 'csv' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className={`cursor-pointer flex flex-col items-center space-y-2 ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FileSpreadsheet className="w-10 h-10 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Click to upload CSV file
                  </span>
                  <span className="text-xs text-gray-500">
                    or drag and drop here
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Expected format: author,location,content,category,rating
              </p>
            </div>
          ) : null}
          
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {uploadMode === 'csv' ? 'CSV Content (Author, Location, Content, Category, Rating)' : 'Text Data (Same Format)'}
          </label>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={uploadMode === 'csv' 
              ? "Paste CSV data:\nauthor,location,content,category,rating\nJohn Doe,\"New York, NY\",\"Great hotel experience\",hotel,5" 
              : "Paste text data:\nJohn Doe,\"New York, NY\",\"Great hotel experience\",hotel,5\nJane Smith,\"Los Angeles, CA\",\"Good restaurant\",restaurant,4"}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none font-mono text-sm"
          />
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleProcess}
              disabled={!bulkText.trim() || isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing... ({processedCount})</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Process Reviews</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setBulkText('')}
              disabled={isProcessing}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-3">Supported Formats</h4>
            <div className="space-y-3 text-sm">
              <>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Format: Matches Single Review Form</p>
                  <p className="text-xs text-gray-600 mb-2">Full format with header (optional):</p>
                  <code className="text-xs bg-white p-2 rounded block font-mono">
                    author,location,content,category,rating
                  </code>
                  <p className="text-xs text-gray-600 mt-2 mb-2">Minimal format (no header):</p>
                  <code className="text-xs bg-white p-2 rounded block font-mono">
                    content,category,rating
                  </code>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700 mb-1">Full Format Example:</p>
                  <pre className="text-xs bg-white p-3 rounded border font-mono whitespace-pre-wrap overflow-x-auto">
                    {sampleFormatCSV}
                  </pre>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-1 mt-3">Text Format (No Header):</p>
                  <pre className="text-xs bg-white p-3 rounded border font-mono whitespace-pre-wrap overflow-x-auto">
                    {sampleFormatText}
                  </pre>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-1 mt-3">Minimal Format (Content, Category, Rating):</p>
                  <pre className="text-xs bg-white p-3 rounded border font-mono whitespace-pre-wrap overflow-x-auto">
                    {minimalFormat}
                  </pre>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2 text-blue-800">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="font-medium mb-1">Field Details:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li><strong>author</strong>: Reviewer name (optional, defaults to "Reviewer 1", etc.)</li>
                        <li><strong>location</strong>: Location (optional, auto-generated if missing)</li>
                        <li><strong>content</strong>: Review text (required, use quotes if contains commas)</li>
                        <li><strong>category</strong>: hotel, restaurant, or product (required)</li>
                        <li><strong>rating</strong>: 1-5 stars (required)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Processing Errors</span>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {processedCount > 0 && !isProcessing && errors.length === 0 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Successfully processed {processedCount} reviews!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}