<script setup>
import { ref, onMounted } from "vue";
import studentAccomServices from "../services/studentAccomServices.js";
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



</script>

<template>
    <v-container>
		<v-toolbar>
			<v-toolbar-title>Student {{ firstName }} {{ lastName }}'s accomodations</v-toolbar-title>
		</v-toolbar>
			<br>
		<div class="container">
			<v-form ref="form" v-model="valid" lazy validation>
				<v-text-field 
					required v-model="courses.name" id="name" label="Name">
				</v-text-field>


				<v-text-field 
					required placeholder="ie. CMSC-1111" v-model="courses.courseNo" id="courseNo" label="Course Number">
				</v-text-field>


				<v-card-actions>
					<v-btn :disabled=saveDisabled color="success" class="mr-4" @click="approve">Approve</v-btn>
					<v-btn :disabled=updateDisabled color="success" class="mr-4" @click="deny">Deny</v-btn>
				</v-card-actions>
			</v-form>
		</div>
	</v-container>
</template>

<style>

</style>