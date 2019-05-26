<template>
    <div id="main">
        <Accounts />
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

