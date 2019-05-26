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
import axios from "axios"

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
        loadMobsters() {
            this.loading = true;
            axios.get("/api/v1/mobsters?&pageNumber=" + (this.pageNumber - 1)).then((response) => {
                 this.mobsters = response.data
                 this.loading = false;
            })
        },
        setTotalPages() {
            this.loading = true;
            axios.get("/api/v1/mobsters/total-pages").then((response) => {
                 this.totalPages = response.data
                 this.loading = false;
            })
        }
    },
    created() {
        this.setTotalPages();
        this.loadMobsters();
    }
}
</script>

