<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";
import SemesterServices from "../services/semesterServices.js";
import RequestServices from "../services/requestServices.js";
import UserServices from "../services/userServices.js";

const router = useRouter();

const message = ref("");
const authTitle = ref("You should not see this")
const firstHeader = ref("You should not see this");
const secondHeader = ref("You should not see this");
const thirdHeader = ref("You should not see this");

var tableEnable = true;
const user = Utils.getStore("user");

const semester = ref({name: "Please select a semester", id: null});
const semesters = ref([]);

const student = ref([]);
const request = ref([]);

//#region Auth Page
const authenTitle = async () => {
	try {
		switch (user.role)
		{
			case "Administrator":
				authTitle.value = "Administrator Home";
				firstHeader.value = "Students";
				secondHeader.value = "Semester";
				thirdHeader.value = "Status";
				tableEnable = true;
				break;
			case "Faculty":
				authTitle.value = "Faculty Home";
				firstHeader.value = "Students (NOT COMPLETE)"; // only display students that are in a shared course
				secondHeader.value = "Semester";
				tableEnable = true;
				break;
			case "Student":
				authTitle.value = "Student Home";
				firstHeader.value = "Semester";
				secondHeader.value = "Status";
				tableEnable = true;
				break;
			default:
				authTitle.value = "User Authentication Is Invalid";
				tableEnable = false;
				break;
		}	
  } catch (e) {
    message.value = e.response.data.message;
  }
};
//#endregion

const makeRequest = () => {
	const data = {
    	userId: user.userId,
		semesterId: semester.value.id,
		status: "Pending",
		requestDate: Date(),
  	};
	if (semester.value == null)
		message.value = "Please select a semester!";
	else
	{
		RequestServices.createRequest(data)
		.then((response) => {
		message.value = "Request Created!";
		})
		.catch((e) => {
		message.value = e.response.data.message;
		});
	}
};

const setAdminTable = () => {
	UserServices.getAllUsers()
        .then((response) => {
		  student.value = response.data.filter(item => item.role == "Student");
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

const setFacultyTable = () => {
	// UserServices.getAllUsers()
    //     .then((response) => {
	// 	  student.value = response.data.filter(item => item.role == "Student");
    //     })
    //     .catch((e) => {
    //       message.value = e.response.data.message;
    //     });
};

const setStudentTable = () => {
	RequestServices.getAllRequests()
        .then((response) => {
          request.value = response.data.filter(item => item.userId == user.userId);
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
};

const retrieveSemesters = () => {
	SemesterServices.getAllSemesters()
        .then((response) => {
          semesters.value = response.data;
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
}

onMounted(() => {
	authenTitle();
	retrieveSemesters();
	switch (user.role)
	{
		case "Administrator":
			setAdminTable();
			break;
		case "Faculty":
			setFacultyTable();
			break;
		case "Student":
			setStudentTable();
			break;
	}
});

</script>

<template>
	<v-container>
		<v-toolbar>
			<v-toolbar-title>{{ authTitle }}</v-toolbar-title>
		</v-toolbar>
		<br />
		<div v-if=tableEnable class="container">
			<h2> Accommodations</h2>
			<v-row v-if="(user.role == 'Student')"><v-col cols="3"><v-combobox label="Semester"
				v-model="semester" :items="semesters" item-title="name">
			</v-combobox>
			<v-btn :disabled="(new Date(semester.endDate) <= new Date()) || (semester.id == null)"
			color="success" class="mr-4" @click="makeRequest" >
				Make New Request
			</v-btn></v-col></v-row>
			<br />
			<v-table>
				<thead>
					<tr>
						<th class="text-left"> {{ firstHeader }}</th>
						<th class="text-left"> {{ secondHeader }}</th>
						<th v-if="(user.role == 'Administrator')" class="text-left" > {{ thirdHeader }}</th>
					</tr>
				</thead>
				<tbody v-if="(user.role == 'Administrator')">
					<tr v-for="item in request" :key="item.id">
						<td>{{ `${student.find(user => user.id == item.userId)?.fName} 
						${student.find (user => user.id == item.userId)?.lName}` }}</td>
						<td>{{ semesters.find(sem => sem.id == item.semesterId)?.name }}</td>
						<td>{{ item.status }}</td>
						<td><v-btn>view request</v-btn></td>
					</tr>
				</tbody>
				<tbody v-if="(user.role == 'Faculty')">
					<tr v-for="item in request" :key="item.id">
						<td>{{ `${student.find(user => user.id == item.userId)?.fName} 
						${student.find (user => user.id == item.userId)?.lName}` }}</td>
						<td>{{ semesters.find(sem => sem.id == item.semesterId)?.name }}</td>
						<td><v-btn>view request</v-btn></td>
					</tr>
				</tbody>
				<tbody v-if="(user.role == 'Student')">
					<tr v-for="item in request" :key="item.id">
						<td>{{ semesters.find(sem => sem.id == item.semesterId)?.name }}</td>
						<td>{{ request.find(request => request.id == item.id)?.status }}</td>
						<td><v-btn>view request</v-btn></td>
					</tr>
				</tbody>
			</v-table>

		</div>
		<br />
      		<h4>{{ message }}</h4>
			<h4>testing param 1: {{  }}</h4>
		<br />
			<h4>testing param 2: {{  }}</h4>
      	<br />
	</v-container>
</template>