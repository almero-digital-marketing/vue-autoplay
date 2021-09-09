<template>
    <div class="autoplay-video" ref="autoplay" :style="{
        'background-image': `url('${poster}')`
    }">
        <slot v-if="!src"></slot>
        <video v-else :loop="loop" :muted="muted" disableRemotePlayback playsinline :preload="preload" :src="src"></video>
    </div>
</template>
<script setup>
import { ref, toRefs, watch, onMounted, onBeforeUnmount, computed } from 'vue'

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
        default: false
    },
    poster: {
        type: String
    },
    lazy: {
        type: Boolean,
        default: false
    }
})

const { enabled, threshold, lazy } = toRefs(props)
const autoplay = ref(null)
const preload = computed(() => {
    if (lazy.value) return 'none' 
    else return 'meta' 
})

let playing = false

function play() {
    if (enabled.value) {
        for(let video of autoplay.value.querySelectorAll('video')) {
            // console.log('Play:', video.getAttribute('src'))
            video.play()
            .then(() => {
                setTimeout(() => {
                    video.style.backgroundImage = 'unset'
                }, 1000)
            })
            .catch(() => {})
        }
    }
    playing = true
}

function pause() {
    for(let video of autoplay.value.querySelectorAll('video')) {
        // console.log('Pause:', video.getAttribute('src'))
        video.pause()
    }
    playing = false
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

onMounted(() => {
    observer.observe(autoplay.value)

    watch(enabled, () => {
        let initial = playing
        if (!enabled.value) {
            pause()
        } else if (initial) {
            play()
        }
        playing = initial
    })

})

onBeforeUnmount(() => {
    if (autoplay.value) {
        observer.unobserve(autoplay.value)
        for(let video of autoplay.value.querySelectorAll('video')) {
            video.removeAttribute('src')
            video.load()
        }
    } 
})
</script>
<style scoped>
.auto-play-video {
    background-size: fill;
}
video {
    width: 100%;
}
</style>