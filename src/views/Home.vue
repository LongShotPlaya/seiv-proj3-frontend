<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { VDataTable } from 'vuetify/labs/VDataTable'
import Utils from "../config/utils.js";
import SemesterServices from "../services/semesterServices.js";
import RequestServices from "../services/requestServices.js";
import UserServices from "../services/userServices.js";
import StudentAcc from "../components/StudentAcc.vue";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("");

const semester = ref({name: "Select a semester", id: null});
const semesters = ref([]);
const student = ref({fullName: "Select a student"});
const students = ref([]);
const requests = ref([]);

const search = ref("");
const headers = [
	{ key: 'fullName', title: 'Student Name', align: "start" },
	{ key: 'email', title: 'Student Email', align: "start" },
	{ key: 'semester', title: 'Semester', align: "start" },
].concat(user?.role == "Administrator" ? { key: 'status', title: 'Status', align: "start" } : {},
	{ key: 'actions', title: 'Actions', align: 'start' }
);

// Gets the list of all semesters
const retrieveSemesters = async () => {
	await SemesterServices.getAllSemesters()
        .then((response) => {
        	semesters.value = response.data;
			semester.value = semesters.value.find(sem => new Date(sem.startDate) < new Date() && new Date(sem.endDate) > new Date());
        })
        .catch((e) => {
        	message.value = e.response.data.message;
        });
};

// Gets the list of all (relevant) requests
const retrieveRequests = async () => {
	await RequestServices.getAllRequests()
		.then((response) => {
			requests.value = response.data.filter(request => students.value.find(stu => {
				const result = stu.id == request.userId;
				if (result)
				{
					stu.semester = semesters.value.find(sem => request.semesterId == sem.id).name;
					stu.status = request.status;
					stu.requestId = request.id;
				}
				return result;
			}));
		})
		.catch((err) => {
			message.value = err.response.data.message;
			error = true;
		})
};

// Gets the list of all students
const retrieveStudents = async () => {
	if (!user?.role) return;

	if (user.role == "Administrator")
	{
		await UserServices.getAllUsers()
			.then((response) => {
				students.value = response.data.filter(user => user.role == "Student");
			})
			.catch((err) => {
				message.value = err.response.data.message;
			})
	}
	else if (user.role == "Faculty")
	{
		const currDate = new Date();
		const currSemester = semesters.value.find(sem => new Date(sem.startDate) < currDate && new Date(sem.endDate) > currDate)
		if (!!currSemester)
		{
			await UserServices.getStudents(user.userId, currSemester.id)
				.then((response) => {
					students.value = response.data;
				})
				.catch((err) => {
					message.value = err.response.data.message;
				});
		}
	}
	else
	{
		students.value = [{...user, id: user.userId}];
		student.value = sutdents.value[0];
	}

	students.value = students.value.map(stu => {
		return {
			...stu,

			fullName: `${stu.fName} ${stu.lName}`,
			semester: ``,
			status: ``,
			requestId: null,
		};
	});
};

// Makes a new request for a user
const makeRequest = async () => {
	if (!semester.value?.id || (!user.userId && !student.value?.id)) return
	const data = {
    	userId: user.role == 'Administrator' ? student.value.id : user.userId,
		semesterId: semester.value.id,
		status: "Pending",
		requestDate: Date(),
  	};
	
	// If the request already exists, direct the user to it instead of making a new one
	if (!!requests.value.find(request => request.userId == data.userId && request.semesterId == data.semesterId)) {
		message.value = "A request already exists for this user during this semester!";
		search.value = students.value.find(stu => stu.id == data.userId).fullName;
		return;
	}
	RequestServices.createRequest(data)
		.then((response) => {
			// Let the user know that the request was created
		})
		.catch((e) => {
			message.value = e.response.data.message;
		});
};

onMounted(async () => {
	if (!user?.role) router.push({ name: "login" });
	await retrieveSemesters();
	await retrieveStudents();
	retrieveRequests();
});
</script>

<template>
	<v-container>
		<v-toolbar>
			<v-toolbar-title>{{ user.role + " Home" }}</v-toolbar-title>
		</v-toolbar>
		<div class="container">
			<v-card>
				<br>
				<v-row justify="center">
					<v-spacer />
					<v-col justify="center" cols="3">
						<v-card-title style="font-size: 20pt;">
							{{ user?.role == 'Student' ? "Your Accommodations" : "Student Accommodations" }}
						</v-card-title>
					</v-col>
					<v-col cols="6" v-if="user?.role == 'Administrator' || user?.role == 'Faculty'">
						<v-text-field
							label="Search"
							v-model="search"
							prepend-inner-icon="mdi-magnify"
							single-linehide-details
						/>
					</v-col>
					<v-spacer />
				</v-row>
				<br>
				<v-data-table v-if="user.role == 'Administrator' || user.role == 'Faculty'"
					:headers="headers"
					:items="students"
					:sort-by="[{ key: 'semester', order: 'desc' }]"
					:search="search"
				>
					<template v-slot:item.actions="{ item }">
						<v-btn
							color="secondary"
							@click="router.push({ name: 'requestDetails', params: {studentId: item.raw.id, requestId: item.raw.requestId}})"
						>View</v-btn>
					</template>
				</v-data-table>
				<StudentAcc v-else-if="user.role == 'Student'" :user-id="user.userId" />
				<br>
			</v-card>
		</div>
		<br>
		<v-card v-if="user.role == 'Student' || user.role == 'Administrator'">
			<br>
			<v-row justify="center">
				<v-card-title style="font-size: 16pt;">Make a New Request</v-card-title>
			</v-row>
			<v-row justify="center">
				<v-col cols="3">
					<v-combobox 
						label="Semester"
						v-model="semester"
						:items="semesters.filter(sem => new Date(sem.endDate) > new Date())"
						item-title="name"
					></v-combobox>
				</v-col>
				<v-col v-if="user.role == 'Administrator'" cols="5">
					<v-combobox
						label="Student"
						v-model="student"
						:items="students"
						item-title="fullName"
					></v-combobox>
				</v-col>
				<v-col cols="2">
					<v-btn
						:disabled="!semester?.id || !student?.id || (user.role == 'Student' && !requests.find(request => request.userId == user.userId && request.semesterId == semester?.id))"
						color="success"
						class="mr-4"
						@click="makeRequest"
					>Make New Request</v-btn>
				</v-col>
			</v-row>
		</v-card>
	</v-container>
</template>