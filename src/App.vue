<script setup>
import AutoplayAnimation from './components/AutoplayAnimation.vue'
import AutoplayVideo from './components/AutoplayVideo.vue'
import { ref } from 'vue'

const animationEnabled = ref(false)
const animationLoop = ref(false)
const animationRepeat = ref(false)
const videoEnabled = ref(false)
const videoLoop = ref(false)
const step = ref(0)

function onProgress({ percent }) {
	console.log('Video percent:', percent)
}

</script>

<template>
	<h1>Animation</h1>
	<button @click="animationLoop = !animationLoop">Loop {{animationLoop}}</button>&nbsp;
	<button @click="animationEnabled = !animationEnabled">Enabled {{animationEnabled}}</button>&nbsp;
	<button @click="animationRepeat = !animationRepeat">Repeat {{animationRepeat}}</button><br><br>
	<router-link to="/about">About</router-link>
	<hr>
	<router-view></router-view>
	<hr>

	<div class="autoplay" @mouseenter="animationEnabled=true" @mouseleave="animationEnabled=false">
		<AutoplayAnimation 
		src="https://storage.whitebox.pro/cache/almero.com/mikser/storage/animations/elfi.7c0ffc62-b869-490f-8ad6-3e81b8f36059.json" 
		:enabled="animationEnabled" 
		:repeat="animationRepeat" 
		:loop="animationLoop"></AutoplayAnimation>
	</div><br>

	<h1>Step animation</h1>
	<button @click="step = 0">Step 0</button>&nbsp;
	<button @click="step = 1">Step 1</button>&nbsp;
	<button @click="step = 2">Step 2</button>&nbsp;
	<button @click="step = 3">Step 3</button>&nbsp;
	<button @click="step = 4">Step 4</button>&nbsp;
	<strong>{{step}}</strong><br><br>
	<div class="autoplay negative">
		<AutoplayAnimation 
		src="/story-start-t2.json" 
		:step="step"
		:steps="5"
		></AutoplayAnimation>
	</div><br>

	<h1>Video</h1>
	<button @click="videoLoop = !videoLoop">Loop {{videoLoop}}</button>&nbsp;
	<button @click="videoEnabled = !videoEnabled">Enabled {{videoEnabled}}</button><br><br>
	<div class="autoplay" @mouseenter="videoEnabled=true" @mouseleave="videoEnabled=false">
		<AutoplayVideo src="https://storage.whitebox.pro/cache/almero.com/mikser/storage/index/gallery/acherno/preview-resize-1280-720-video-bitrate-600-fps-20.b0099731-1b87-44f6-815d-488d31b52ec2.mp4"
		:enabled="videoEnabled" 
		:loop="videoLoop"
		:seek="50"
		:controls="true"
		:muted="true"
		@progress="onProgress"
		></AutoplayVideo>
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
	width: 600px;
	border: 1px solid red;
}
button {
	min-width: 120px;
}
.negative {
	background-color: darkolivegreen;
}
</style>