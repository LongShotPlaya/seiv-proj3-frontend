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
const course = ref({
	id: null,
	name: "",
    description: "",
    creditHrs: "",
    courseNo: "",
});

const save = () => {
  const data = {
    courseNo: course.value.courseNo,
    name: course.value.name,
    description: course.value.description,
    creditHrs: course.value.creditHrs
  };
  CourseServices.createCourse(data)
    .then((response) => {
      course.value.id = response.data.id;
      console.log("add " + response.data);
      router.push({ name: "home" });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

var addMode = false;
const retrieve = async () => {
  try {
	if (props.id == "add")
		addMode = true;
	else
	{
    	const response = await CourseServices.getCourse(props.id);
    	course.value = response.data;
	}
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const update = async () => {
  const data = {
    courseNo: course.value.courseNo,
    name: course.value.name,
    description: course.value.description,
    creditHrs: course.value.creditHrs
  };
  try {
    const response = await CourseServices.updateCourse(props.id, data);
    course.value.id = response.data.id;
	location.reload();
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const cancel = () => {
  router.push({ name: "home" });
};

const deleteThis = () => {
  CourseServices.deleteCourse(props.id)
  router.push({ name: "home"});
};

var mode = ref("");
var saveDisabled = false;
var updateDisabled = false;
var deleteDisabled = false;

onMounted(() => {
	retrieve();
	if (addMode == true)
	{
		mode = "Adding Mode";
		saveDisabled = false;
		updateDisabled = true;
		deleteDisabled = true;
	}
	else
	{
		mode = "Editing Mode";
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
			<br />
			<h4>{{ mode }}</h4>
			<br />
			<div class="container">
				<v-form ref="form" v-model="valid" lazy validation>
					<v-text-field required v-model="course.name" id="name" label="Name">
					</v-text-field>

                    <v-text-field required v-model="course.description" id="description" label="Description">
                    </v-text-field>

                    <v-text-field required v-model="course.creditHrs" id="creditHrs" label="Course Hours">
                    </v-text-field>

                    <v-text-field required placeholder="ie. CMSC-1111" v-model="course.courseNo" id="courseNo" label="Course Number">
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
			<br />
      		<h4>{{ message }}</h4>
      		<br />
	</v-container>
</template>