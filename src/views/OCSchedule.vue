<script setup>
import SemesterServices from "../services/semesterServices";
import CourseServices from "../services/courseServices";
import UserServices from "../services/userServices";
import FCServices from "../services/facultyCourseServices";
import SCServices from "../services/studentCourseServices";
import CSServices from "../services/courseScheduleServices";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// These seem to require manual importing for some reason
import { VDataTable } from "vuetify/labs/VDataTable";

const router = useRouter();
const message = ref([]);
const slide = ref(0);

const semesters = ref([]);
const selSem = ref([]);

const courses = ref([]);
const selCourses = ref([]);

const students = ref([]);
const selStudents = ref([]);
let studentCourses = [];
let addingSCs = [];
let deletingSCs = [];

const faculty = ref([]);
const selFaculty = ref([]);
let facultyCourses = [];
let addingFCs = [];
let deletingFCs = [];

const schedules = ref([]);
const selSchedules = ref([]);
let deletingScheds = [];


// Refreshes the list of semesters
const refreshSemesters = () => {
    SemesterServices.getAllSemesters()
        .then((response) => {
            semesters.value = response.data;
            semesters.value.forEach(semester => {
                semester.startDate = new Date(semester.startDate).toLocaleDateString();
                semester.endDate = new Date(semester.endDate).toLocaleDateString();
            })
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

// Refreshes the list of all students and faculty
const refreshStudentsAndFaculty = () => {
    UserServices.getAllUsers()
        .then((response) => {
            students.value = response.data.filter(user => user.role == "Student");
            faculty.value = response.data.filter(user => user.role == "Faculty");
        })
        .catch((err) => {
            message.value = err.response.data.message
        })
};

// Refreshes the list of all courses for the selected semester
const refreshSchedules = () => {
    if (!selSem.value[0]) return
    selCourses.value = [];
    deletingScheds = [];

    SemesterServices.getCoursesForSemester(selSem.value[0].id)
        .then((response) => {
            schedules.value = response.data.map(schedule => {
                const schedCourse = courses.value.find(course => course.id == schedule.courseId);
                if (!!schedCourse) selCourses.value.push(schedCourse);
                return {
                    ...schedule,
                    
                    name: schedCourse?.name,
                    courseNo: schedCourse?.courseNo,
                    exists: true
                };
            });
            selSchedules.value = [];
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
};

// Updates course schedules list when necessary
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
                    deletingScheds.push(delSched);
                }
                schedules.value.splice(schedules.value.indexOf(delSched), 1);
            }
        }
    });
};

// Updates whenever the selection of faculty for a course schedule is changed
const facultyChanged = () => {
    // If faculty is in selFaculty but not already in facultyCourses, prompt the creation of a new facultyCourse
    selFaculty.value.forEach(sFaculty => {
        if (!facultyCourses.find(fc => sFaculty.id == fc.userId && fc.courseId == selSchedules.value[0].courseId)
        && !addingFCs.find(fc => sFaculty.id == fc.userId && fc.courseId == selSchedules.value[0].courseId))
        {
            let newFacultyCourse = {};

            // If the faculty course already existed, but was prompted for deletion and then restored, restore it
            const checkDeleting = deletingFCs.find(fc => fc.userId == sFaculty.id);
            if (!!checkDeleting)
            {
                newFacultyCourse = deletingFCs.splice(deletingFCs.indexOf(checkDeleting), 1)[0];
            }
            else
            {
                newFacultyCourse = {
                    userId: sFaculty.id,
                    courseScheduleId: selSchedules.value[0].id,
    
                    courseId: selSchedules.value[0].courseId,
                    exists: false,
                };
                addingFCs.push(newFacultyCourse);
            }
            
            facultyCourses.push(newFacultyCourse);
        }
    });

    // If faculty is in facultyCourses but not in selFaculty, prompt the deletion of a facultyCourse
    faculty.value.forEach(fac => {
        if (!selFaculty.value.find(sFaculty => fac.id == sFaculty.id))
        {
            const delFC = facultyCourses.find(fc => fc.userId == fac.id);
            if (delFC != null)
            {
                if (delFC.exists)
                {
                    deletingFCs.push(delFC);
                }
                else if (!!addingFCs.find(fc => fc.userId == fac.id))
                {
                    addingFCs.splice(addingFCs.indexOf(delFC), 1);
                }
                facultyCourses.splice(facultyCourses.indexOf(delFC), 1);
            }
        }
    });
};

