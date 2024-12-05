<template>
    <div class="centered">
        <div class="login-box">
            <form @submit.prevent="login" class="centered">
                <label for="email">Username or Email</label>
                <input type="text" id="email" name="email" v-model="email">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" v-model="password">
                <input type="submit" value="Login">
            </form>
            <div id="msg"> {{ msgText }} </div>
        </div>
        <div class="google-stuff">
            <GoogleSignInButton />
        </div>
    </div>
</template>

<script>
import GoogleSignInButton from '../components/GoogleSignInButton.vue';

export default {
    components: {
        GoogleSignInButton
    },
    data() {
        return ({ username: "", email: "", emailMsg: "", password: "", state: "initial", retMsg: "" });
    },
    mounted() {
    },
    beforeDestroy() {
    },
    computed: {
        msgText() {
            if (this.state === "error") {
                return "";
            } else if (this.state === "submitted") {
                return this.retMsg;
            }
            return "";


        }
    },
    methods: {
        login() {
            return this.loginPost({ username: this.email, password: this.password });
        },
        loginPost({ username, password }) {
            this.state = "submitted";
            this.retMsg = "Logging in, please wait...";
            fetch("/api/auth/login",
                { method: "POST", credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
                .then(res => res.json())
                .then(body => {
                    if (body.status === 200) {
                        this.$store.dispatch('setUser', body.user);
                        this.$router.push('/');
                    } else {
                        this.retMsg = body.message;
                    }
                })
                .catch(e => this.retMsg = "Something went wrong! Please try again at an later time.");

        }
    }
}
</script>

<style lang="css">
.centered {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
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

form {
    max-width: 50%;
    padding-top: 100px;
}
</style>
