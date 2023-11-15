<script setup>
import NotificationServices from "../services/notificationServices";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
// This seems to require manual importing for some reason
import { VDataTable } from "vuetify/labs/VDataTable";

const router = useRouter();
const message = ref("");
const notifications = ref([]);

const refreshNotifications = () => {
    NotificationServices.getAllNotifications()
        .then((response) => {
            notifications.value = response.data.map(not => {
                return {
                    id: not.id,
                    createdAt: new Date(not.createdAt).toLocaleString(),
                    email: not.email.startsWith(",") ? not.email.substring(1) : not.email
                };
            });
        })
        .catch((err) => {
            message.value = err.response.data.message;
        })
}

onMounted(() => {
    refreshNotifications();
});
</script>

<template>
    <v-container>
        <v-card>
            <br>
            <v-row justify="center">
                <v-card-title style="font-size: 32pt;">Notifications</v-card-title>
            </v-row>
            <br>
            <v-data-table
                :headers="[
                    { title: 'Sent To', align: 'start', key: 'email'},
                    { title: 'Date', align: 'end', key: 'createdAt' },
                ]"
                :items="notifications"
                :sort-by="[{ key: 'id', order: 'desc' }]"
                :items-per-page="25"
            ></v-data-table>
            <br>
            <v-row justify="center">
                <v-btn color="primary" @click="router.push({name: 'ocSchedule'})">Back</v-btn>
            </v-row>
            <br>
        </v-card>
    </v-container>
</template>

<style>

</style>