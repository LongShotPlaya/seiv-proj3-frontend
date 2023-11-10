<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { VDataTable } from 'vuetify/labs/VDataTable'
import Utils from "../config/utils.js";
import SemesterServices from "../services/semesterServices.js";
import RequestServices from "../services/requestServices.js";
import UserServices from "../services/userServices.js";

const router = useRouter();

const message = ref("");
const reqmessage = ref("");
const authTitle = ref("You should not see this")

var tableEnable = true;
const user = Utils.getStore("user");

const semester = ref({name: "Please select a semester", id: null});
const semesters = ref([]);
const student = ref([]);
const request = ref([]);

const search = ref('');
const adminItems = ref([]);
const facultyItems = ref([]);
const studentItems = ref([]);
let adminHeaders = [
	{ key: 'StudentId', title: 'Student Id' },
	{ key: 'StudentName', title: 'Student Name' },
	{ key: 'SemesterName', title: 'Semester' },
	{ key: 'Status', title: 'Status' },
];
let facultyHeaders = [
	{ key: 'StudentId', title: 'Student Id' },
	{ key: 'StudentName', title: 'Student Name' },
	{ key: 'SemesterName', title: 'Semester' },
];
let studentHeaders = [
	{ key: 'SemesterName', title: 'Semester' },
	{ key: 'Status', title: 'Status' },
];

const retrieveSemesters = async () => {
	await SemesterServices.getAllSemesters()
        .then((response) => {
          semesters.value = response.data;
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
}

const makeRequest = () => {
	const data = {
    	userId: user.userId,
		semesterId: semester.value.id,
		status: "Pending",
		requestDate: Date(),
  	};
	if (semester.value == null)
		reqmessage.value = "Please select a semester!";
	else
	{
		RequestServices.createRequest(data)
		.then((response) => {
		reqmessage.value = "Request Created!";
		})
		.catch((e) => {
		message.value = e.response.data.message;
		});
	}
};

const setAdminTable = async () => {
	await UserServices.getAllUsers()
        .then((response) => {
		  student.value = response.data.filter(item => item.role == "Student");
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
	await RequestServices.getAllRequests()
        .then((response) => {
          request.value = response.data;
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
	for (let i = 0; i < request.value.length; i++)
	{
		let requ = {};
		requ = request.value[i];
		const data = {
    	StudentId: student.value.find(stu => stu.id == requ.userId)?.id,
		StudentName: `${student.value.find(stu => stu.id == requ.userId)?.fName} ${student.value.find(stu => stu.id == requ.userId)?.lName}`,
		SemesterName: semesters.value.find(sem => sem.id == requ.semesterId)?.name,
		Status: requ.status,
  		};
		console.log("IT WORKS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! YEEEEEEEEEEEEEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAAAAAAAAA");
		adminItems.value.push(data);
	}
};

const setFacultyTable = async () => {
	await UserServices.getAllUsers()
        .then((response) => {
		  student.value = response.data.filter(item => item.role == "Student"); // still needs to filter students in the teacher's class maybe
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
	await RequestServices.getAllRequests()
        .then((response) => {
          request.value = response.data.filter(item => item.status == "Accepted");
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
	for (let i = 0; i < request.value.length; i++)
	{
		let requ = {};
		requ = request.value[i];
		const data = {
    	StudentId: student.value.find(stu => stu.id == requ.userId)?.id,
		StudentName: `${student.value.find(stu => stu.id == requ.userId)?.fName} ${student.value.find(stu => stu.id == requ.userId)?.lName}`,
		SemesterName: semesters.value.find(sem => sem.id == requ.semesterId)?.name,
  		};
		console.log("IT WORKS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! YEEEEEEEEEEEEEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAAAAAAAAA");
		facultyItems.value.push(data);
	}
};

const setStudentTable = async () => {
	await RequestServices.getAllRequests()
        .then((response) => {
          request.value = response.data.filter(item => item.userId == user.userId);
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
		for (let i = 0; i < request.value.length; i++)
	{
		let requ = {};
		requ = request.value[i];
		const data = {
		SemesterName: semesters.value.find(sem => sem.id == requ.semesterId)?.name,
		Status: requ.status,
  		};
		console.log("IT WORKS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! YEEEEEEEEEEEEEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAAAAAAAAA");
		studentItems.value.push(data);
	}
};

onMounted(() => {
	retrieveSemesters();
	try {
		switch (user.role)
		{
			case "Administrator":
				authTitle.value = "Administrator Home";
				setAdminTable();
				break;
			case "Faculty":
				authTitle.value = "Faculty Home";
				setFacultyTable();
				break;
			case "Student":
				authTitle.value = "Student Home";
				setStudentTable();
				break;
			default:
				authTitle.value = "User Authentication Is Invalid";
				console.log("User Authentication Is Invalid");
				tableEnable = false;
				break;
		}
	} catch (e) {
    	message.value = e.response.data.message;
  	}
});
</script>

<template>
	<v-container>
		<v-toolbar>
			<v-toolbar-title>{{ authTitle }}</v-toolbar-title>
		</v-toolbar>
		<div v-if=tableEnable class="container">
			<br />
			<v-row><v-col cols="3">
				<v-text-field label="Search" v-model="search" append-icon="mdi-magnify"
				single-linehide-details>
			</v-text-field></v-col></v-row>
			
			<v-card>
				<v-data-table v-if="(user.role == 'Administrator')"
				:headers="adminHeaders"
				:items="adminItems"
				:search="search">
				</v-data-table>
				<v-data-table v-if="(user.role == 'Faculty')"
				:headers="facultyHeaders"
				:items="facultyItems"
				:search="search">
				</v-data-table>
				<v-data-table v-if="(user.role == 'Student')"
				:headers="studentHeaders"
				:items="studentItems"
				:search="search">
				</v-data-table>
			</v-card>
		</div>
		<br />
		<v-row v-if="(user.role == 'Student')"><v-col cols="3"><v-combobox label="Semester"
			v-model="semester" :items="semesters" item-title="name">
			</v-combobox>
			<v-btn :disabled="(new Date(semester.endDate) <= new Date()) || (semester.id == null)"
			color="success" class="mr-4" @click="makeRequest">
			Make New Request
		</v-btn></v-col></v-row>
		<div>
			<h4>{{ reqmessage }}</h4>
		</div>
	</v-container>
</template>