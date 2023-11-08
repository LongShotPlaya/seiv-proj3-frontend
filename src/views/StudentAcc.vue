<script setup>

import requestServices from "../services/requestServices";
import studentAcc from "../services/studentAccomServices";
import AccCats from "../services/accCatServices";
import students from "../services/userServices";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = Utils.getStore("user");
const studentAccoms = ref({});
const request = ref({});
const cat = ref([]);
const student = ref("");

const message = ref("Works so far");

//const id = 1;
const { studentId } = defineProps(['studentId']);

const getStudent = () => {
	students.getUser(studentId)
	.then((response) => {
		student.value = response.data;
	})
	.catch ((err) => {
		message.value = err.response.data.message;
	})
}

const getAccCats = () => {
	AccCats.getAccomodationCat(studentId)
	.then((response) => {
		cat.value = response.data;
	})
	.catch((err) => {
		message.value = err.response.data.message;
	})
}

const getRequest = () => {
	requestServices.getRequest(studentId)
	.then((response) => {
		request.value = response.data;
	})
	.catch((err) => {
		message.value = err.response.data.message;
	})
}

const getCurrentAcc = () => {
	studentAcc.getStudentAccomodations(studentId)
	.then((response) => {
		studentAccoms.value = response.data;
	})
	.catch((err) => {
		message.value = err.response.data.message;
	})
};

const approveRequests = () => {
	requestServices.updateRequest(studentId, { status: "approved" });
		alert(user.fName + " " + user.lName + "'s accommodation status has been changed to accepted. ");
		//router.go(-1);
};

const denyRequests = () => {
	requestServices.updateRequest(studentId, { status: "denied" })
		alert(user.fName + " " + user.lName + "'s accommodation status has been changed to denied. ");
		//router.go(-1);
};

onMounted(() => {
	getCurrentAcc();
	getRequest();
	getAccCats();
	getStudent();
});

</script>

<template>
	<v-container>
	  <v-toolbar>
		<v-toolbar-title>Student Accommodations</v-toolbar-title>
	  </v-toolbar>
	  <br /><br />
  
	  <v-card>
		<v-card-title>
		  Accommodations for {{ student.fName }} {{ student.lName }}
		</v-card-title>
		<v-card-text>
		  <b>{{ message }}</b>
		</v-card-text>
		<br>

		<div class="form">
			<h4>Accommodation Requests</h4>
				<dl>
					<dt>{{ `${studentAccoms.studentId}` }}</dt>
					<dt>{{ `${request.status}` }}</dt>
					<dt></dt>
				</dl>
		</div>

		<div class="form">
			<h4>Accommodation History</h4>
				<dl>
					<dt>{{ `${studentAccoms.metaData}` }}</dt>
				</dl>
		</div>
  
		<v-card-actions>
		  <v-btn class="mx-2" color="green" @click="approveRequests">Approve Requests</v-btn>
		  <v-btn class="mx-2" color="red" @click="denyRequests">Deny Requests</v-btn>
		</v-card-actions>
	  </v-card>
	</v-container>
</template>

<style>
	div.form{
		margin-left: 3%;
	}
</style>