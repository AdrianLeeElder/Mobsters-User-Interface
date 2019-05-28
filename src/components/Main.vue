<template>
    <div id="main">
       <router-view/>
    </div>
</template>

<script>
import Accounts from "./Accounts.vue"

export default {
    name: "Main",
    data() {
        return {

        }
    },
    components: {
        Accounts
    }
}
</script>

<style>
#main {
    background-color: #f2f2f2;
}
</style>

