<template>
    <div class="task">
        {{ fields.id }} - {{ fields.name }} ({{ formatTime(fields.seconds) }})
    </div>
</template>

<script>
import {formatTime} from '@/functions';

export default {
    props: ['fields'],
    methods: {
        formatTime,
    },
};
</script>

<style lang="scss">
.task {
    display: block;
}
</style>
