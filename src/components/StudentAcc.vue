<script setup>

import requestServices from "../services/requestServices";
//import studentAcc from "../services/studentAccomServices";
//import AccCats from "../services/accCatServices";
import UserServices from "../services/userServices";
import SemesterServices from "../services/semesterServices";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";

//const router = useRouter();
const user = ref({});
//const studentAccoms = ref({});
const requests = ref([]);
//const cat = ref([]);
//const student = ref({});
const semester = ref({});

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

const formattedDate = (dateString) => {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleString();
};

const currentSemester = () => {
	SemesterServices.getSemester(props.userId) 
	.then((response) => {
		semester.value = response.data;
	})
	.catch((err) => {
		message.value = err.response.data.message;
	})
}

const currentRequests = () => {
  requestServices.getAllRequests()
    .then((response) => {
      requests.value = response.data.map((request) => ({
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in requests" :key="request.id">
          <td>{{ request.status }}</td>
          <td>{{ formattedDate(request.requestDate) }}</td>
          <td>{{ semester.name }}</td>
        </tr>
      </tbody>
    </table>




	  </v-card>
	</v-container>
</template>

<style>

</style>