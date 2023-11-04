<script setup>
import { ref, onMounted } from "vue";
import accCatServices from "../services/accCatServices";
import { useRouter } from "vue-router";

const router = useRouter ();
const message = ref("");

const props = defineProps({
  id: {
    required: true,
  },
});

const valid = ref(false);
const accommodation = ref({
	id: null,
	name: "",
    description: "",
    email: "",
});

const save = () => {
  const data = {
    name: accommodation.value.name,
    description: accommodation.value.description,
    email: accommodation.value.email 
  };
  
  accCatServices.createAccomodationCat(data)
    .then((response) => {
      accommodation.value.id = response.data.id;
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
    	const response = await accCatServices.getAccomodationCat(props.id);
    	accommodation.value = response.data;
	}
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const update = async () => {
  const data = {
    name: accommodation.value.name,
    description: accommodation.value.description,
    email: accommodation.value.email
  };
  try {
    const response = await accCatServices.updateAccomodationCat(props.id, data);
    accommodation.value.id = response.data.id;
	location.reload();
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const cancel = () => {
  router.go(-1);
};

const deleteThis = () => {
    accCatServices.deleteAccomodationCat (props.id)  
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
			<v-toolbar-title>Accommodation Category</v-toolbar-title>
		</v-toolbar>
			<br>
		<div class="container">
			<v-form ref="form" v-model="valid" lazy validation>
				<v-text-field 
					required v-model="accommodation.name" id="name" label="Name">
				</v-text-field>

				<v-text-field 
					required v-model="accommodation.description" id="description" label="Description">
				</v-text-field>

				<v-text-field 
					required v-model="accommodation.email" id="email" label="Email">
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