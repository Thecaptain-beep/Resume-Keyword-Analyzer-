/**
 * Text Processing and Keyword Extraction Engine
 */

const { KEYWORD_DICTIONARY } = require('./keywordDictionary');

// Common English stopwords to filter out noise
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
  'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they',
  'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Clean and normalize raw text for keyword search
 * Preserves dots and symbols essential for technical terms (+, #, ., -)
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .replace(/[\r\n\t]+/g, ' ')
    // Replace sentence punctuation (commas, colons, semicolons, quotes, brackets, exclamation, etc.)
    .replace(/[,;:!?()[\]{}"'`~]/g, ' ')
    // Replace periods that occur at sentence ends or word boundaries
    .replace(/\.(?=\s|$)/g, ' ')
    // Clean rogue punctuation except tech characters (+, #, ., -, /)
    .replace(/[^\w\s\+\#\.\-\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Escape string for RegExp
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extract matched keywords from raw text against the keyword dictionary
 * Supports multi-word matching, alias matching, and normalization
 */
function extractKeywords(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  const normalized = ` ${normalizeText(rawText)} `;
  const matchedKeywordsMap = new Map();

  for (const item of KEYWORD_DICTIONARY) {
    const canonicalName = item.name;
    let isMatched = false;

    // Check canonical name and all alias variations
    const candidates = [canonicalName.toLowerCase(), ...(item.aliases || [])];

    for (const candidate of candidates) {
      const trimmedCandidate = candidate.trim().toLowerCase();
      if (!trimmedCandidate) continue;

      // Safe boundary matching pattern
      const escaped = escapeRegExp(trimmedCandidate);
      const pattern = new RegExp(`(^|[^a-zA-Z0-9_#\\+])${escaped}([^a-zA-Z0-9_#\\+]|$)`, 'i');

      if (pattern.test(normalized)) {
        isMatched = true;
        break;
      }
    }

    if (isMatched) {
      matchedKeywordsMap.set(canonicalName, {
        keyword: canonicalName,
        category: item.category,
        importance: item.importance
      });
    }
  }

  return Array.from(matchedKeywordsMap.values());
}

/**
 * Filter non-stop words token list (useful for stats and frequency)
 */
function tokenizeWords(rawText) {
  const normalized = normalizeText(rawText);
  return normalized
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

module.exports = {
  normalizeText,
  extractKeywords,
  tokenizeWords,
  STOP_WORDS
};
