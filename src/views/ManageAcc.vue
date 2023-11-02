<script setup>
import { ref, onMounted } from "vue";
import AccServices from "../services/accServices.js";
import { useRouter } from "vue-router";

const router = useRouter ();
const message = ref("");

const props = defineProps({
  id: {
    required: true,
  },
});

const valid = ref(false);
const accommodations = ref({
	id: null,
	name: "",
    description: "",
});

const save = () => {
  const data = {
    name: accommodations.value.name,
    description: accommodations.value.description,    
  };
  AccServices.createAccomodation(data)
    .then((response) => {
      accommodations.value.id = response.data.id;
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
    	const response = await AccServices.getAccomodation(props.id);
    	accommodations.value = response.data;
	}
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const update = async () => {
  const data = {    
    name: accommodations.value.name,
    description: accommodations.value.description,
  };
  try {
    const response = await AccServices.updateAccomodation(props.id, data);
    accommodations.value.id = response.data.id;
	location.reload();
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const cancel = () => {
  router.go(-1);
};

const deleteThis = () => {
  AccServices.deleteAccomodation(props.id)
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
			<v-toolbar-title>Accommodation Management</v-toolbar-title>
		</v-toolbar>
			<br>
		<div class="container">
			<v-form ref="form" v-model="valid" lazy validation>
				<v-text-field 
					required v-model="accommodations.name" id="name" label="Name">
				</v-text-field>

				<v-text-field 
					required v-model="accommodations.description" id="description" label="Description">
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