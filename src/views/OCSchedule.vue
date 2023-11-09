<script setup>
import SemesterServices from "../services/semesterServices";
import CourseServices from "../services/courseServices";
import CSServices from "../services/courseScheduleServices";
import FacultyServices from "../services/facultyServices";
//import StudentServices from "../services/studentServices";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// These seem to require manual importing for some reason
import {
  VDataTable
} from "vuetify/labs/VDataTable";

const router = useRouter();

const message = ref([]);
const semesters = ref([]);
const courses = ref([]);
const students = ref([]);
const faculty = ref([]);
const schedules = ref([]);
const slide = ref(0);

const selSem = ref([]);
const selCourses = ref([]);
const selStudents = ref([]);
const selFaculty = ref([]);
const selSchedules = ref([]);

const refreshSemesters = () => {
    SemesterServices.getAllSemesters()
        .then((response) => {
            semesters.value = response.data;
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });
    semesterChanged();
}

const editSemester = () => {
    router.push({ name: 'manageSemester', params: { id: selSem.value[0].id } });
}

const refreshCourses = () => {
    CourseServices.getAllCourses()
        .then((response) => {
            courses.value = response.data;
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });
}

const refreshStudents = () => {

}

const refreshFaculty = () => {

}

const refreshSchedules = () => {
    if (!selSem.value[0]) return

    SemesterServices.getCoursesForSemester(selSem.value[0].id)
        .then((response) => {
            schedules.value = response.data;
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });
}

const semesterChanged = () => {
    refreshSchedules();
}

const deleteSems = () => {
    SemesterServices.deleteSemester(selSem.value[0].id)
        .then((response) => {
            selSem.value = [];
            refreshSemesters();
        })
        .catch((err) => {
            message.value = e.response.data.message;
        });
}

const courseChanged = () => {

}

const deleteCourses = () => {
    CourseServices.deleteCourse(selCourses.value[0].id)
        .then((response) => {
            selCourses.value = [];
            refreshCourses();
        })
        .catch((err) => {
            message.value = e.response.data.message;
        })
}

const facultyChanged = () => {

}

const studentChanged = () => {

}

const scheduleChanged = () => {

}

const onChangeCarousel = () => {
    
}

onMounted(() => {
    refreshSemesters();
    refreshCourses();
    refreshStudents();
    refreshFaculty();
});
</script>