// Updates whenever the selection of students for a course schedule is changed
const studentChanged = () => {
    // If student is in selStudents but not already in studentCourses, prompt the creation of a new studentCourse
    selStudents.value.forEach(sStudent => {
        if (!studentCourses.find(sc => sStudent.id == sc.userId && sc.courseId == selSchedules.value[0].courseId)
        && !addingSCs.find(sc => sStudent.id == sc.userId && sc.courseId == selSchedules.value[0].courseId))
        {
            let newStudentCourse = {};

            // If the student course already existed, but was prompted for deletion and then restored, restore it
            const checkDeleting = deletingSCs.find(sc => sc.userId == sStudent.id);
            if (!!checkDeleting)
            {
                newStudentCourse = deletingSCs.splice(deletingSCs.indexOf(checkDeleting), 1)[0];
            }
            else
            {
                newStudentCourse = {
                    userId: sStudent.id,
                    courseScheduleId: selSchedules.value[0].id,
    
                    courseId: selSchedules.value[0].courseId,
                    exists: false,
                };
                addingSCs.push(newStudentCourse);
            }
            
            studentCourses.push(newStudentCourse);
        }
    });

    // If student is in studentCourses but not in selStudents, prompt the deletion of a studentCourse
    students.value.forEach(student => {
        if (!selStudents.value.find(sStudent => student.id == sStudent.id))
        {
            const delSC = studentCourses.find(sc => sc.userId == student.id);
            if (delSC != null)
            {
                if (delSC.exists)
                {
                    deletingSCs.push(delSC);
                }
                else if (!!addingSCs.find(sc => sc.userId == student.id))
                {
                    addingSCs.splice(addingSCs.indexOf(delSC), 1);
                }
                studentCourses.splice(studentCourses.indexOf(delSC), 1);
            }
        }
    });
};

// Runs whenever the selected course schedule is changed
const scheduleChanged = async () => {
    if (!selSchedules.value[0]) return

    if (selSchedules.value[0].exists)
    {
        await CSServices.getFacultyCourseForCourseSchedule(selSchedules.value[0].id)
            .then((response) => {
                facultyCourses = response.data.map(fc => { return {...fc, courseId: selSchedules.value[0].courseId, exists: true}; });
            })
            .catch((err) => {
                message.value = err.response.data.message;
            })
    
        await CSServices.getStudentCourseForCourseSchedule(selSchedules.value[0].id)
            .then((response) => {
                studentCourses = response.data.map(sc => { return {...sc, courseId: selSchedules.value[0].courseId, exists: true}; });
            })
            .catch((err) => {
                message.value = err.response.data.message;
            })
    }
    else
    {
        facultyCourses = [];
        studentCourses = [];
    }

    selFaculty.value = [];
    // Add faculty courses to the selection which have been prompted to be added, but not yet
    facultyCourses.push(...addingFCs.filter(afc => afc.courseId == selSchedules.value[0].courseId));
    facultyCourses.forEach(fc => {
        // If the faculty course has not been prompted to be deleted, add it to the selection
        if (!deletingFCs.find(dfc => dfc.id == fc.id)) selFaculty.value.push(faculty.value.find(fac => fac.id == fc.userId));
    });
    
    selStudents.value = [];
    // Add student courses to the selection which have been prompted to be added, but not yet
    studentCourses.push(...addingSCs.filter(asc => asc.courseId == selSchedules.value[0].courseId));
    studentCourses.forEach(sc => {
        // If the student course has not been prompted to be deleted, add it to the selection
        if (!deletingSCs.find(dsc => dsc.id == sc.id)) selStudents.value.push(students.value.find(student => student.id == sc.userId));
    });
};

