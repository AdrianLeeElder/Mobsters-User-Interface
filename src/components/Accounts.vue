<template>
   <div>
        <el-table :data="mobsters" v-loading="loading" class="mb-4">
            <el-table-column type="expand">
                <template slot-scope="props">
                    Actions
                </template>
            </el-table-column>
            <el-table-column label="Username" prop="username">
            
            </el-table-column>
        </el-table>
        <el-pagination
        class="mt-3" 
        background
        layout="prev, pager, next"
        :page-count="totalPages"
        :current-page.sync="pageNumber"
        @current-change="loadMobsters">
            
        </el-pagination>
   </div>
</template>

<script>
import api from "@/api.js"

export default {
    name: "Accounts",
    data() {
        return {
            mobsters: [],
            totalPages: 0,
            pageNumber: 1,
            loading: false
        }
    },
    methods: {
        async loadMobsters() {
            this.loading = true;
            this.mobsters = await api.getMobsters(this.pageNumber - 1)
            this.loading = false;
        },
        async setTotalPages() {
            this.loading = true;
            this.totalPages = await api.getTotalMobsterPages();
            this.loading = false;
        }
    },
    created() {
        this.setTotalPages();
        this.loadMobsters();
    }
}
</script>

