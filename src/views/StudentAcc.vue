<script setup>

import requestServices from "../services/requestServices";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("You dont have access");

const currentAccommodations = ref([
  { id: 1, description: "Extended test time" },
  { id: 2, description: "Accessible classroom" },
]);

const accommodationRequests = ref([
  { id: 1, description: "Printed notes" },
  { id: 2, description: "Excused absenses" },
]);

const requests = ([]);

const loadRequests = () => {
  requestServices.getAllRequests()
    .then((response) => {
      requests.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
	  console.log("Error: " + response.data.message);
    });
};

const approveRequests = () => {
  const promises = requests.value.map((request) => {
    return requestServices.updateRequest(request.id, { status: "approved" });
  });
  alert(user.fName + " " + user.lName + "'s accommodation status has been changed to accepted. ");
  router.push({ name: "home" });
  //Promise.all(promises)
  //  .then((responses) => {
  //    // Handle success for each request update
  //    responses.forEach((response, index) => {
  //      requests.value[index].status = "approved";
  //    });
  //  })
  //  .catch((e) => {
  //    message.value = e.response.data.message;
  //  });
};

const denyRequests = () => {
	const promises = requests.value.map((request) => {
		return requestServices.updateRequest(request.id, { status: "denied" })
	});
	alert(user.fName + " " + user.lName + "'s accommodation status has been changed to denied. ");
  	router.push({ name: "home" });
	//Promise.all(promises)
	//	.then((responses) => {
	//	responses.forEach((response, index) => {
	//		requests.value[index].status = "denied";
	//	});
	//	})
	//	.catch((e) => {
	//	message.value = e.response.data.message;
	//	});
	}
	onMounted(() => {
		loadRequests();
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
  
		<div class="form" v-if="currentAccommodations.length > 0">
		<h4>Current Accommodations</h4>
		  <dl>
			<dt v-for="accommodation in currentAccommodations" :key="accommodation.id">
			  {{ accommodation.description }}
			</dt>
		  </dl>
		</div>
  
		<div class="form">
		  <h4>Accommodation Requests</h4>
		  <dl>
			<dt v-for="accommodation in accommodationRequests" :key="accommodation.id">
			  {{ accommodation.description }}
			</dt>
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