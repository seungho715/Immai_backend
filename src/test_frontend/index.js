import * as Vue from 'vue';
import * as Router from 'vue-router';
import { createStore } from 'vuex';
import vue3GoogleLogin from 'vue3-google-login'

import App from './App.vue';
import Index from './views/Index.vue';
import About from './views/About.vue';
import Register from './views/Register.vue';
import Login from './views/Login.vue';
import Me from './views/Me.vue';

const routes = [
    { path: '/', redirect: '/index' },
    { path: '/index', component: Index },
    { path: '/about', component: About },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/me', component: Me },
    { path: '/logout', component: { template: '' }, beforeEnter() { fetch('https://immai.experiments.moe/api/auth/logout') } },
];

const store = createStore({
    state() {
        user: null
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        }
    },
    actions: {
        setUser(context, user) {
            context.commit('setUser', user);
        }
    }
});

const router = Router.createRouter({
    history: Router.createWebHashHistory(),
    routes,
});

const app = Vue.createApp({});

app.component('app', App);

app.use(vue3GoogleLogin, {
    clientId: '193811489299-sanda1deflvs6hb966l5cuktrvv7d77s.apps.googleusercontent.com'
  })
app.use(router);
app.use(store);

app.mount('#app');

