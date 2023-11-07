<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";
import SemesterServices from "../services/semesterServices.js";
import RequestServices from "../services/requestServices.js";
import StudentAccomServices from "../services/studentAccomServices.js";
import UserServices from "../services/userServices.js";

const router = useRouter();

const message = ref("");
const authTitle = ref("You should not see this")
const firstHeader = ref("You should not see this");
const secondHeader = ref("You should not see this");
const thirdHeader = ref("You should not see this");

const view = ref(-1);
var thirdHead = false;
var tableEnable = true;
const user = Utils.getStore("user");

const semester = ref({name: "Please select a semester", id: -1});
const semesters = ref([]);

//const adminTable = ref([]);
const student = ref([]);
const accommodation = ref([]);
const request = ref([]);

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

const makeRequest = () => {
	const data = {
    	userId: user.userId,
		semesterId: semester.value.id,
		status: "Pending",
		requestDate: Date(),
  	};
	console.log(data.semesterId)
	if (semester.value == null)
		message.value = "Please select a semester!";
	else
	{
		RequestServices.createRequest(data)
		.then((response) => {
		//request.value.id = response.data.id;
		message.value = "Request Created!";
		})
		.catch((e) => {
		message.value = e.response.data.message;
		});
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

const setAdminTable = () => {
	// for loop through all students
	// get student (can be multiple students)
	// get the accommodation
	// get the accommodation status
    StudentAccomServices.getAllStudentAccomodations()
        .then((response) => {
          accommodation.value = response.data;
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
	UserServices.getAllUsers()
        .then((response) => {
          student.value = response.data;
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
	RequestServices.getAllRequests()
        .then((response) => {
          request.value = response.data;
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
		<div v-if=tableEnable class="container">
			<h2> Accommodations</h2><!-- For {{ semesterTitle }}</h2> -->
			<v-combobox label="Semester" v-model="semester" :items="semesters"
			item-title="name">
			</v-combobox>
			<v-table>
				<thead>
					<tr>
						<th class="text-left"> {{ firstHeader }}</th>
						<th class="text-left"> {{ secondHeader }}</th>
						<th v-if=thirdHead class="text-left" > {{ thirdHeader }}</th>
					</tr>
				</thead>
				<tbody>
				<tr v-if=thirdHead>
					<td>{{ student.name }}</td>
					<td>{{ accommodation.name }}</td>
					<td>{{ request.status }}</td>
				</tr>
				</tbody>
			</v-table>
			<v-btn color="success" class="mr-4" @click="makeRequest">
				Make New Request
			</v-btn>
		</div>
		<br />
      		<h4>{{ message }}</h4>
			<h4>semester id: {{ semester.id }}</h4>
			<h4>user id: {{ user.userId }}</h4>
      	<br />
	</v-container>
</template>