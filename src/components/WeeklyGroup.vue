<template>
    <div class="weekly-group" :class="{ 'is-collapse': collapsed }">
        <div class="weekly-group__title">
            <span class="weekly-group__name" @click="toggle()">
                <SvgIcon name="arrow" class="weekly-group__toggle"></SvgIcon>
                {{ group.name }}
            </span>
            <span class="weekly-group__time mono">
                ({{ formatTime(group.time) }})
            </span>
            <input
                v-model="selected"
                class="weekly-group__check"
                type="checkbox"
                :value="group.id"
                @input="
                    $emit('checked', $event.target.value, $event.target.checked)
                "
            />
        </div>
        <div class="weekly-group__tasks">
            <WeeklyTask
                v-for="task in group.tasks"
                :key="task.id"
                :task="task"
            />
        </div>
    </div>
</template>

<script>
import { formatTime, getDomain } from "@/functions";

import SvgIcon from "@/components/SvgIcon.vue";
import WeeklyTask from "@/components/WeeklyTask.vue";

export default {
    components: {
        SvgIcon,
        WeeklyTask,
    },
    props: ["group", "collapsedAll"],
    emits: ["checked"],
    data() {
        return {
            selected: false,
            collapsed: false,
            link: this.makeLink(this.group.id4user),
        };
    },
    watch: {
        collapsedAll() {
            this.toggle(this.collapsedAll);
        },
    },
    methods: {
        formatTime,

        toggle(state) {
            this.collapsed = state !== undefined ? state : !this.collapsed;
        },

        makeLink(id) {
            if (id) {
                return (
                    getDomain(this.$store.state.appApiUrl) +
                    `/workgroups/group/${id}/`
                );
            }
            return false;
        },
    },
};
</script>

<style lang="scss">
.weekly-group {
    margin-bottom: calc($gap / 4);
    break-inside: avoid;

    &:last-child {
        margin-bottom: 0;
    }

    &__title {
        display: inline-block;

        a {
            text-decoration: none;
        }
    }

    &__name {
        position: relative;
        display: inline-block;
        font-weight: 600;
        padding-left: calc(22px + 5px);

        &:hover {
            color: $color-accent;
            cursor: pointer;
        }

        @media print {
            padding-left: 0;
        }
    }

    &__toggle {
        width: 22px;
        height: 22px;
        transform: rotate(90deg);
        position: absolute;
        left: 0;
        top: 0;

        .is-collapse & {
            transform: rotate(0);
        }

        @media print {
            display: none;
        }
    }

    &__time {
    }

    &__check {
        opacity: 0;

        .weekly-group:hover &,
        &:checked {
            opacity: 1;
        }
    }

    &__tasks {
        padding-left: calc(22px + 5px);

        @media print {
            padding-left: 0;
        }

        .is-collapse & {
            display: none;
        }
    }
}
</style>
