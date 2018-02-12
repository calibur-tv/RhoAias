export default {
  shortenNumber (num) {
    return num > 1000 ? `${Math.floor((num / 1000) * 10) / 10}k` : num
  }
}
