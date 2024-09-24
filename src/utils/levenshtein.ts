function levenshteinDistance(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  if (aLen === 0) {
    return bLen;
  }
  if (bLen === 0) {
    return aLen;
  }

  // Initialize the matrix
  const matrix: number[][] = Array.from({length: aLen + 1}, () =>
    Array(bLen + 1).fill(0),
  );

  // Fill the base case values
  for (let i = 0; i <= aLen; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= bLen; j++) {
    matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost, // Substitution
      );
    }
  }

  return matrix[aLen][bLen];
}

// Function to calculate the percentage of changed characters based on Levenshtein distance
function percentageChanged(prev: string, next: string): number {
  const editDistance = levenshteinDistance(prev, next);
  const longerLen = Math.max(prev.length, next.length);
  const percentage = (editDistance / longerLen) * 100;
  return percentage;
}

// Function to check if at least 20% of the characters have changed
export function checkIfAtLeast20PercentChange(
  prev: string,
  next: string,
): boolean {
  const percentChanged = percentageChanged(prev, next);
  return percentChanged >= 20;
}
