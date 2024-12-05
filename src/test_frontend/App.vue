<template>
    <div class="app">
        <header class="header">
            <nav class="inner">
                <router-link to="/" exact>
                    <div class="logo" id="header-logo" title="sanguine.moe"></div>
                </router-link>
                <router-link to="/index">Index</router-link>
                <router-link to="/about">About</router-link>
                <router-link v-if="!user || !user.username" class="login" to="/register">Register</router-link>
                <router-link v-if="!user || !user.username" class="login" to="/login">Login</router-link>
                <router-link v-if="user && user.username" class="login" to="/logout">Logout</router-link>
                <router-link v-if="user && user.username" class="login" to="/me">{{ user && user.username
                    }}</router-link>
            </nav>
        </header>
        <div class="app-content">
            <router-view :key="$route.fullPath"></router-view>
        </div>
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
        }
    },
    updated() {
        if (!this.user)
            fetch('/api/user', { method: 'GET', credentials: 'include' }).then(res => res.json()).then(body => this.$store.dispatch('setUser', body));
    }
}
</script>

<style lang="css">
.login {
    float: right;
}

.app {
    height: 100%;
    width: 100%;
    background-color: #141414;
    color: white;
}

.logo {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

#header-logo {
    width: 180px;
    height: 24px;
    vertical-align: middle;
}

.header {
    background-color: #2e2e2e;
    position: fixed;
    z-index: 999;
    height: 55px;
    top: 0;
    left: 0;
    right: 0;
}

.header .inner {
    max-width: 800px;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 15px 5px;
}

.header a,
.header a:visited {
    color: white;
    line-height: 24px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 1.8em;
    text-decoration: none;
}

.header a.router-link-active {
    color: #fff;
    font-weight: 400;
}

.app-content {
    padding-top: 65px;
}
</style>
