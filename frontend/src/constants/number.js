export function decimalCount(number) {
  if (number % 1 !== 0) {
    return number.toString().split(".")[1].length;
  }

  return 0;
}
