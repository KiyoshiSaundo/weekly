<template>
    <div class="tabs">
        <div class="tabs__tabs">
            <div
                v-for="tab in tabs"
                :key="tab.k"
                class="tabs__tab"
                :class="{'is-active': tab.k == active}"
                @click="changeTab(tab.k)"
            >
                {{ tab.name }}
            </div>
        </div>
        <div class="tabs__contents">
            <div
                v-for="tab in tabs"
                :key="tab.k"
                class="tabs__content"
                :class="{'is-active': tab.k == active}"
                @click="changeTab(tab.k)"
            >
                <component :is="tab.content"></component>
            </div>
        </div>
    </div>
</template>

<script>
import TabWeekly from '@/components/TabWeekly.vue';
import TabYearly from '@/components/TabYearly.vue';

export default {
    components: {
        TabWeekly,
        TabYearly,
    },
    data() {
        return {
            active: 1,
            tabs: [
                {k: 0, name: 'Неделька', content: 'TabWeekly'},
                {k: 1, name: 'Годик', content: 'TabYearly'},
            ],
        };
    },
    methods: {
        changeTab(index) {
            this.active = index;
        },
    },
};
</script>

<style lang="scss" scoped>
.tabs {
    &__tabs {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        padding-left: 1px;
    }

    &__tab {
        font-size: 18px;
        line-height: 1;
        font-weight: 500;
        border: 1px solid $color-divide;
        border-bottom: 0;
        position: relative;
        padding: 7px 20px;
        margin-left: -1px;
        cursor: pointer;

        &.is-active {
            background: $color-divide;
            padding-top: 12px;
            padding-bottom: 12px;
            cursor: default;
        }
    }

    &__contents {
        padding-top: $padding-base;
        border-top: 1px solid $color-divide;
    }

    &__content {
        display: none;

        &.is-active {
            display: block;
        }
    }
}
</style>
