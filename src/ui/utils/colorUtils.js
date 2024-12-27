export const getHealthColor = (percentage) => {
  if (percentage > 60) return '#2ecc71'; // Green
  if (percentage > 30) return '#f1c40f'; // Yellow
  return '#e74c3c'; // Red
};

export const getExpColor = (percentage) => {
  return `hsl(215, 80%, ${50 + percentage * 0.2}%)`; // Dynamic blue shade
};