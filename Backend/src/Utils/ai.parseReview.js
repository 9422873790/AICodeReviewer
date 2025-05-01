

function extractRating(label, text) {
    const regex = new RegExp(`${label}:\\s*(\\d+)/10`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : null;
  }
  
  function parseReview(text) {
    return {
      reviewText: text,
      ratings: {
        overall: extractRating("Overall Code Score", text),
        complexity: extractRating("Code Complexity", text),
        readability: extractRating("Readability & Naming Conventions", text),
        performance: extractRating("Performance Score", text),
        reusability: extractRating("Code Reusability", text)
      }
    };
  }
  
  module.exports = parseReview;
  