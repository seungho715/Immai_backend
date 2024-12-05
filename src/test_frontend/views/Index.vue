<template>
    <div class="centered">
        <div class="logo" title="immai.experiments.moe"></div>
        <div class="text">{{ text }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return ({ date: new Date(), timer: null });
    },
    mounted() {
        window.setTimeout(this.updateDate, 500);
    },
    beforeDestroy() {
        clearTimer(this.timer);
    },
    computed: {
        text() {
            return "It is " + this.date.toLocaleString() + " right now.";
        }
    },
    methods: {
        updateDate() {
            this.date = new Date();
            this.timer = window.setTimeout(this.updateDate, 100);
        }
    }
}
</script>

<style lang="css">
.centered {
    display: flex;
    justify-content: center;
    flex-direction: column;
    max-width: 80%;
}

.logo {
    height: 200px;
    width: 100%;
    margin: 0 auto;
}

.text {
    margin: 0 auto;
}
</style>
