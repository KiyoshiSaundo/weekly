<template>
    <div class="app" :class="{ 'is-loading': isAppLoading }">
        <AppAuth v-if="!isAuth" />
        <!-- <AppAuthInstruction v-if="!isAuth" /> -->
        <div v-if="isAuth" class="app__sidebar">
            <AppName />
            <AppMenu />
            <AppUser />
        </div>
        <div v-if="isAuth" class="app__page">
            <KeepAlive>
                <component :is="currentPage"></component>
            </KeepAlive>
        </div>
        <AppNotify />
    </div>
</template>

<script>
import AppNotify from "@/components/AppNotify.vue";
import AppAuth from "@/components/AppAuth.vue";
import AppAuthInstruction from "@/components/AppAuthInstruction.vue";
import AppName from "@/components/AppName.vue";
import AppMenu from "@/components/AppMenu.vue";
import AppUser from "@/components/AppUser.vue";

import PageReportWeekly from "@/pages/PageReportWeekly.vue";
import PageReportYearly from "@/pages/PageReportYearly.vue";
import PageAppSettings from "@/pages/PageAppSettings.vue";

export default {
    components: {
        AppAuth,
        AppAuthInstruction,
        AppNotify,
        AppName,
        AppMenu,
        AppUser,
        PageReportWeekly,
        PageReportYearly,
        PageAppSettings,
    },
    created() {
        this.$store.dispatch("appLoaded");
    },
    computed: {
        isAppLoading() {
            return this.$store.state.appLoading;
        },
        isAuth() {
            return this.$store.state.appAuth;
        },
        currentPage() {
            return this.$store.state.menuCurrent;
        },
    },
};
</script>

<style lang="scss">
.app {
    @include preloading($color-accent, $color-white);
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: wrap;
    min-height: 100vh;
    max-width: 1680px;
    margin: 0 auto;

    &__sidebar {
        position: fixed;
        top: 0;
        left: max(calc((100% - 1600px) / 2), 0);
        padding: $gap;
        width: 300px;
        display: flex;
        flex-direction: column;
        height: 100vh;

        @media print {
            display: none;
        }
    }

    &__page {
        width: calc(100% - 300px - $gap);
        margin: $gap $gap $gap 300px;
        background: $color-white;
        border: $border;
        display: flex;
        flex-direction: column;

        @media print {
            width: 100%;
            margin: 0;
        }
    }
}
</style>
