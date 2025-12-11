// Map journal categories to their corresponding colors
export const JOURNAL_CATEGORY_COLORS: Record<string, string> = {
  // Medical specialties
  'cardiology': '#C62828', // Red
  'neurology': '#1565C0', // Blue
  'oncology': '#2E7D32', // Green
  'endocrinology': '#F9A825', // Yellow
  'psychiatry': '#6A1B9A', // Purple
  'dermatology': '#455A64', // Grey
  'radiology': '#00897B', // Teal
  'pediatrics': '#E91E63', // Pink
  'surgery': '#D32F2F', // Deep Red
  'orthopedics': '#F57C00', // Orange
  'ophthalmology': '#00ACC1', // Cyan
  'gastroenterology': '#7CB342', // Light Green
  
  // Sciences
  'biology': '#2E7D32', // Green
  'chemistry': '#1565C0', // Blue
  'physics': '#6A1B9A', // Purple
  'mathematics': '#F9A825', // Yellow
  'engineering': '#455A64', // Grey
  'computer-science': '#00897B', // Teal
  'environmental': '#7CB342', // Light Green
  
  // Default fallback
  'default': '#C62828' // Red
};

/**
 * Get color for a journal based on its key
 * The key should be in lowercase and hyphenated format (e.g., 'cardiology', 'computer-science')
 */
export const getJournalColor = (journalKey: string): string => {
  const normalizedKey = journalKey.toLowerCase().trim();
  return JOURNAL_CATEGORY_COLORS[normalizedKey] || JOURNAL_CATEGORY_COLORS['default'];
};
