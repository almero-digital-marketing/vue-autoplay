<template>
    <div class="autoplay-animation">
        <div class="animation" ref="autoplay"></div>
    </div>
</template>
<script setup>
import { ref, toRefs, watch, onBeforeUnmount, onMounted, computed } from 'vue'
import lottie from 'lottie-web'

const emit = defineEmits(['play', 'pause', 'activate', 'deactivate', 'reverse'])
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
    lazy: {
        type: Boolean,
        default: false
    },
    singleton: {
        type: [Boolean, String],
        default: false
    },
    keyframes: {
        type: [Array, String],
        default: null
    },
    step: {
        type: Number,
        default: 0
    },
    steps: {
        type: Number,
        default: 0
    }
})

const { enabled, threshold, loop, src, repeat, lazy, keyframes, step, steps } = toRefs(props)
const autoplay = ref(null)
const $keyframes = computed(() => {
    if (keyframes.value) {
        if (Array.isArray(keyframes.value)) return keyframes.value
        return keyframes.value.split(',').map(keyframe => Number.parseInt(keyframe))
    }
    if (steps.value) {
        const duration = animation.getDuration(true)
        const autoKeyframes = [0]
        for (let index = 1; index < steps.value - 1; index++) {
            autoKeyframes.push(duration / (index + 1))
        }
        autoKeyframes.push(duration - 1)
        return autoKeyframes
    }
})

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
        if (lazy.value && !animation) init()
        if (animation && enabled.value) {
            animation.setDirection(1)
            animation.play()
            emit('play')
        }
    }
    playing = true
}

function pause() {
    if (animation) {
        animation.pause()
        emit('pause')
    }
    playing = false
}

function reverse() {
    if (animation) {
        animation.setDirection(-1)
        animation.play()
        emit('reverse')
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

watch(step, () => {
    if ($keyframes.value) {
        if (animation.currentFrame < $keyframes.value[step.value]) {
            animation.setDirection(-1)
        } else {
            animation.setDirection(1)
        }
        console.log(animation.currentFrame, $keyframes.value[step.value])
        animation.playSegments([animation.currentFrame, $keyframes.value[step.value]], true)
    }
})

const observer = new IntersectionObserver(entries => {
    const [entry] = entries || []
    if (!entry) return

    if (entry.isIntersecting) {
        emit('activate')
        play()
    } else {
        pause()
        emit('deactivate')
    }
}, { threshold: threshold.value, })

onMounted(() => {
    if (!lazy.value) init()
    observer.observe(autoplay.value)
    
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