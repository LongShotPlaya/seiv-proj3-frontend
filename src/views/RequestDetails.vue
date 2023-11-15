<script setup>
import Utils from "../config/utils.js";
import RequestServices from "../services/requestServices";
import StudentAccomServices from "../services/studentAccomServices";
import AccomServices from "../services/accServices";
import UserServices from "../services/userServices";
import SemesterServices from "../services/semesterServices";
import ACatServices from "../services/accCatServices";
import NotificationServices from "../services/notificationServices";
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

const user = Utils.getStore("user");
const userRole = user?.role ?? "Student";
const request = ref({});
const student = ref({});
const studentAccom = ref({});
const semester = ref({});
const accoms = ref([]);
const selAccoms = ref([]);
const accomCats = ref([]);

// Gets list of all accommodation categories
const refreshACats = async () => {
    await ACatServices.getAllAccomodationCats()
        .then((response) => {
            accomCats.value = response.data;
        })
        .catch((err) => {
            console.log(err)
            message.value = err.response.data.message;
        });
};

// Gets all accommodations for student
const refreshAccoms = async () => {
    await AccomServices.getAllAccomodations()
        .then((response) => {
            const data = response.data.filter(accom => accom.studentAccomId == (studentAccom.value?.id ?? -1));
            accoms.value = [];
            selAccoms.value = [];

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
const refreshRequest = async () => {
    await RequestServices.getRequest(props.requestId)
        .then((response) => {
            request.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

// Gets the semester for this request
const refreshSemester = async () => {
    await SemesterServices.getSemester(request.value.semesterId)
        .then((response) => {
            semester.value = response.data;
        })
        .catch((err) => {
            message.value = err.response.data.message;
        });
};

// Gets the student who the request is for
const refreshStudent = async () => {
    await UserServices.getUser(props.studentId)
        .then((response) => {
            student.value = response.data;
        })    
        .catch((err) => {
            message.value = err.response.data.message;
        });    
};        

// Gets the student accommodation for the student in the specified semester
const refreshStudentAccom = async () => {
    await SemesterServices.getStudentAccomsForSemester(semester.value.id)
        .then((response) => {
            studentAccom.value = response.data.find(sAccom => sAccom.userId == student.value.id);
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
        AccomServices.createAccomodations(newAccoms)
            .then((response) => {
        
            })
            .catch((err) => {
                message.value = err.response.data.message;
            });
    }
    
    // Delete accom if not in selAccoms, but in accoms
    const deletedAccoms = accoms.value
        .filter(accom => accom.exists && !selAccoms.value.find(selAccom => selAccom.id == accom.id))
        .map(accom => accom.id);
    
    // If there are accommodations to be deleted, delete them
    if (deletedAccoms.length > 0)
    {
        AccomServices.deleteAccomodations(deletedAccoms)
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                message.value = err.response.data.message;
            });
    }

    refreshAll();
}

// Does nothing except navigate the user back to the home page
const onCancel = () => {
    router.push({ name: "home" });
};

// Sends an email to notify faculty of student's accommodations
const notify = async () => {
    let faculty = "";
    let error = false;
    await UserServices.getProfessors(student.value.id, semester.value.id)
        .then((response) => {
            faculty = response.data.map(fac => fac.email).join(",");
        })
        .catch((err) => {
            message.value = err.response.data.message;
            error = true;
        });
    if (error) return;

    const notification = {
        studentAccomId: studentAccom.value.id,
        email: `${faculty},${student.value.email},${user.email}`,
        fromUser: `${user.fName} ${user.lName}`,
        message: {
            subject: "Notification of Student Accommodations",
            text: `This email is to let you know that ${student.value.fName} ${student.value.lName},
            who has one or more of your classes this semester of ${semester.value.name}, qualifies
            and has been approved for the following accommodation(s):\n${accoms.value.filter(accom => accom.exists).map(accom => ` - ${accom.accomCat}\n`)}
            We ask that you provide the accommodation(s) above and if you have any questions, please feel
            free to reach out to me at this email: ${user.email}.\nIf you already have an account in the
            student accommodations website, you can access it here (https://project3.eaglesoftwareteam.com/2023/project3/t3/)
            and view your students' accommodations for this semester. If you don't already have an account,
            you can log into the website and an account will be made for you. If you are faculty, you'll also
            need to email me so that I can set up your account properly.\n\nThank you,\n\n${user.fName} ${user.lName}`,

            html: `This email is to let you know that <b>${student.value.fName} ${student.value.lName}</b>,
            who has one or more of your classes this semester of <b>${semester.value.name}</b>, qualifies
            and has been approved for the following accommodation(s):<br><ul>${accoms.value.filter(accom => accom.exists).map(accom => `<li>${accom.accomCat}</li>`)}
            </ul><br>We ask that you provide the accommodation(s) above and if you have any questions, please feel
            free to reach out to me at this email: <a href="mailto:${user.email}">${user.email}</a>.<br>
            If you already have an account in the student accommodations website, you can access it
            <a href="https://project3.eaglesoftwareteam.com/2023/project3/t3/">here</a> and view your
            students' accommodations for this semester. If you don't already have an account,
            you can log into the website and an account will be made for you. If you are faculty, you'll also
            need to email me so that I can set up your account properly.<br><br>Thank you,<br>
            <br>${user.fName} ${user.lName}`
        }
    }
    NotificationServices.createNotification(notification)
        .then((response) => {
            // Let the user know that their notification was sent successfully
        })
        .catch((err) => {
            message.value = err.response.data.message;
        })
};

// Refreshes everything that needs to be
const refreshAll = async () => {
    await refreshRequest();
    await refreshStudent();
    await refreshSemester();
    await refreshACats();
    await refreshStudentAccom();
    await refreshAccoms();
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
            <v-card-title>Requested On: {{ `${new Date(request.requestDate).toLocaleDateString()}` }}</v-card-title>
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
                    :disabled="new Date(semester.endDate) <= new Date()"
                    @click="onSaveRequest"
                >Save</v-btn>
            </v-col>
            <v-col cols="1">
                <v-btn
                    color="primary"
                    @click="onCancel"
                >{{ userRole == 'Administrator' ? "Cancel" : "Back" }}</v-btn>
            </v-col>
            <v-spacer v-if="userRole == 'Administrator'" cols="1"></v-spacer>
            <v-col v-if="userRole == 'Administrator'" cols="2">
                <v-btn
                    color="primary"
                    :disabled="!studentAccom?.id || request?.status != 'Accepted'"
                    @click="notify"
                >Notify Faculty</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>

</style>