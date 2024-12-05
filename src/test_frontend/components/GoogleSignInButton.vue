<template>
<GoogleLogin :callback="onSignIn"/>
</template>
<script setup>
import { useRouter } from 'vue-router';


const router = useRouter();
function onSignIn(response) {
    fetch('/api/auth/googletoken',
        { method: "POST", credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: response.credential }) })
        .then((res) => res.json())
        .then((body) => {
            if (body.status === 200) {
                router.push('/')
            } else {
                throw body.message;
            }
        })
        .catch((err) => {
            console.log(err);
            alert(JSON.stringify(err))
            router.push('/');
        });
}
</script>
<style>
</style>