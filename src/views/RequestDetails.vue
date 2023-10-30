<script setup>
import Utils from "../config/utils.js";
import RequestServices from "../services/requestServices";
import StudentServices from "../services/studentServices";
import UserServices from "../services/userServices";
import SemesterServices from "../services/semesterServices";
import AccomServices from "../services/accServices";
import ACatServices from "../services/accCatServices";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
    studentId: {
        required: true,
    },
    requestId: {
        required: true,
    },
});
const message = ref("Add, Edit or Delete Lessons");

const request = ref({});
const student = ref({});
const semester = ref({});
const accoms = ref([]);
const accomCats = ref([]);
const selAccoms = ref([]);

const refreshACats = () => {
    ACatServices.getAllAccomodationCats()
        .then((response) => {
            accomCats.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

const refreshAccoms = () => {
    AccomServices.getAllAccomodations()
        .then((response) => {
            accoms.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

const refreshRequest = () => {
    RequestServices.getRequest(props.requestId)
        .then((response) => {
            request.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

const refreshStudent = () => {
    //StudentServices.getStudent(props.studentId)
    UserServices.getUser(props.studentId)
        .then((response) => {
            student.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

const refreshSemester = () => {
    SemesterServices.getSemester(request.semesterId)
        .then((response) => {
            semester.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

const onSaveRequest = () => {
    if (request.value.status == "Pending")
    {

    }

    RequestServices.updateRequest(props.requestId)
        .then((response) => {
            
        })
        .catch((err) => {
            message.value = err.response.data.message;
        })
}

onMounted(() => {
    refreshRequest();
    refreshStudent();
    refreshSemester();
    refreshACats();
    refreshAccoms();
});
</script>

<template>
    <v-container>
        <v-card>
            <v-card-title class="text-h4">Request Details</v-card-title>
            <v-card-title>Student: {{ `${student.fName} ${student.lName}` }}</v-card-title>
            <v-card-title>Semester: {{ `${semester.name}` }}</v-card-title>
            <v-card-title>Request Status: {{ request.status }}</v-card-title>
            <br>
            <v-card-title>Accommodations:</v-card-title>
            <v-data-table></v-data-table>
        </v-card>
        <br>
        <v-row justify="center">
            <v-col cols="1">
                <v-btn color="secondary" @click="onSaveRequest">Save</v-btn>
            </v-col>
            <v-col cols="1">
                <v-btn color="secondary">Cancel</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>

</style>