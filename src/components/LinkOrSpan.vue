<template>
    <a v-if="link" :href="link" :target="target">
        <slot></slot>
    </a>
    <span v-else>
        <slot></slot>
    </span>
</template>

<script>
export default {
    props: ["link", "target"],
};
</script>
