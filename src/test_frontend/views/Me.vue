<template>
    <div class="centered">
        <div v-if="user" class="text">{{ text }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return ({});
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        text() {
            return this.user ? `username: ${this.user.username}, email: ${this.user.email}` : 'Not logged in!';
        }
    },
    beforeDestroy() {
        clearTimer(this.timer);
    },
    methods: {
    }
}
</script>

<style lang="css"></style>
