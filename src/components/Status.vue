<template>
    <div>
        <i :class="getClass()"></i>
    </div>
</template>

<script>
export default {
    props: {
        name: "Status",
        status: String
    },
    data() {
        return {

        }
    },
    methods: {
        getClass() {
            switch (this.status) {
                case "idle":
                return "";
                case "queued":
                    return ""
                break;
                case "running":
                return "el-icon-loading";
                case "complete":
                return "el-icon-success"
            }
        }
    }
}
</script>
