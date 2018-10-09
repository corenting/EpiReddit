export default function getSumOfProperty(array, propertyName) {
  let computedScore = 0;
  if (typeof (array) !== 'undefined' && array.length !== 0) {
    computedScore = array.map(item => item[propertyName]).reduce((prev, next) => prev + next);
  }

  return computedScore;
}
