<script setup>
import { ref, onMounted } from "vue";
import AccomCatServices from "../services/accCatServices";
import AccomServices from "../services/accServices";
import { useRouter } from "vue-router";
import { VDataTable } from "vuetify/labs/VDataTable"

const router = useRouter();
const message = ref("");

const accCats = ref([]);
const selAccCat = ref([]);
const accs = ref([]);
const selAcc = ref([]);

const refreshAccCats = () => {
    AccomCatServices.getAllAccomodationCats()
        .then((response) => {
            accCats.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message
        });
};

const refreshAccs = () => {
    AccomServices.getAllAccomodations()
        .then((response) => {
            accs.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message
        });
};

onMounted(() => {
    refreshAccCats();
    refreshAccs();
});
</script>

<template>
    <v-container>
        <v-card>
            <v-card-title class="text-center">Accommodation Categories</v-card-title>
            <v-data-table
                v-model="selAccCat"
                :headers="[
                    { title: 'Name', align: 'start', key: 'name'},
                    { title: 'Description', align: 'start', key: 'description' },
                    { title: 'Email(s)', align: 'start', key: 'email' }
                ]"
                :items="accCats"
                :sort-by="[{ key: 'name', order: 'asc' }]"
                :items-per-page="10"
                return-object
                select-strategy='single'
                show-select
            ></v-data-table>
        </v-card>
        <br><br>
        <v-card>
            <v-card-title class="text-center">Existing Semesters</v-card-title>
            <v-data-table
                v-model="selAcc"
                :headers="[
                    { title: 'Name', align: 'start', key: 'name'},
                    { title: 'PDF', align: 'start', key: 'pdf' }
                ]"
                :items="accs"
                :sort-by="[{ key: 'name', order: 'asc' }]"
                :items-per-page="20"
                return-object
                select-strategy='single'
                show-select
            ></v-data-table>
        </v-card>
    </v-container>
</template>

<style>

</style>