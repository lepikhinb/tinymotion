<h3 align="center">Tinymotion</h3>

<p align="center">Tinymotion is a Vue.js animation library, that seamlessly works with Tailwind CSS.</p>

<table width="100%" align="center">
    <tr>
        <td align="center"><a href="https://tinymotion.me/#hover"><strong>Hover</strong></a></td>
        <td align="center"><a href="https://tinymotion.me/#click"><strong>Click</strong></a></td>
        <td align="center"><a href="https://tinymotion.me/#trigger"><strong>Trigger</strong></a></td>
        <td align="center"><a href="https://tinymotion.me/#auto"><strong>Auto</strong></a></td>
    </tr>
    <tr>
        <td align="center">
            <img src="https://tinymotion.me/preview/1.gif">
        </td>
        <td align="center">
            <img src="https://tinymotion.me/preview/2.gif">
        </td>
        <td align="center">
            <img src="https://tinymotion.me/preview/3.gif">
        </td>
        <td align="center">
            <img src="https://tinymotion.me/preview/4.gif">
        </td>
    </tr>
    <tr>
        <td align="center"><a href="https://tinymotion.me/usage#switch"><strong>Switch</strong></a></td>
        <td align="center"><a href="https://tinymotion.me/usage#grid"><strong>Grid</strong></a></td>
        <td align="center"><a href="https://tinymotion.me/usage#shuffle"><strong>Shuffle</strong></a></td>
        <td align="center"><a href="https://tinymotion.me/usage#loader"><strong>Loader</strong></a></td>
    </tr>
    <tr>
        <td align="center">
            <img src="https://tinymotion.me/preview/5.gif">
        </td>
        <td align="center">
            <img src="https://tinymotion.me/preview/6.gif">
        </td>
        <td align="center">
            <img src="https://tinymotion.me/preview/7.gif">
        </td>
        <td align="center">
            <img src="https://tinymotion.me/preview/8.gif">
        </td>
    </tr>
</table>

## Installation
```sh
npm i -S tinymotion
```

## How to use
```vue
<template>
    <Motion
        :hover="[
            'scale-100',
            'scale-125 rotate-45',
            'scale-100 rotate-0',
        ]"
        :options="motion"
        class="w-16 h-16"
    />
</template>

<script>
import Motion from 'tinymotion';

export default {
    components: { Motion },

    data() {
        return {
            motion: {
                repeat: true,           // infinite animation until stopped
                rollback: true,         // reverse animation until return to the first keyframe
                instantRollback: true,  // instantly return to the first keyframe
                delay: 0,               // delay before the start
                stepDelay: 0,           // delay between keyframes
                factor: 1,              // delay factor (number of steps to skip) before every step
                skip: 0,                // number of steps to skip before the first flip
                duration: 600,          // default duration. might be overridden by duration-{value} Tailwind class
                ease: 'ease-in-out',    // transition timing function
            }
        }
    }
}
</script>
```

### Triggers
#### Hover
Triggers animation on hover. If `rollback` option is enabled, the animation will start rolling back on mouse leave.

```vue
<template>
    <Motion
        :hover="[
            'scale-100',
            'scale-125 rotate-45',
            'scale-100 rotate-0',
        ]"
        class="w-16 h-16"
    />
</template>
```

#### Click
Triggers animation on click. If `rollback` option is enabled, the animation will start rolling back on mouse up.

```vue
<template>
    <Motion
        :click="[
            'scale-100',
            'scale-125 rotate-45',
            'scale-100 rotate-0',
        ]"
        class="w-16 h-16"
    />
</template>
```

#### Custom trigger
Tinymotion supports external triggers. Once the trigger value is changed, the animation will fire. The next time the value is changed, the animation will stop.

```vue
<template>
    <Motion
        v-model="trigger"
        :trigger="[
            'scale-100',
            'scale-125 rotate-45',
            'scale-100 rotate-0',
        ]"
        class="w-16 h-16"
    />

    <button @click="trigger = !trigger">Animate</button>
</template>

<script>
import Motion from 'tinymotion';

export default {
    components: { Motion },

    data() {
        return {
            trigger: false,
        }
    }
}
</script>
```

## Examples
* [Hover](https://tinymotion.me/#hover)
* [Click](https://tinymotion.me/#click)
* [External trigger](https://tinymotion.me/#trigger)
* [Auto](https://tinymotion.me/#auto)
* [Switch](https://tinymotion.me/usage#switch)
* [Loader](https://tinymotion.me/usage#loader)

## Roadmap
This project is in the early development stage. If you want to help to improve this, you are welcome to create a PR.

## Author
[Boris Lepikhin](https://twitter.com/lepikhinb)