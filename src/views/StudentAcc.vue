<script setup>

import { ref } from "vue";
import studentAccomServices from "../services/studentAccomServices.js";
import requests from "../services/requestServices.js"
import student from "../services/studentServices.js"
import { useRouter } from "vue-router";

const router = useRouter ();
const message = ref("");

const props = defineProps({
  id: {
    required: true,
  },
});

const acc = ref({
	metaData: null,
	id: "",
});

const approve = () => {
	const data = {
		metaData: acc.value.metaData,
		id: acc.value.id
	};
	if ( studentHistory = "" ) {
		studentAccomServices.updateStudentAccomodations(id, data);
		router.go(-1);
	}
	else {
		studentAccomServices.createStudentAccomodations(data);
		router.go(-1);
	}
}

const deny = () => {
	requests.updateRequest(rejected);
}


</script>

<template>
    <v-container>
		<v-toolbar>
			<v-toolbar-title>{{ firstName }} {{ lastName }}'s accomodations</v-toolbar-title>
		</v-toolbar>
			<br>

		<div class="container">
			<h4>Current Accommodations</h4>
				<ul>
					<li v-for="accommodation in student.currentAccommodations" :key="accommodation.id">{{ accommodation.name }}</li>
				</ul>
					<br>
			<h4>Previous Accommodations</h4>
				<ul>
					<li v-for="accommodation in student.previousAccommodations" :key="accommodation.id">{{ accommodation.name }}</li>
				</ul>
					<br>
			<h4>Requested Accommodations</h4>
				<ul>
					<li v-for="request in student.currentRequests" :key="request.id">{{ request.name }}</li>
				</ul>
					<br>


				<v-text-field 
					required placeholder="ie. CMSC-1111" v-model="courses.courseNo" id="courseNo" label="Course Number">
				</v-text-field>


				<v-card-actions>
					<v-btn :disabled=saveDisabled color="success" class="mr-4" @click="approve">Approve</v-btn>
					<v-btn :disabled=updateDisabled color="success" class="mr-4" @click="deny">Deny</v-btn>
				</v-card-actions>
		</div>
	</v-container>
</template>


<style>

</style>