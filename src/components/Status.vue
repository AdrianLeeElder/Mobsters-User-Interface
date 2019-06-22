<template>
    <div>
        <font-awesome-icon v-if="getClass(this.status).length > 0" :icon="getClass(this.status)" />
    </div>
</template>

<script>
import { getIcon, Status} from "@/statuses";

export default {
  props: {
    name: "Status",
    status: String
  },
  data() {
    return {
      
    };
  },
  methods: {
    getClass(status) {
        return getIcon(status)
    },
  }
};
</script>