<template>
    <v-container>
        <!--This row handles the semester selection card-->
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title class="text-center" style="font-size: 20pt;">Semester Selection</v-card-title>
                    <v-row>
                        <v-col align-self="center">
                            <v-row justify="center">
                                <v-card-title class="text-center">{{ !!selSem[0] ? `Semester: ${selSem[0].name}` : `No semester selected` }}</v-card-title>
                            </v-row>
                            <br><br><br>
                            <v-row justify="center">
                                <v-col cols="3">
                                    <v-btn
                                        color="secondary"
                                        @click="router.push({ name: 'manageSemester', params: { id: 'add' } })"
                                    >Add</v-btn>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn
                                        :color="(selSem.length != 1) ? `` : `secondary`"
                                        :disabled="selSem.length != 1"
                                        @click="editSemester"
                                    >Edit</v-btn>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn
                                        color="primary" 
                                        :disabled="selSem.length <= 0"
                                        @click="deleteSems" 
                                    >Delete</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="8">
                            <v-card-title class="text-center">Existing Semesters</v-card-title>
                            <v-data-table
                                v-model="selSem"
                                :headers="[
                                    { title: 'Semester Name', align: 'start', key: 'name'},
                                    { title: 'Start', align: 'start', key: 'startDate' },
                                    { title: 'End', align: 'start', key: 'endDate' }
                                ]"
                                :items="semesters"
                                :sort-by="[{ key: 'name', order: 'asc' }]"
                                :items-per-page="5"
                                :items-per-page-options="[{value:5, title:'5'}]"
                                return-object
                                select-strategy='single'
                                show-select
                                @input="semesterChanged"
                            ></v-data-table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-row v-if="!!selSem[0]">
            <v-col>
                <v-card>
                    <v-card-title class="text-center" style="font-size: 20pt;">Course Scheduling</v-card-title>
                    <v-row>
                        <v-col>
                            <v-carousel v-model="slide" @update:modelValue="onChangeCarousel">
                                <v-carousel-item>
                                    <v-row justify="center">
                                        <v-card>
                                            <v-card-title class="text-center">Courses</v-card-title>
                                            <v-data-table
                                                v-model="selCourses"
                                                :headers="[
                                                    { title: 'Course Number', align: 'start', key: 'courseNo' },
                                                    { title: 'Name', align: 'start', key: 'name' }
                                                ]"
                                                :items="courses"
                                                :sort-by="[{ key: 'courseNo', order: 'asc' }]"
                                                :items-per-page="10"
                                                :items-per-page-options="[{value:10, title:'10'}]"
                                                return-object
                                                select-strategy="multiple"
                                                show-select
                                                @input="courseChanged"
                                            ></v-data-table>
                                        </v-card>
                                    </v-row>
                                    <br>
                                    <v-row justify="center">
                                        <v-col cols="2">
                                            <v-btn
                                                color="secondary"
                                                @click="router.push({ name: 'manageCourses', params: { id: 'add' } })"
                                            >Add</v-btn>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn
                                                :color="(selCourses.length != 1) ? `` : `secondary`"
                                                :disabled="selCourses.length != 1"
                                                @click="router.push({ name: 'manageCourses', params: { id: selCourses[0].id } })"
                                            >Edit</v-btn>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn
                                                color="primary"
                                                :disabled="selCourses.length != 1"
                                                @click="deleteCourses" 
                                            >Delete</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-carousel-item>
                                <v-carousel-item>
                                    <v-row justify="center">
                                        <v-card>
                                            <v-card-title class="text-center">Faculty</v-card-title>
                                            <v-data-table
                                                v-model="selFaculty"
                                                :headers="[
                                                    { title: 'First Name', align: 'start', key: 'fName' },
                                                    { title: 'Last Name', align: 'start', key: 'lName' },
                                                    { title: 'Email', align: 'start', key: 'email' }
                                                ]"
                                                :items="faculty"
                                                :sort-by="[{ key: 'lName', order: 'asc' }]"
                                                :items-per-page="10"
                                                :items-per-page-options="[{value:10, title:'10'}]"
                                                return-object
                                                select-strategy="multiple"
                                                :show-select="selSchedules.length == 1"
                                                @input="facultyChanged"
                                            ></v-data-table>
                                        </v-card>
                                    </v-row>
                                </v-carousel-item>
                                <v-carousel-item>
                                    <v-row justify="center">
                                        <v-card>
                                            <v-card-title class="text-center">Students</v-card-title>
                                            <v-data-table
                                                v-model="selStudents"
                                                :headers="[
                                                    { title: 'First Name', align: 'start', key: 'fName' },
                                                    { title: 'Last Name', align: 'start', key: 'lName' },
                                                    { title: 'Email', align: 'start', key: 'email' }
                                                ]"
                                                :items="students"
                                                :sort-by="[{ key: 'lName', order: 'asc' }]"
                                                :items-per-page="10"
                                                :items-per-page-options="[{value:10, title:'10'}]"
                                                return-object
                                                select-strategy="multiple"
                                                :show-select="selSchedules.length == 1"
                                                @input="studentChanged"
                                            ></v-data-table>
                                        </v-card>
                                    </v-row>
                                </v-carousel-item>
                            </v-carousel>
                        </v-col>
                        <v-col>
                            <v-card>
                                <v-card-title class="text-center">Courses In {{ selSem[0].name }}</v-card-title>
                                <v-data-table
                                    v-model="selSchedules"
                                    :headers="[
                                        { title: 'Course Number', align: 'start', key: 'courseNo' },
                                        { title: 'Name', align: 'start', key: 'name' }
                                    ]"
                                    :items="schedules"
                                    :sort-by="[{ key: 'courseNo', order: 'asc' }]"
                                    :items-per-page="10"
                                    :items-per-page-options="[{value:10, title:'10'}]"
                                    return-object
                                    select-strategy="single"
                                    :show-select="slide > 0"
                                    @input="scheduleChanged"
                                ></v-data-table>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>

</style>