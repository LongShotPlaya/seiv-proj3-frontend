<script setup>

import requestServices from "../services/requestServices";
//import studentAcc from "../services/studentAccomServices";
//import AccCats from "../services/accCatServices";
import UserServices from "../services/userServices";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";

//const router = useRouter();
const user = ref({});
//const studentAccoms = ref({});
const requests = ref([]);
//const cat = ref([]);
//const student = ref({});

/**
 * Wants to display
 * 		status
 * 		request state
 * 		semester
 * 
 */

const message = ref("");

const props = defineProps({
  userId: {
    required: true,
  },
});

const currentRequests = () => {
	requestServices.getAllRequests()
	.then((response) => {
		requests.value = response.data;
	})
	.catch((err) => {
		message.value = err.response.data.message;
	})
}

const currentUser = () => {
	UserServices.getUser(props.userId)
	.then((response) => {
		user.value = response.data;
	})
	.catch ((err) => {
		message.value = err.response.data.message;
	})
}

onMounted(() => {
	currentUser();
	currentRequests();
});

</script>

<template>
	<v-container>
	  <v-toolbar>
		<v-toolbar-title>Student Accommodations</v-toolbar-title>
	  </v-toolbar>
	  	
	  <v-card>
		<v-card-title>
			Accomodations for {{ `${user.fName} ${user.lName}`  }}
		</v-card-title>
		<v-card-text>
		  <b>{{ message }}</b>
		</v-card-text>

			<tr v-for="request in requests" :key="request.id">
				<td>{{ request.status }}</td>
				<td>{{ request.requestDate }}</td>
				<td></td>
			</tr>

	  </v-card>
	</v-container>
</template>

<style>

</style>