<template>
    <div class="autoplay-animation">
        <div class="animation" ref="autoplay"></div>
    </div>
</template>
<script setup>
import { ref, toRefs, watch, onBeforeUnmount, onMounted, computed } from 'vue'
import lottie from 'lottie-web'

const emit = defineEmits(['play', 'pause', 'activate', 'deactivate', 'reverse', 'complete', 'loopComplete'])
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

let playing = false
let animation
const totalFrames = ref(0)

function init() {
    if (src.value) {
        animation = lottie.loadAnimation({
            container: autoplay.value,
            render: 'svg',
            autoplay: enabled.value,
            loop: loop.value,
            path: src.value,
        })
        animation.addEventListener('complete', onComplete)
        animation.addEventListener('loopComplete', onLoopComplete)
        animation.addEventListener('DOMLoaded', () => {
            totalFrames.value = animation.totalFrames
            if (steps.value) goTo(step.value)
        })
    }
}

function getAbsoluteFrame() {
    const { firstFrame, currentFrame, playDirection } = animation
    const absoluteFrame = playDirection ? firstFrame + currentFrame : firstFrame
    return absoluteFrame
}

const autoplay = ref(null)
const $keyframes = computed(() => {
    if (totalFrames.value) {
        if (keyframes.value) {
            if (Array.isArray(keyframes.value)) return keyframes.value
            return keyframes.value.split(',').map(keyframe => Number.parseInt(keyframe))
        }
        if (steps.value) {
            const autoKeyframes = [0]
            let stepFrames = totalFrames.value / (steps.value - 1)
            for (let index = 1; index < steps.value - 1; index++) {
    
                autoKeyframes.push(stepFrames * index)
            }
            autoKeyframes.push(totalFrames.value - 1)
            console.log(src.value, ...autoKeyframes)
            return autoKeyframes
        }
    }
})

function toggle() {
    if (repeat.value) {
        const absoluteFrame = getAbsoluteFrame()
        if (absoluteFrame == 0) {
            play()
        } else {
            reverse()
        }
    }
}

function onComplete() {
    emit('complete')
    toggle()
}

function onLoopComplete() {
    emit('loopComplete')
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
        animation.removeEventListener('complete', onComplete)
        animation.removeEventListener('loopComplete', onLoopComplete)
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

function goTo(keyframe) {
    if ($keyframes.value) {
        const absoluteFrame = getAbsoluteFrame()

        let segment
        if (absoluteFrame < $keyframes.value[keyframe]) {
            animation.setDirection(1)
            segment = [
                absoluteFrame, 
                $keyframes.value[keyframe] + 1,
            ]
            animation.playSegments(segment, true)
        } else {
            animation.setDirection(-1)
            segment = [
                absoluteFrame,
                $keyframes.value[keyframe], 
            ]
        }
        console.log(src.value, segment)
        animation.playSegments(segment, true)
    }
} 

watch(step, () => {
    goTo(step.value)
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

// function showAnimation() {
//     console.log(animation)
// }

</script>
<style scoped>
.animation {
    width: 100%;
}
</style>