<script setup>
import Utils from "../config/utils.js";
import RequestServices from "../services/requestServices";
import StudentAccomServices from "../services/studentAccomServices";
import AccomServices from "../services/accServices";
import UserServices from "../services/userServices";
import SemesterServices from "../services/semesterServices";
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

const userRole = Utils.getStore("user")?.role ?? "Student";
const request = ref({});
const student = ref({});
const studentAccom = ref({});
const semester = ref({});
const accoms = ref([]);
const selAccoms = ref([]);
const accomCats = ref([]);

// Gets list of all accommodation categories
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

// Gets all accommodations for student
const refreshAccoms = () => {
    AccomServices.getAllAccomodations()
        .then((response) => {
            const data = response.data.filter(accom => accom.studentAccomId == studentAccom.value.id);
            
            data.forEach(item => {
                const obj = {
                    id: item.id,
                    accomCatId: item.accomodationCatId,
                    accomCat: accomCats.value.find(cat => cat.id == item.accomodationCatId).name,
                    name: item.name,
                    description: accomCats.value.find(cat => cat.id == item.accomodationCatId).description,
                    pdf: item.pdf,
                    exists: true,
                };
                accoms.value.push(obj);
                selAccoms.value.push(obj);
            });

            // If the user is an admin, allow them to see all options for accommodations
            if (userRole == "Administrator")
            {
                accomCats.value.filter(cat => !accoms.value
                    .find(accom => accom.accomCatId == cat.id))
                    .forEach(cat => {
                        accoms.value.push({
                            id: null,
                            accomCatId: cat.id,
                            accomCat: cat.name,
                            name: cat.name,
                            description: cat.description,
                            pdf: null,
                            exists: false,
                        })
                    });
            }
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

// Gets the request which was sent in
const refreshRequest = () => {
    RequestServices.getRequest(props.requestId)
        .then((response) => {
            request.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

// Gets the semester for this request
const refreshSemester = () => {
    SemesterServices.getSemester(request.value.semesterId)
        .then((response) => {
            semester.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

// Gets the student who the request is for
const refreshStudent = () => {
    UserServices.getUser(props.studentId)
        .then((response) => {
            student.value = response.data;
        })    
        .catch((err) => {
            message.value = err.response.data.message;
        });    
};        

// Gets the student accommodation for the student in the specified semester
const refreshStudentAccom = () => {
    SemesterServices.getStudentAccomsForSemester(semester.value.id)
        .then((response) => {
            studentAccom.value = response.data.find(sAccom => sAccom.studentId == student.value.id);
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};    

// Saves the new request and updates the accommodations
const onSaveRequest = async () => {
    // Updates the status of the request
    request.value.status = selAccoms.value.length > 0 ? "Accepted" : "Declined";

    // Update request
    RequestServices.updateRequest(props.requestId, request.value)
        .then((response) => {
            
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
    
    // Make a new student accommodation if it doesn't already exist and if the request was accepted
    if (!studentAccom.value && request.value.status == "Accepted")
    {
        // Make new student accommodation object
        const newSA = {
            userId: student.value.id,
            semesterId: semester.value.id,
            metaData: null,
        };
        // Wait for student accommodation to be created before continuing
        await StudentAccomServices.createStudentAccomodation(newSA)
            .then((response) => {
                studentAccom.value = response.data;
            })
            .catch((err) => {
                message.value = err.response.data.message;
            })
    }

    // Add new accoms if in selAccoms, but doesn't exist yet
    const newAccoms = selAccoms.value
        .filter(selAccom => !selAccom.exists)
        .map(selAccom => {
            return {
                name: selAccom.name,
                pdf: selAccom.pdf,
                studentAccomId: studentAccom.value.id,
                accomodationCatId: selAccom.accomCatId,
            };
        });
    
    // If there are accommodations to add, add them
    if (newAccoms.length > 0)
    {
        console.log("Adding:")
        console.log(newAccoms)
        //AccomServices.createAccomodations(newAccoms)
        //    .then((response) => {
        //
        //    })
        //    .catch((err) => {
        //        message.value = err.response.data.message;
        //    });
    }
    
    // Delete accom if not in selAccoms, but in accoms
    const deletedAccoms = accoms.value
        .filter(accom => accom.exists && !selAccoms.value.find(selAccom => selAccom.id == accom.id))
        .map(accom => accom.id);
    
    // If there are accommodations to be deleted, delete them
    if (deletedAccoms.length > 0)
    {
        console.log("Deleting:")
        console.log(deletedAccoms)
        //AccomServices.deleteAccomodations(deletedAccoms)
        //    .then((response) => {
        //
        //    })
        //    .catch((err) => {
        //        message.value = err.response.data.message;
        //    });
    }

    refreshAll();
}

// Does nothing except navigate the user back to the home page
const onCancel = () => {
    router.push({ name: "home" });
};

// Refreshes everything that needs to be
const refreshAll = () => {
    refreshRequest();
    refreshStudent();
    refreshSemester();
    refreshACats();
    refreshStudentAccom();
    refreshAccoms();
};

onMounted(() => {
    refreshAll();
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
            <v-card-title
                v-if="userRole == 'Administrator' || request.status == 'Accepted'"
            >Accommodations:</v-card-title>
            <v-data-table
                v-if="userRole == 'Administrator' || request.status == 'Accepted'"
                v-model="selAccoms"
                :headers="[
                    { title: 'Name', align: 'start', key: 'accomCat'},
                    { title: 'Description', align: 'start', key: 'description' },
                    { title: 'PDF Link', align: 'start', key: 'pdf' }
                ]"
                :items="accoms"
                :sort-by="[{ key: 'accomCat', order: 'asc' }]"
                :items-per-page="10"
                return-object
                select-strategy="multiple"
                :show-select="userRole == 'Administrator'"
            ></v-data-table>
        </v-card>
        <br>
        <v-row justify="center">
            <v-col cols="1">
                <v-btn
                    v-if="userRole == 'Administrator'"
                    color="secondary"
                    :disabled="new Date(semester.endDate) > new Date()"
                    @click="onSaveRequest"
                >Save</v-btn>
            </v-col>
            <v-col cols="1">
                <v-btn
                    color="primary"
                    @click="onCancel"
                >{{ userRole == 'Administrator' ? "Cancel" : "Back" }}</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>

</style>