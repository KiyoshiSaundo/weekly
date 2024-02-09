<template>
    <select v-if="users.length > 1" v-model="userId" @change="changeUser">
        <option v-for="user in users" :key="user.ID" :value="user.ID">
            {{ user.LAST_NAME }} {{ user.NAME }} ({{ user.ID }})
        </option>
    </select>
</template>

<script>
import { getApiUsers } from "@/api";

export default {
    props: ["value"],
    emits: ["changeUser"],
    data() {
        return {
            apiUrl: this.$store.state.appApiUrl,
            userId: this.value || this.$store.state.appUserId,
            users: [],
        };
    },
    async created() {
        this.users = await this.getUsers();
    },
    methods: {
        async getUsers() {
            if (!this.apiUrl) return [];
            return await getApiUsers(this.apiUrl);
        },
        changeUser(e) {
            this.$emit("changeUser", e.target.value);
        },
    },
};
</script>
