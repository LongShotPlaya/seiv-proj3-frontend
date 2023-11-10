<script setup>
import SemesterServices from "../services/semesterServices";
import CourseServices from "../services/courseServices";
import CSServices from "../services/courseScheduleServices";
import UserServices from "../services/userServices";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// These seem to require manual importing for some reason
import {
  VDataTable
} from "vuetify/labs/VDataTable";
import courseScheduleServices from "../services/courseScheduleServices";

const router = useRouter();
const message = ref([]);
const slide = ref(0);

const semesters = ref([]);
const selSem = ref([]);

const courses = ref([]);
const selCourses = ref([]);

const students = ref([]);
const selStudents = ref([]);

const faculty = ref([]);
const selFaculty = ref([]);

const schedules = ref([]);
const selSchedules = ref([]);
let addingScheds = [];
let deletingScheds = [];


// Refreshes the list of semesters
const refreshSemesters = () => {
    SemesterServices.getAllSemesters()
        .then((response) => {
            semesters.value = response.data;
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });
    semesterChanged();
};

// Forwards the user to the page for editing semesters
const editSemester = () => {
    router.push({ name: 'manageSemester', params: { id: selSem.value[0].id } });
};

// Refreshes the list of all courses
const refreshCourses = () => {
    CourseServices.getAllCourses()
        .then((response) => {
            courses.value = response.data;
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });
};

// Refreshes the list of all students
const refreshStudents = () => {
    UserServices.getAllUsers()
        .then((response) => {
            students.value = response.data.filter(user => user.role == "Student");
        })
        .catch((err) => {
            message.value = err.response.data.message
        })
};

// Refreshes the list of all faculty
const refreshFaculty = () => {
    UserServices.getAllUsers()
        .then((response) => {
            faculty.value = response.data.filter(user => user.role == "Faculty");
        })
        .catch((err) => {
            message.value = err.response.data.message
        })
};

// Refreshes the list of all courses for the selected semester
const refreshSchedules = () => {
    if (!selSem.value[0]) return

    SemesterServices.getCoursesForSemester(selSem.value[0].id)
        .then((response) => {
            schedules.value = response.data.map(schedule => { return {...schedule, exists: true }; });
        })
        .catch((e) => {
            message.value = e.response.data.message;
        });
};

// Deletes the currently selected semester
const deleteSems = () => {
    SemesterServices.deleteSemester(selSem.value[0].id)
        .then((response) => {
            selSem.value = [];
            refreshSemesters();
        })
        .catch((err) => {
            message.value = e.response.data.message;
        });
};
    
// Deletes the currently selected course
const deleteCourses = () => {
    CourseServices.deleteCourse(selCourses.value[0].id)
        .then((response) => {
            selCourses.value = [];
            refreshCourses();
        })
        .catch((err) => {
            message.value = e.response.data.message;
        })
};

// Runs whenever the selected semester is changed
const semesterChanged = () => {
    refreshSchedules();
}

// Updates course schedules list when necessary
// Note: does not yet account for when a schedule is prompted to be deleted or restored (and its facultyCourses and studentCourses should be along with it)
const courseChanged = () => {
    // If course is in selCourses but not already in schedules, prompt the creation of a new course schedule
    selCourses.value.forEach(sCourse => {
        if (!schedules.value.find(schedule => sCourse.id == schedule.courseId))
        {
            let newSchedule = {};

            // If the schedule already existed, but was prompted for deletion and then restored, restore it
            const checkDeleting = deletingScheds.find(schedule => schedule.courseId == sCourse.id);
            if (!!checkDeleting)
            {
                newSchedule = deletingScheds.splice(deletingScheds.indexOf(checkDeleting), 1)[0];
            }
            else
            {
                newSchedule = {
                    location: null,
                    section: null,
                    courseId: sCourse.id,
                    semesterId: selSem.value[0].id,
    
                    name: sCourse.name,
                    courseNo: sCourse.courseNo,
                    exists: false,
                };
            }
            
            schedules.value.push(newSchedule);
        }
    });

    // If course is in courses but not in selCourses, prompt the deletion of a course schedule
    courses.value.forEach(course => {
        if (!selCourses.value.find(sCourse => course.id == sCourse.id))
        {
            const delSched = schedules.value.find(schedule => schedule.courseId == course.id);
            if (delSched != null)
            {
                if (delSched.exists)
                {
                    deletingScheds.push(delSched.id);
                }
                schedules.value.splice(schedules.value.indexOf(delSched), 1);
            }
        }
    });
}

const facultyChanged = () => {

}

const studentChanged = () => {

}

const scheduleChanged = () => {

}

// Runs whenever the carousel's page is changed
const onChangeCarousel = () => {
    
};

// Saves changes
const onSave = async () => {
    // Create schedules where necessary and grab new course schedule IDs when done creating
    CSServices.createCourseSchedules()
        .then((response) => {

        })
        .catch((err) => {
            message.value = err.response.data.message;
        })
    // Delete schedules where necessary


    // Create new facultyCourses

    // Delete facultyCourses


    // Create new studentCourses

    // Delete studentCourses
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
                                <!--This item represents the list of all courses-->
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
                                                :show-select="new Date(selSem[0].endDate) > new Date()"
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
                                <!--This item represents the list of all faculty-->
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
                                                :show-select="selSchedules.length == 1 && new Date(selSem[0].endDate) > new Date()"
                                                @input="facultyChanged"
                                            ></v-data-table>
                                        </v-card>
                                    </v-row>
                                </v-carousel-item>
                                <!--This item represents the list of all students-->
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
                                                :show-select="selSchedules.length == 1 && new Date(selSem[0].endDate) > new Date()"
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
                                    :show-select="slide > 0 && new Date(selSem[0].endDate) > new Date()"
                                    @input="scheduleChanged"
                                ></v-data-table>
                            </v-card>
                            <br>
                            <v-row justify="center">
                                <v-col cols="2">
                                    <v-btn
                                        color="secondary"
                                        @click="onSave"
                                    >Save</v-btn>
                                </v-col>
                                <v-col cols="2">
                                    <v-btn
                                        color="primary"
                                    >Cancel</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>

</style>