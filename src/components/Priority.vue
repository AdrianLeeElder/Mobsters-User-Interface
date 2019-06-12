<template>
    <p>{{getPriority}}</p>
</template>

<script>
export default {
  props: {
    name: "Priority",
    value: Number
  },
  data() {
    return {};
  },
  computed: {
    getPriority() {
      switch (this.value) {
        case 0:
          return "Low";
        case 1:
          return "Normal";
        case 2:
          return "High";
      }
    }
  }
};
</script>

