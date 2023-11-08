<script setup>

import requestServices from "../services/requestServices";
import studentAcc from "../services/studentAccomServices";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = Utils.getStore("user");
const studentAccoms = ref({});

const message = ref("You dont have access");

const id = 1;

const getCurrentAcc = () => {
	studentAcc.getStudentAccomodations(id)
	.then((response) => {
		studentAccoms.value = response.data;
	})
	.catch((err) => {
		message.value = err.response.data.message;
	})
};

const approveRequests = () => {
	requestServices.updateRequest(studentAcc.id, { status: "approved" });
		alert(user.fName + " " + user.lName + "'s accommodation status has been changed to accepted. ");
		//router.go(-1);
};

const denyRequests = () => {
	requestServices.updateRequest(request.id, { status: "denied" })
		alert(user.fName + " " + user.lName + "'s accommodation status has been changed to denied. ");
		//router.go(-1);
};

onMounted(() => {
	getCurrentAcc();
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
		  Accommodations for {{ user.fName }} {{ user.lName }}
		</v-card-title>
		<v-card-text>
		  <b>{{ message }}</b>
		</v-card-text>
		<br>

		<div class="form">
			<h4>Accommodation Requests</h4>
				<dl>
					<dt>{{ `${studentAccoms.id}` }}</dt>
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