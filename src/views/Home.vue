<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { VDataTable } from 'vuetify/labs/VDataTable'
import Utils from "../config/utils.js";
import SemesterServices from "../services/semesterServices.js";
import RequestServices from "../services/requestServices.js";
import UserServices from "../services/userServices.js";
import StudentAcc from "../components/StudentAcc.vue";
import notificationServices from "../services/notificationServices";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("");

const semester = ref({name: "Select a semester", id: null});
const semesters = ref([]);
const studentReqs = ref({fullName: "Select a student"});
const studentList = ref([]);
const students = ref([]);
const requests = ref([]);

const search = ref("");
const headers = [
	{ key: 'fullName', title: 'Student Name', align: "start", sortable: false },
	{ key: 'email', title: 'Student Email', align: "start", sortable: false },
	{ key: 'semester', title: 'Semester', align: "start", sortable: false },
].concat(user?.role == "Administrator" ? { key: 'status', title: 'Status', align: "start", sortable: false } : {},
	{ key: 'actions', title: 'Actions', align: 'start', sortable: false }
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
			requests.value = response.data;
		})
		.catch((err) => {
			message.value = err.response.data.message;
			error = true;
		})
};

// Gets the list of all students
const retrieveStudents = async () => {
	if (!user?.role) return;

	let tempStudents = [];
	if (user.role == "Administrator")
	{
		await UserServices.getAllUsers()
			.then((response) => {
				tempStudents = response.data.filter(user => user.role == "Student");
				studentList.value = tempStudents.map(stu => { return {...stu, fullName:`${stu.fName} ${stu.lName}` }; });
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
					tempStudents = response.data;
				})
				.catch((err) => {
					message.value = err.response.data.message;
				});
		}
	}
	else
	{
		tempStudents = [{...user, id: user.userId}];
	}

	students.value = [];
	requests.value.forEach(request => {
		const stu = tempStudents.find(stu => stu.id == request.userId);
		if (!!stu) students.value.push({
			...stu,
		
			fullName: `${stu.fName} ${stu.lName}`,
			semester: semesters.value.find(sem => request.semesterId == sem.id).name,
			status: request.status,
			requestId: request.id,
			requestDate: request.requestDate,
		});
	});
	if (user.role != 'Administrator' && user.role != 'Faculty') studentReqs.value = tempStudents[0];
	requests.value = requests.value.filter(request => !!students.value.find(stu => stu.id == request.userId));
};

// Makes a new request for a user
const makeRequest = async () => {
	if (!semester.value?.id || (!user.userId && !studentReqs.value?.id)) return
	const data = {
    	userId: studentReqs.value.id,
		semesterId: semester.value.id,
		status: "Pending",
		requestDate: Date(),

		...getMessage(studentReqs.value.email)
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
			refreshAll();
		})
		.catch((e) => {
			message.value = e.response.data.message;
		});
};

