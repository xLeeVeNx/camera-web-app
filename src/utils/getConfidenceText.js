export const getConfidenceText = (confidence) => {
  confidence = Number(confidence);

  if (confidence < 0.5) {
    return 'Low';
  }

  if (confidence >= 0.5 && confidence <= 0.8) {
    return 'Medium';
  }

  return 'High';
};
