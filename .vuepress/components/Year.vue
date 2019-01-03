<script>
import { calculateAge } from "@vpress/utils";

export default {
  props: {
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    age() {
      return calculateAge(this.date);
    }
  },
  render(h) {
    return h("span", this.age);
  }
};
</script>