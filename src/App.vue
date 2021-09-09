<script setup>
import AutoplayAnimation from './components/AutoplayAnimation.vue'
import AutoplayVideo from './components/AutoplayVideo.vue'
import { ref } from 'vue'

const animationEnabled = ref(false)
const animationLoop = ref(false)
const animationRepeat = ref(false)
const videoEnabled = ref(false)
const videoLoop = ref(false)
</script>

<template>
	<h1>Animation</h1>
	<button @click="animationLoop = !animationLoop">Loop {{animationLoop}}</button>&nbsp;
	<button @click="animationEnabled = !animationEnabled">Enabled {{animationEnabled}}</button>&nbsp;
	<button @click="animationRepeat = !animationRepeat">Repeat {{animationRepeat}}</button><br><br>
	<div class="autoplay" @mouseenter="animationEnabled=true" @mouseleave="animationEnabled=false">
		<AutoplayAnimation src="./animation.json" :enabled="animationEnabled" :repeat="animationRepeat" :loop="animationLoop"></AutoplayAnimation>
	</div><br>
	<h1>Video</h1>
	<button @click="videoLoop = !videoLoop">Loop {{videoLoop}}</button>&nbsp;
	<button @click="videoEnabled = !videoEnabled">Enabled {{videoEnabled}}</button><br><br>
	<div class="autoplay" @mouseenter="videoEnabled=true" @mouseleave="videoEnabled=false">
		<AutoplayVideo src="./video.mp4" :enabled="videoEnabled" :loop="videoLoop"></AutoplayVideo>
	</div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
.autoplay {
	display: inline-block;
}
.autoplay-animation,
.autoplay-video {
	width: 300px;
	border: 1px solid red;
}
button {
	min-width: 120px;
}
</style>
