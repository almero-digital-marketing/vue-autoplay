<template>
    <div class="home">
        <AutoplayAnimation src="https://storage.whitebox.pro/cache/almero.com/mikser/storage/animations/elfi.7c0ffc62-b869-490f-8ad6-3e81b8f36059.json" :enabled="true" :loop="false" @progress="onProgress"></AutoplayAnimation>  
        <div v-for="placeholder in placeholders" class="placeholder" :key="placeholder">{{ placeholder }}</div>
        <ScrollTrigger name="trigger" :enabled="true" :markers="true" :scrub="true" start="top bottom" end="bottom center">
            <div class="trigger">
            </div>
        </ScrollTrigger>
    </div>
</template>
<script setup>
import {ref} from 'vue'
const placeholders = ref(['placeholder-0'])
// let count = 0
// setInterval(() => placeholders.value.push(`placeholder-${++count}`), 3000)

function onProgress({ percent }) {
	console.log('Animation percent:', percent)
}

</script>
<style scoped>
.trigger {
    margin-top: 100vh;
    border: 1px solid yellow;
}
.active-trigger .trigger {
    border: 1px solid black;
}
.placeholder {
    height: 100px;
}
</style>