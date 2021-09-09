<template>
    <div class="autoplay-animation">
        <div class="animation" ref="autoplay"></div>
    </div>
</template>
<script setup>
import { ref, toRefs, watch, onBeforeUnmount, onMounted } from 'vue'
import lottie from 'lottie-web'

const props = defineProps({
    threshold: {
        type: Number,
        default: 0,
    },
    enabled: {
        type: Boolean,
        default: false
    },
    loop: {
        type: Boolean,
        default: false
    },
    src: {
        type: String,
    },
    repeat: {
        type: Boolean,
        default: false
    },
})

const { enabled, threshold, loop, src, repeat } = toRefs(props)
const autoplay = ref(null)

let playing = false
let animation

function init() {
    if (src.value) {
        animation = lottie.loadAnimation({
            container: autoplay.value,
            render: 'svg',
            autoplay: enabled.value,
            loop: loop.value,
            path: src.value,
        })
        animation.addEventListener('complete', toggle)
    }
}

function toggle() {
    if (repeat.value) {
        if (animation.currentFrame == 0) {
            play()
        } else {
            reverse()
        }
    }
}

function play() {
    if (enabled.value) {
        if (animation && enabled.value) {
            animation.setDirection(1)
            animation.play()
        }
    }
    playing = true
}

function pause() {
    if (animation) {
        animation.pause()
    }
    playing = false
}

function reverse() {
    if (animation) {
        animation.setDirection(-1)
        animation.play()
    }
}

function dispose() {
    if (animation) {
        animation.removeEventListener('complete', toggle)
        animation.destroy()
    }
}

watch(enabled, () => {
    let initial = playing
    if (!enabled.value) {
        if (loop.value) {
            pause()
        } else {
            reverse()
        }
    } else if (initial) {
        play()
    }
    playing = initial
})

watch(src, () => {
    if (src.value && playing) {
        dispose()
        init()
        play()
    } else {
        pause()
    }
})

watch(loop, () => {
    if (animation) {
        animation.loop = loop.value
        if (enabled.value) play()
    }
})

watch(repeat, () => {
    if (animation && enabled.value) toggle()
})

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
    init()
    observer.observe(autoplay.value)
})

onBeforeUnmount(() => {
    if (autoplay.value) observer.unobserve(autoplay.value)
    dispose()
})

</script>
<style scoped>
.animation {
    width: 100%;
}
</style>