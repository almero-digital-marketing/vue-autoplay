<template>
    <div ref="component" class="autoplay-video" :style="{
        'background-image': `url('${poster}')`
    }">
        <video ref="autoplay" :loop="loop" :muted="muted" disableRemotePlayback playsinline :preload="preload" :src="src"></video>
    </div>
</template>
<script setup>
import { ref, toRefs, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'

const props = defineProps({
    threshold: {
        type: Number,
        default: 0,
    },
    enabled: {
        type: Boolean,
        default: true
    },
    src: {
        type: String,
    },
    loop: {
        type: Boolean,
        default: false
    },
    muted: {
        type: Boolean,
        default: true
    },
    poster: {
        type: String
    },
    lazy: {
        type: Boolean,
        default: false
    },
    seek: {
        type: Number,
        default: 0
    }
})

const { enabled, threshold, lazy, seek } = toRefs(props)
const autoplay = ref(null)
const component = ref(null)
const preload = computed(() => {
    if (lazy.value) return 'none' 
    else return 'meta' 
})

let playing = false

function play() {
    if (enabled.value) {
        autoplay.value.play()
        .then(() => {
            setTimeout(() => {
                component.value.style.backgroundImage = 'unset'
            }, 1000)
        })
        .catch(() => {})
    }
    playing = true
}

function pause() {
    autoplay.value.pause()
    playing = false
}

function toggle() {
    let initial = playing
    if (!enabled.value) {
        pause()
    } else if (initial) {
        play()
    }
    playing = initial
}

function setCurrentTime() {
    if (seek.value) {
        nextTick().then(() => {
            autoplay.value.currentTime = seek.value
        })
    }
}

const observer = new IntersectionObserver(entries => {
    const [entry] = entries || []
    if (!entry) return

    if (entry.isIntersecting) {
        play()
    } else {
        pause()
    }
}, { threshold: threshold.value, })

watch(enabled, toggle)

onMounted(() => {
    setCurrentTime()
    observer.observe(autoplay.value)
    watch(seek, setCurrentTime)
})

onBeforeUnmount(() => {
    observer.unobserve(autoplay.value)

    autoplay.value.removeAttribute('src')
    autoplay.value.load()
})
</script>
<style scoped>
.autoplay-video {
    background-size: contain;
}
video {
    width: 100%;
    min-width: 100%;
}
</style>