<template>
    <div>
        <h1>Actions</h1>
        <el-table :data="actions" stripe border>
            <el-table-column label="Status" width="75">
                <template slot-scope="scope">
                    <Status :status="scope.row.status"></Status>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import Status from "./Status.vue";
export default {
  props: {
    name: "Actions",
    actions: Array
  },
  data() {
    return {};
  },
  components: {
    Status
  }
};
</script>

