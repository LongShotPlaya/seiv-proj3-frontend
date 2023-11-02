<script setup>
import { ref, onMounted } from "vue";
import SemesterServices from "../services/semesterServices.js";
import { useRouter } from "vue-router";

const router = useRouter();

const message = ref("");
const props = defineProps({
  id: {
    required: true,
  },
});

const valid = ref(false);
const semester = ref({
	id: null,
	name: "",
	startDate: "",
	endDate: "",
});

const add = () => {
  const data = {
    name: semester.value.name,
    startDate: semester.value.startDate,
	endDate: semester.value.endDate,
  };
  if (semester.value.name != "" && semester.value.name != null && semester.value.startDate != null && semester.value.endDate != null)
  {
  SemesterServices.createSemester(data)
    .then((response) => {
      semester.value.id = response.data.id;
      console.log("add " + response.data);
	  message.value = "";
      router.push({ name: "home" });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
  }
  else
  	message.value = "Please fill out all fields!";
};

var addMode = false;
const retrieve = async () => {
  try {
	if (props.id == "add")
		addMode = true; //console.log("it worked?!");
	else
	{
    	const response = await SemesterServices.getSemester(props.id);
    	semester.value = response.data;
	}
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const update = async () => {
  const data = {
    name: semester.value.name,
    startDate: semester.value.startDate,
	endDate: semester.value.endDate,
  };
  if (semester.value.name != "" && semester.value.name != null && semester.value.startDate != null && semester.value.endDate != null)
  {
	try {
		const response = await SemesterServices.updateSemester(props.id, data);
		semester.value.id = response.data.id;
		message.value = "";
		location.reload();
	} catch (e) {
		message.value = e.response.data.message;
	}
  }
  else
  	message.value = "Please fill out all fields!";
};

const cancel = () => {
  router.push({ name: "home" });
};

const deleteThis = () => {
  SemesterServices.deleteSemester(props.id)
  router.push({ name: "home" });
};

var mode = ref("");
var addDisabled = false;
var updateDisabled = false;
var deleteDisabled = false;

onMounted(() => {
	retrieve();
	if (addMode == true)
	{
		mode = "Adding Mode";
		addDisabled = false;
		updateDisabled = true;
		deleteDisabled = true;
	}
	else
	{
		mode = "Editing Mode";
		addDisabled = true;
		updateDisabled = false;
		deleteDisabled = false;
	}
});
</script>

<template>
	<v-container>
			<v-toolbar>
				<v-toolbar-title>Semester Management</v-toolbar-title>
			</v-toolbar>
			<br />
			<h4>{{ mode }}</h4>
			<br />
			<div class="container">
				<v-form ref="form" v-model="valid" lazy validation>
					<v-text-field required v-model="semester.name" id="name" label="Name">
					</v-text-field>

					<v-text-field required placeholder="MM/DD/YYYY" :valid="true" v-model="semester.startDate" id="startDate" label="Start Date">
					</v-text-field>

					<v-text-field required placeholder="MM/DD/YYYY" :valid="true" v-model="semester.endDate" id="endDate" label="End Date">
					</v-text-field>
					<v-card-actions>
						<v-btn :disabled=addDisabled color="success" class="mr-4" @click="add">
						Add
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