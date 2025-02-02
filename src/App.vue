<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import Dropdown from './components/Dropdown/Dropdown.vue'
import { ref } from 'vue'

const languages = [
    { label: 'Russian', value: 'russian' },
    { label: 'English', value: 'english' },
    { label: 'Italian', value: 'italian' },
    { label: 'German', value: 'german' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
]
const language = ref(languages[0])
</script>

<template>
    <header>
        <h1 class="green">amoCRM deals. For <span class="bold">you</span>. <i>Now</i>.</h1>
        <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

        <div class="wrapper">
            <HelloWorld msg="You did it!" />
        </div> -->
    </header>

    <main>
        <!-- <TheWelcome /> -->

        <button>test</button>
        <Dropdown label="Language" v-model:active="language" :items="languages" :mah="120" />
        <button>test</button>
    </main>
</template>

<style scoped>
header {
    line-height: 1.5;
    font-size: var(--font-size-xl);
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .dropdown {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
