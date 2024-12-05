<template>
    <div class="about-content">
        <h1 class="about-title">About</h1>
        <div class="text">{{ text }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return ({
            text:
                `Test frontend designed to interface with backend.`
        });
    },
}
</script>

<style lang="css">
.about-content {
    padding-left: 20px;
}

.about-title {
    color: white;
}

.text {
    color: white;
}
</style>
