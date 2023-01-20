export const getNumericConfidence = (conf) => {
  return conf === 0
    ? 'Поле на документе отсутствует'
    : Math.round(conf * 1000) / 1000
}
