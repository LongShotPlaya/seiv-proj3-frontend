<script setup>

import requestServices from "../services/requestServices";
import UserServices from "../services/userServices";
import SemesterServices from "../services/semesterServices";
//import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref({});
const requests = ref([]);
const semesters = ref([]);

const message = ref("");

const props = defineProps({
  userId: {
    required: true,
  },
});

const formattedDate = (dateString) => {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleString();
};

const currentSemester = () => {
	SemesterServices.getAllSemesters() 
	.then((response) => {
		semesters.value = response.data;
	})
	.catch((err) => {
		message.value = err.response.data.message;
	})
}

const currentRequests = () => {
  requestServices.getAllRequests()
    .then((response) => {
      requests.value = response.data
		.filter(request => request.userId == user.value.id)
		.map((request) => ({
			...request,
			formattedRequestDate: formattedDate(request.requestDate),
		}));
		})
    .catch((err) => {
      message.value = err.response.data.message;
    });
};

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
	currentSemester();
	formattedDate();
});

</script>

<template>
	<v-container>
	  <v-toolbar>
		<v-toolbar-title>Student Accommodations</v-toolbar-title>
	  </v-toolbar>
	  <v-card>
		<br>
		<v-card-title>
			Accomodations for {{ `${user.fName} ${user.lName}`  }}
		</v-card-title>
		<v-card-text>
		  <b>{{ message }}</b>
		</v-card-text>
		<table>
			<thead>
				<tr>
					<th>Status</th>
					<th>Request Date</th>
					<th>Semester</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="request in requests" :key="request.id">
					<td>{{ request.status }}</td> 
					<td>{{ formattedDate(request.requestDate) }}</td>
					<td>{{ semesters.find(semester => semester.id == request.semesterId).name}}</td>
					<td>
						<v-btn 
							color="secondary" 
							@click="router.push({name: 'requestDetails', params: {studentId: user.id, requestId: request.id}})">View Request
						</v-btn>
					</td>
				</tr>
			</tbody>
		</table>
	  </v-card>
	</v-container>
</template>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

</style>