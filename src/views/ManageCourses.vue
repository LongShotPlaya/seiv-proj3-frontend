<script setup>
import { ref, onMounted } from "vue";
import CourseServices from "../services/courseServices.js";
import { useRouter } from "vue-router";

const router = useRouter ();
const message = ref("");

const props = defineProps({
  id: {
    required: true,
  },
});

const valid = ref(false);
const courses = ref({
	id: null,
	name: "",
    description: "",
    creditHrs: "",
    courseNo: "",
});

const save = () => {
  const data = {
    courseNo: courses.value.courseNo,
    name: courses.value.name,
    description: courses.value.description,
    creditHrs: courses.value.creditHrs
  };
  CourseServices.createCourse(data)
    .then((response) => {
      courses.value.id = response.data.id;
      console.log("add " + response.data);
      //router.push({ name: "ocSchedule" });
	  router.go(-1);
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

var addFunction = false;
const retrieve = async () => {
  try {
	if (props.id == "add")
		addFunction = true;
	else
	{
    	const response = await CourseServices.getCourse(props.id);
    	courses.value = response.data;
	}
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const update = async () => {
  const data = {
    courseNo: courses.value.courseNo,
    name: courses.value.name,
    description: courses.value.description,
    creditHrs: courses.value.creditHrs
  };
  try {
    const response = await CourseServices.updateCourse(props.id, data);
    courses.value.id = response.data.id;
	location.reload();
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const cancel = () => {
  router.go(-1);
};

const deleteThis = () => {
  CourseServices.deleteCourse(props.id)
  router.go(-1);
};

var mode = ref("");
var saveDisabled = false;
var updateDisabled = false;
var deleteDisabled = false;

onMounted(() => {
	retrieve();
	if (addFunction == true)
	{
		mode = "Add";
		saveDisabled = false;
		updateDisabled = true;
		deleteDisabled = true;
	}
	else
	{
		mode = "Edit";
		saveDisabled = true;
		updateDisabled = false;
		deleteDisabled = false;
	}
});
</script>

<template>
    <v-container>
		<v-toolbar>
			<v-toolbar-title>Course Management</v-toolbar-title>
		</v-toolbar>
			<br>
		<div class="container">
			<v-form ref="form" v-model="valid" lazy validation>
				<v-text-field 
					required v-model="courses.name" id="name" label="Name">
				</v-text-field>

				<v-text-field 
					required v-model="courses.description" id="description" label="Description">
				</v-text-field>

				<v-text-field 
					required v-model="courses.creditHrs" id="creditHrs" label="Credit Hours">
				</v-text-field>

				<v-text-field 
					required placeholder="ie. CMSC-1111" v-model="courses.courseNo" id="courseNo" label="Course Number">
				</v-text-field>

				<v-card-actions>
					<v-btn :disabled=saveDisabled color="success" class="mr-4" @click="save">
						Save
					</v-btn>
					<v-btn :disabled=updateDisabled color="success" class="mr-4" @click="update">
						Update
					</v-btn>
					<v-btn color="error" class="mr-4" @click="cancel">
						Cancel
					</v-btn>
						<v-spacer></v-spacer>
					<v-btn :disabled=deleteDisabled color="red-darken-4" variant="outlined" class="mr-4" @click="deleteThis">
						Delete
					</v-btn>
				</v-card-actions>
			</v-form>
		</div>
	</v-container>
</template>