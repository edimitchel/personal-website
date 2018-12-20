<script>
const getAge = (date) => {
  const birthdate = new Date(date);
  const now = new Date();
  const years = now.getFullYear() - birthdate.getFullYear();
  const isNotPassed =
    birthdate.getMonth() == now.getMonth() &&
    birthdate.getDate() > now.getDate();
  return isNotPassed ? years - 1 : years;
};
export default {
  props: {
    date: {
      type: String,
      required: true
    }
  },
  render(h) {
    return h("span", getAge(this.date));
  }
};
</script>