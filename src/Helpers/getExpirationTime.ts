export default function getExpirationDateByDays(num: number) {
  return new Date(new Date().setDate(new Date().getDate() + num));
}
