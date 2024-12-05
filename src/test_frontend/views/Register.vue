<template>
    <div class="centered">
        <div class="registration-box">
            <form @submit.prevent="register" class="centered">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" v-model="username">
                <label for="username">First Name</label>
                <input type="text" id="firstName" name="firstName" v-model="firstName">
                <label for="username">Last Name</label>
                <input type="text" id="lastName" name="lastName" v-model="lastName">
                <label for="email">Email</label>
                <input type="text" id="email" name="email" v-model="email">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" v-model="password">
                <input type="submit" value="Register">
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
        return ({ username: "", firstName: "", lastName: "", email: "", password: "", state: "initial", retMsg: "" });
    },
    mounted() {
    },
    beforeDestroy() {
    },
    computed: {
        msgText() {
            if (this.state === "error") {
                let msg = "";
                if (!verifyEmail(this.email)) msg += "Please provide a valid email address. ";
                if (!verifyUsername(this.username)) msg += "Please enter a username. ";
                if (!verifyPassword(this.password)) msg += "Please enter a password. ";
                return msg;
            } else if (this.state === "submitted") {
                return this.retMsg;
            }
            return "";


        }
    },
    methods: {
        onSignIn(googleUser) {
            console.log('onsignin')
            console.log(JSON.stringify(googleUser));

            fetch("/api/auth/googletoken",
                { method: "POST", credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: googleUser.credential }) })
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

        },
        register() {
            let v = this.verify({ username: this.username, email: this.email, password: this.password });
            if (!v) {
                this.state = "error";
                return;
            }
            return this.submitPost({ firstName: this.firstName, lastName: this.lastName, username: this.username, email: this.email, password: this.password });

        },
        verify({ username, email, password }) {
            return this.verifyUsername(username) && this.verifyEmail(email) && this.verifyPassword(password);
        },
        verifyUsername(username) {
            return username && username.length;
        },
        verifyEmail(email) {
            return email && /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.exec(email);
        },
        verifyPassword(password) {
            return password && password.length;
        },
        submitPost({ firstName, lastName, username, email, password }) {
            this.state = "submitted";
            this.retMsg = "Registration submitted! Please wait...";
            fetch("/api/auth/register",
                { method: "POST", credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName, lastName, username, email, password }) })
                .then(res => res.json())
                .then(body => this.retMsg = body.message)
                .catch(e => this.retMsg = "Something went wrong! Please try again at an later time.");

        }
    }
}
</script>

<style lang="css">
.centered {
    display: flex;
    justify-content: center;
    align-items: center;
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

form {
    max-width: 50%;
    padding-top: 100px;
}
</style>
