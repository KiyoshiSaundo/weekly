<template>
    <div class="task">
        {{ fields.name }} - {{ formatTime(fields.seconds) }}
    </div>
</template>

<script>
import {formatTime} from '@/functions';

export default {
    name: 'TaskItem',
    props: ['fields'],
    methods: {
        formatTime
    }
};
</script>

<style lang="scss">
.task {
    display: block;
}
</style>
