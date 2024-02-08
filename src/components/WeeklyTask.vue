<template>
    <div class="report-weekly-task">
        <LinkOrSpan
            class="report-weekly-task__id mono"
            :link="link"
            target="_blank"
        >
            {{ task.id }}
        </LinkOrSpan>
        <span class="report-weekly-task__name">{{ " - " + task.name }}</span>
        <span class="report-weekly-task__time mono">
            ({{ formatTime(task.time) }})
        </span>
    </div>
</template>

<script>
import { formatTime, getDomain } from "@/functions";
import LinkOrSpan from "@/components/LinkOrSpan.vue";

export default {
    components: {
        LinkOrSpan,
    },
    props: ["task"],
    data() {
        return {
            link: this.makeLink(this.task.id4user),
        };
    },
    methods: {
        formatTime,

        makeLink(id) {
            if (id) {
                return (
                    getDomain(this.$store.state.appApiUrl) +
                    `/company/personal/user/${this.$store.state.appUserId}/tasks/task/view/${id}/`
                );
            }
            return false;
        },
    },
};
</script>

<style lang="scss">
.report-weekly-task {
    &__id {
        text-decoration: none;
    }

    &__name {
    }

    &__time {
    }
}
</style>
