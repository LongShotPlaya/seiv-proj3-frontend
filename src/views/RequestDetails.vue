<script setup>
import Utils from "../config/utils.js";
import RequestServices from "../services/requestServices";
import StudentServices from "../services/studentServices";
import StudentAccomServices from "../services/studentAccomServices";
import UserServices from "../services/userServices";
import SemesterServices from "../services/semesterServices";
import AccomServices from "../services/accServices";
import ACatServices from "../services/accCatServices";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
// This seems to require manual importing for some reason
import { VDataTable } from "vuetify/labs/VDataTable";

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

const userRole = ref("Student");
const request = ref({});
const student = ref({});
const studentAccoms = ref([]);
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
            console.log(err)
            message.value = err.response.data.message;
        });
};

const refreshAccoms = () => {
    AccomServices.getAllAccomodations()
        .then((response) => {
            let data = response.data.map(item => { return {...item, accomCat: accomCats.value.find(cat => item.accomodationCatId == cat.id)} });
            if (userRole.value != "Administrator")
                data = response.data.filter(accom => !!studentAccoms.value.find(sAccom => sAccom.accomodationId == accom.id));
            accoms.value = data;
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

const refreshRole = () => {
    userRole.value = Utils.getStore("user").role;
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

const refreshStudentAccoms = () => {
    SemesterServices.getStudentAccomsForSemester(semester.value.id)
        .then((response) => {
            studentAccoms.value = response.data.filter(sAccom => {
                let result = sAccom.studentId == student.value.id;
                if (result) selAccoms.value.push(accoms.value.find(accom => accom.id == sAccom.accomodationId));
                return result;
            });
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};    

const onSaveRequest = () => {
    if (request.value.status == "Pending")
        request.value.status = selAccoms.value.length > 0 ? "Accepted" : "Declined";

    RequestServices.updateRequest(props.requestId, request.value)
        .then((response) => {
            
        })
        .catch((err) => {
            message.value = err.response.data.message;
        })

    // Add new accoms if in selAccoms, but not in studentAccoms
    let newAccoms = selAccoms.value
        .filter(accom => !studentAccoms.value.find(sAccom => sAccom.accomodationId == accom.id))
        .map(accom => {
            return {
                accomodationId: accom.id,
                studentId: student.value.id,
                semesterId: semester.value.id,
                metaData: null
            };
        });
    
    if (newAccoms.length > 0)
    {
        StudentAccomServices.createStudentAccomodations(newAccoms)
            .then((response) => {

            })
            .catch((err) => {
                message.value = err.response.data.message;
            });
    }
    
    // Delete accom if not in selAccoms, but in studentAccoms
    let deletedAccoms = studentAccoms.value
        .filter(sAccom => !selAccoms.value.find(accom => accom.id == sAccom.accomodationId))
        .map(sAccom => sAccom.id);
    
    if (deletedAccoms.length > 0)
    {
        StudentAccomServices.deleteStudentAccomodations(deletedAccoms)
            .then((response) => {
        
            })
            .catch((err) => {
                message.value = err.response.data.message;
            });
    }
}

const onCancel = () => {
    router.push({ name: "home" });
};

onMounted(() => {
    refreshRole();
    refreshRequest();
    refreshStudent();
    refreshSemester();
    refreshACats();
    refreshStudentAccoms();
    refreshAccoms();
});
</script>

<template>
    <v-container>
        <v-card>
            <v-card-title class="text-h4">Request Details</v-card-title>
            <v-card-title>Student: {{ `${student.fName} ${student.lName}` }}</v-card-title>
            <v-card-title>Semester: {{ `${semester.name}` }}</v-card-title>
            <v-card-title>Requested On: {{ `${request.requestDate}` }}</v-card-title>
            <v-card-title>Request Status: {{ request.status }}</v-card-title>
            <br>
            <v-card-title>Accommodations:</v-card-title>
            <v-data-table
                v-if="userRole == 'Administrator' || request.status == 'Accepted'"
                v-model="selAccoms"
                :headers="[
                    { title: 'Name', align: 'start', key: 'name'},
                    { title: 'Category', align: 'end', key: 'accomCat' }
                ]"
                :items="accoms"
                :sort-by="[{ key: 'name', order: 'asc' }]"
                :items-per-page="10"
                return-object
                select-strategy="multiple"
                :show-select="userRole == 'Administrator'"
            ></v-data-table>
        </v-card>
        <br>
        <v-row justify="center">
            <v-col cols="1">
                <v-btn color="secondary" @click="onSaveRequest" v-if="userRole == 'Administrator'">Save</v-btn>
            </v-col>
            <v-col cols="1">
                <v-btn color="secondary" @click="onCancel">{{ userRole == 'Administrator' ? "Cancel" : "Back" }}</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>

</style>