<template>
    <svg aria-hidden="true">
        <use :href="symbolId" fill="currentColor" />
    </svg>
</template>

<script>
export default {
    props: {
        prefix: {
            type: String,
            default: "icon",
        },
        name: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const symbolId = `#${props.prefix}-${props.name}`;
        return { symbolId };
    },
};
</script>

<style scoped>
svg {
    max-width: 100%;
    max-height: 100%;
}
</style>
