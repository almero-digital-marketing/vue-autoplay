<template>
    <div ref="component" class="autoplay-video">
        <video 
            ref="autoplay" 
            :loop="loop" 
            :muted="muted" 
            disableRemotePlayback 
            playsinline 
            :preload="preload" 
            :src="src"
            @ended="end"></video>
        <img v-if="showPoster && poster" :src="poster" alt="Poster">
    </div>
</template>
<script setup>
import { ref, toRefs, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'

const emit = defineEmits(['play', 'pause', 'activate', 'deactivate', 'end'])
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
    },
    singleton: {
        type: [Boolean, String],
        default: false
    }
})

const { enabled, threshold, lazy, seek } = toRefs(props)
const autoplay = ref(null)
const component = ref(null)
const preload = computed(() => {
    if (lazy.value) return 'none' 
    else return 'meta' 
})
const showPoster = ref(true)
let playing = false

function play() {
    if (enabled.value) {
        autoplay.value.play()
        .then(() => {
            emit('play')
            setTimeout(() => {
                showPoster.value = false
            }, 1000)
        })
        .catch(() => {})
    }
    playing = true
}

function pause() {
    autoplay.value.pause()
    playing = false
    emit('pause')
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
    if (seek.value >= 0) {
        nextTick().then(() => {
            autoplay.value.currentTime = seek.value
        })
    }
}

function end() {
    emit('end')
    setCurrentTime()
}

const observer = new IntersectionObserver(entries => {
    const [entry] = entries || []
    if (!entry) return

    if (entry.isIntersecting) {
        play()
        emit('activate')
    } else {
        pause()
        emit('deactivate')
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
<style lang="less" scoped>
.autoplay-video {
    position: relative;
    img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: contain;
        top: 0;
        left: 0;
    }
}
video {
    width: 100%;
    min-width: 100%;
}
</style>