// Determines what the message to the user should say
const getMessage = (userEmail) => {
	const fromAdmin = user.role == 'Administrator';
	const fromUser = fromAdmin ? `${user.fName} ${user.lName}` : `Student Accommodations`;
	return {
		fromUser,
		toUsers: userEmail,
		message: {
			subject: `Initial Accommodations Request Email`,
			text: `Thank you for submitting your request for accommodations. We require supporting
			documentation to fulfill your request.\n\nDocumentation must be from an appropriate,
			qualified professional who has seen you within the past 18 months and must contain
			the following information:\n\n1. You are a person with a disability.\n2. The diagnosis
			(what is the disability?)\n3. Information about the necessary classroom accommodations
			you will need to successfully complete the semester. There must be a nexus between the
			disability and the accommodations requested.\n4. Name and credentials (license #, etc.)
			of the diagnostic clinician.\n\nDocumentation may be emailed to ${fromAdmin ? `me` : `us`},
			but it must be on official letterhead. If your doctor's office is unwilling to email
			${fromAdmin ? `me` : `us`} (this is the most likely scenario), they may mail the document
			to you. Then, scan and email it to ${fromAdmin ? `me` : `us`}.\n\nOnce the information is
			submitted, we will schedule a time to meet to discuss the details (in person or via video
			conference). After our meeting, ${fromAdmin ? `I` : `we`} will email your professors your
			specific ADA academic accommodations letter. Accommodations MUST BE RENEWED EACH SEMESTER.
			\n\nPlease let ${fromAdmin ? `me` : `us`} know if you have any other questions or concerns.
			${fromAdmin ? `I` : `We`} look forward to hearing from you.\n\nYou can check the status of
			your request at any time by visiting the student accommodations website
			here(https://project3.eaglesoftwareteam.com/2023/project3/t3/) or you can reach out to
			${fromAdmin ? `me directly at my email: ${user.email}` : `us at this email`}.\n\nSincerely,
			\n\n${fromUser}`,
			html: `Thank you for submitting your request for accommodations. We require supporting
			documentation to fulfill your request.<br><br>Documentation must be from an appropriate,
			qualified professional who has seen you within the past 18 months and must contain
			the following information:<br><br><ol><li>You are a person with a disability.</li>
			<li>The diagnosis (what is the disability?)</li><li>Information about the necessary classroom
			accommodations you will need to successfully complete the semester. There must be a nexus
			between the disability and the accommodations requested.</li><li>Name and credentials
			(license #, etc.) of the diagnostic clinician.</li></ol><br><br>Documentation may be
			emailed to ${fromAdmin ? `me` : `us`}, but it must be on official letterhead. If your
			doctor's office is unwilling to email ${fromAdmin ? `me` : `us`} (this is the most likely
			scenario), they may mail the document to you. Then, scan and email it to ${fromAdmin ? `me` : `us`}.
			<br><br>Once the information is submitted, we will schedule a time to meet to discuss the
			details (in person or via video conference). After our meeting, ${fromAdmin ? `I` : `we`}
			will email your professors your specific ADA academic accommodations letter. Accommodations
			<b>MUST BE RENEWED EACH SEMESTER</b>.<br><br>Please let ${fromAdmin ? `me` : `us`} know
			if you have any other questions or concerns. ${fromAdmin ? `I` : `We`} look forward to
			hearing from you.<br><br>You can check the status of your request at any time by visiting
			the student accommodations website <a href="https://project3.eaglesoftwareteam.com/2023/project3/t3/">here</a>
			or you can reach out to ${fromAdmin ? `me directly at my email:
			<a href="mailto:${user.email}">${user.email}</a>` : `us at this email`}.<br><br>Sincerely,
			<br><br>${fromUser}`,
		}
	};
};

// Sends a message to the student without making a new request
const notify = (userEmail) => {
	UserServices.sendMail(getMessage(userEmail))
		.then((response) => {
			
		})
		.catch((err) => {
			message.value = err.response.data.message;
		});
};

// Refreshes necessities
const refreshAll = async () => {
	await retrieveRequests();
	await retrieveStudents();
};

const nothing = () => {

};

onMounted(async () => {
	if (!user?.role) router.push({ name: "login" });
	await retrieveSemesters();
	refreshAll();
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
					:sort-by="[{ key: 'requestDate', order: 'desc' }]"
					:search="search"
				>
					<template v-slot:item.actions="{ item }">
						<v-row justify="center">
							<v-btn
								color="secondary"
								@click="router.push({ name: 'requestDetails', params: {studentId: item.raw.id, requestId: item.raw.requestId}})"
							>View</v-btn>
							<v-col v-if="user.role == 'Administrator'" cols="1"></v-col>
							<v-btn
								v-if="user.role == 'Administrator'"
								color="primary"
								@click="notify(item.raw.email)"
							>Notify</v-btn>
						</v-row>
					</template>
				</v-data-table>
				<StudentAcc v-else-if="user.role == 'Student'" :user-id="user.userId" />
				<br>
			</v-card>
		</div>
		<br>
		<v-card>
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
						@input="user.role == 'Faculty' ? refreshAll() : nothing()"
						item-title="name"
					></v-combobox>
				</v-col>
				<v-col v-if="user.role == 'Administrator'" cols="5">
					<v-combobox
						label="Student"
						v-model="studentReqs"
						:items="studentList"
						item-title="fullName"
					></v-combobox>
				</v-col>
				<v-col cols="2" v-if="user.role == 'Student' || user.role == 'Administrator'">
					<v-btn
						:disabled="!semester?.id || !studentReqs?.id || (user.role == 'Student' && !!requests.find(request => request.userId == user.userId && request.semesterId == semester?.id))"
						color="success"
						class="mr-4"
						@click="makeRequest"
					>Make New Request</v-btn>
				</v-col>
			</v-row>
		</v-card>
	</v-container>
</template>