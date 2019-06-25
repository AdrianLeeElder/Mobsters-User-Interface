<template>
    <div>
        <h3>Actions</h3>
        <!-- <el-table :data="actions" stripe border>
            <el-table-column label="Status" width="75">
                <template slot-scope="scope">
                    <Status :status="scope.row.status"></Status>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
        </el-table> -->
        <v-data-table :headers="headers" :items="actions" class="elevation-1 ma-4" hide-actions>
            <template v-slot:items="props">
                <td style="width: 10%">
                    <Status :status="props.item.status"></Status>
                </td>
                <td>
                    {{props.item.name}}
                </td>
            </template>
        </v-data-table>
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
    return {
      headers: [
        { text: "Status", value: "status", sortable: false },
        { text: "Name", value: "name", sortable: false }
      ]
    };
  },
  components: {
    Status
  }
};
</script>

