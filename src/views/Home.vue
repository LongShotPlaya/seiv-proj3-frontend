<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";
import SemesterServices from "../services/semesterServices.js";
import UserServices from "../services/userServices";

const router = useRouter();

const message = ref("");
const authTitle = ref("You should not see this")
const firstHeader = ref("You should not see this");
const secondHeader = ref("You should not see this");
const thirdHeader = ref("You should not see this");
const semesterTitle = ref("Select A Semester Please");

const view = ref(-1);
var thirdHead = false;
var tableEnable = true;
const user = Utils.getStore("user");

const semesters = ref([]);
const test = ref(["A","B","C"]);

const titleChange = async () => {
	semesterTitle.value = "Hello World!";
};

const authenTitle = async () => {
	try {
		switch (user.role)
		{
			case "Administrator":
				authTitle.value = "Administrator Home";
				firstHeader.value = "Students";
				secondHeader.value = "Accommodations";
				thirdHeader.value = "Status";
				view.value = 1;
				thirdHead = true;
				tableEnable = true;
				break;
			case "Faculty":
				authTitle.value = "Faculty Home";
				firstHeader.value = "Students";
				secondHeader.value = "Accommodations";
				view.value = 2;
				thirdHead = false;
				tableEnable = true;
				break;
			case "Student":
				authTitle.value = "Student Home";
				firstHeader.value = "Accommodations";
				secondHeader.value = "Status";
				thirdHead = false;
				tableEnable = true;
				view.value = 3;
				break;
			default:
				authTitle.value = "User Authentication Is Invalid";
				view.value = 0;
				tableEnable = false;
				break;
		}	
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const retrieveSemesters = () => {
    SemesterServices.getAllSemesters()
        .then((response) => {
          semesters.value = response.data;
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
};

onMounted(() => {
	authenTitle();
	retrieveSemesters();
});

</script>

<template>
	<v-container>
		<v-toolbar>
			<v-toolbar-title>{{ authTitle }}</v-toolbar-title>
		</v-toolbar>
		<br />
		<div class="container">
			<h2> Accommodations For {{ semesterTitle }}</h2>
			<v-select label="Semester" v-model="semesterTitle" :items="test" @click="titleChange">
			</v-select>
			<v-table v-if=tableEnable>
				<thead>
					<tr>
						<th class="text-left"> {{ firstHeader }}</th>
						<th class="text-left"> {{ secondHeader }}</th>
						<th v-if=thirdHead class="text-left" > {{ thirdHeader }}</th>
					</tr>
				</thead>
				<tbody>
				<!-- <tr v-for="(item, index) in adminTable" :key="index">
					<td>{{ item.student }}</td>
					<td>{{ item.accommodation }}</td>
					<td v-if=thirdHead class="text-left">{{ item.status }}</td>
				</tr> -->
				</tbody>
			</v-table>
			<v-btn color="success" class="mr-4"> <!-- @click="add"> -->
				Make New Request
			</v-btn>
		</div>
		<br />
      		<h4>{{ message }}</h4>
      	<br />
	</v-container>
</template>