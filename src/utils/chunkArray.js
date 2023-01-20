export function chunkArray(myArray, chunkSize) {
  let index = 0;
  const arrayLength = myArray.length;
  const tempArray = [];

  for (index; index < arrayLength; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
}
