// Smart keyword-based category classification
const categoryKeywords = {
  'Road Damage': [
    'pothole', 'crack', 'pavement', 'asphalt', 'road', 'street damage', 
    'broken road', 'damaged road', 'road repair', 'street repair',
    'hole in road', 'road condition', 'bumpy road', 'uneven road'
  ],
  'Street Lighting': [
    'light', 'lamp', 'streetlight', 'lighting', 'dark', 'bulb',
    'street lamp', 'broken light', 'no light', 'dim light',
    'flickering', 'electricity', 'illumination', 'night visibility'
  ],
  'Garbage/Waste': [
    'garbage', 'trash', 'waste', 'litter', 'dump', 'dirty',
    'rubbish', 'refuse', 'plastic', 'smell', 'odor', 'sanitation',
    'bin', 'dumpster', 'waste management', 'collection', 'disposal'
  ],
  'Drainage/Flooding': [
    'flood', 'water', 'drain', 'clog', 'overflow', 'puddle',
    'drainage', 'sewage', 'waterlog', 'rain', 'canal', 'gutter',
    'storm drain', 'blocked drain', 'water accumulation', 'stagnant water'
  ],
  'Illegal Activity': [
    'illegal', 'crime', 'theft', 'robbery', 'drugs', 'suspicious',
    'trespassing', 'vandalism', 'harassment', 'loitering', 'gambling',
    'illegal parking', 'squatting', 'unlawful', 'criminal activity'
  ],
  'Public Safety': [
    'safety', 'danger', 'hazard', 'accident', 'emergency', 'risk',
    'unsafe', 'injury', 'fallen tree', 'obstruction', 'blocked path',
    'traffic', 'pedestrian', 'crosswalk', 'sign', 'warning', 'security'
  ],
  'Infrastructure': [
    'building', 'structure', 'bridge', 'sidewalk', 'fence', 'wall',
    'facility', 'public property', 'park', 'playground', 'bench',
    'pathway', 'construction', 'maintenance', 'repair needed', 'damaged property'
  ]
};

/**
 * Automatically classify report category based on title and description keywords
 * @param {string} title - Report title
 * @param {string} description - Report description
 * @param {string} providedCategory - Category provided by user (optional)
 * @returns {string} - Best matching category or 'Other' if no match
 */
exports.classifyCategory = (title, description, providedCategory) => {
  // If user provided a valid category, use it
  if (providedCategory && providedCategory !== 'Other') {
    return providedCategory;
  }

  // Combine title and description for analysis
  const text = `${title} ${description}`.toLowerCase();

  // Score each category based on keyword matches
  const scores = {};
  let maxScore = 0;
  let bestCategory = 'Other';

  Object.keys(categoryKeywords).forEach(category => {
    scores[category] = 0;
    
    categoryKeywords[category].forEach(keyword => {
      // Check for exact word matches (with word boundaries)
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
      const matches = text.match(regex);
      
      if (matches) {
        // Weight longer keywords more heavily
        const weight = keyword.split(' ').length;
        scores[category] += matches.length * weight;
      }
    });

    // Track the category with highest score
    if (scores[category] > maxScore) {
      maxScore = scores[category];
      bestCategory = category;
    }
  });

  // Return best match if confidence is high enough (at least 1 keyword match)
  return maxScore > 0 ? bestCategory : (providedCategory || 'Other');
};

/**
 * Get suggested categories based on text analysis
 * @param {string} text - Text to analyze
 * @param {number} limit - Number of suggestions to return
 * @returns {Array} - Array of suggested categories with confidence scores
 */
exports.getSuggestedCategories = (text, limit = 3) => {
  const lowercaseText = text.toLowerCase();
  const suggestions = [];

  Object.keys(categoryKeywords).forEach(category => {
    let score = 0;
    const matchedKeywords = [];

    categoryKeywords[category].forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
      const matches = lowercaseText.match(regex);
      
      if (matches) {
        const weight = keyword.split(' ').length;
        score += matches.length * weight;
        matchedKeywords.push(keyword);
      }
    });

    if (score > 0) {
      suggestions.push({
        category,
        confidence: Math.min(score * 10, 100), // Convert to percentage (capped at 100)
        matchedKeywords: matchedKeywords.slice(0, 3) // Top 3 matched keywords
      });
    }
  });

  // Sort by confidence and return top suggestions
  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
};

module.exports = exports;