// Runs whenever the carousel's page is changed
const onChangeCarousel = () => {
    
};

// Saves changes
const onSave = async () => {
    // Create schedules where necessary and update schedules when done creating
    const addingScheds = schedules.value.filter(schedule => !schedule.exists);
    if (addingScheds.length > 0)
    {
        await CSServices.createCourseSchedules(addingScheds)
            .then((response) => {
                response.data.forEach(schedule => {
                    const updatingSchedule = schedules.value.find(sched => sched.courseId == schedule.courseId);
                    if (!!updatingSchedule) schedules.value[schedules.value.indexOf(updatingSchedule)].id = schedule.id;
                })
            })
            .catch((err) => {
                message.value = err.response.data.message;
            })
    }
    // Delete schedules where necessary
    if (deletingScheds.length > 0)
    {
        await CSServices.deleteCourseSchedules(deletingScheds.map(schedule => schedule.id))
            .then((response) => {
                deletingScheds.forEach(schedule => {
                    const delSched = schedules.value.find(sched => sched.id == schedule.id)
                    if (!!delSched) schedules.value.splice(schedules.value.indexOf(delSched), 1);
                })
            })
            .catch((err) => {
                message.value = err.response.data.message;
            })
    }

    // Create new facultyCourses
    if (addingFCs.length > 0)
    {
        FCServices.createFacultyCourses(addingFCs.filter(fc => {
            if (!fc.courseScheduleId) fc.courseScheduleId = schedules.value.find(schedule => fc.courseId == schedule.courseId)?.id;
            return !!fc.courseScheduleId;
        }))
            .then((response) => {

            })
            .catch((err) => {
                message.value = err.response.data.message;
            });
    }
    // Create new studentCourses
    if (addingSCs.length > 0)
    {
        SCServices.createStudentCourses(addingSCs.filter(sc => {
            if (!sc.courseScheduleId) sc.courseScheduleId = schedules.value.find(schedule => sc.courseId == schedule.courseId)?.id;
            return !!sc.courseScheduleId;
        }))
            .then((response) => {

            })
            .catch((err) => {
                message.value = err.response.data.message;
            })
    }

    
    // Delete facultyCourses
    if (deletingFCs.length > 0)
    {
        FCServices.deleteFacultyCourses(deletingFCs.map(fc => fc.id))
            .then((response) => {

            })
            .catch((err) => {
                message.value = err.response.data.message;
            });
    }
    // Delete studentCourses
    if (deletingSCs.length > 0)
    {
        SCServices.deleteStudentCourses(deletingSCs.map(sc => sc.id))
            .then((response) => {

            })
            .catch((err) => {
                message.value = err.response.data.message;
            });
    }

    // Refresh necessary items (which cancel already does)
    onCancel();
};

// Refreshes items without keeping changes
const onCancel = () => {
    refreshSchedules();
    addingFCs = [];
    addingSCs = [];
    deletingFCs = [];
    deletingSCs = [];
};

onMounted(() => {
    refreshSemesters();
    refreshCourses();
    refreshStudentsAndFaculty();
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
                                                :items-per-page="5"
                                                :items-per-page-options="[{value:5, title:'5'}]"
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
                                                :items-per-page="5"
                                                :items-per-page-options="[{value:5, title:'5'}]"
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
                                                :items-per-page="5"
                                                :items-per-page-options="[{value:5, title:'5'}]"
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
                                    :items-per-page="5"
                                    :items-per-page-options="[{value:5, title:'5'}]"
                                    return-object
                                    select-strategy="single"
                                    :show-select="slide > 0 && new Date(selSem[0].endDate) > new Date()"
                                    @input="scheduleChanged"
                                ></v-data-table>
                            </v-card>
                            <br>
                            <v-row justify="center">
                                <v-col cols="2" v-if="new Date(selSem[0].endDate) > new Date()">
                                    <v-btn
                                        color="secondary"
                                        @click="onSave"
                                    >Save</v-btn>
                                </v-col>
                                <v-col cols="2">
                                    <v-btn
                                        color="primary"
                                        @click="onCancel"
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