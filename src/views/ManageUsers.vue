<script setup>
import UserServices from "../services/userServices";
import Utils from "../config/utils.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);
let originalRoles = [];
const user = Utils.getStore("user");
const message = ref("Change the roles of users");

const retrieveUsers = () => {
    originalRoles = [];
    UserServices.getAllUsers()
        .then((response) => {
          users.value = response.data;
          users.value.forEach((item) => {
            originalRoles.push(item.role);
          });
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
};

const saveChanges = () => {
    let changed = []
    users.value.forEach((user, index) => {
        if (user.role != originalRoles[index]) changed.push({ id: user.id, role: user.role });
    });
    console.log(changed);
    UserServices.updateUserRoles({ users: changed })
        .then((response) => {
            retrieveUsers();
        })
        .catch((e) => {
            message.value = e.response?.data?.message;
        });
}

const cancelChanges = () => {
    retrieveUsers();
}

retrieveUsers();
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title
          >Hello, {{ user.fName }} {{ user.lName }}!</v-toolbar-title
        >
      </v-toolbar>
      <br /><br />
      <v-card>
        <v-card-title> Users </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>
        <br>
        <v-row justify="center">
            <v-btn class="mx-2" color="secondary" @click="saveChanges">Save Changes</v-btn>
            <v-btn class="mx-2" color="primary" @click="cancelChanges">Cancel Changes</v-btn>
        </v-row>
        <br>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Email</th>
              <th class="text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in users" :key="index">
              <td>{{ `${item.fName} ${item.lName}` }}</td>
              <td>{{ item.email }}</td>
              <td>
                <v-combobox :items="['Student', 'Faculty', 'Administrator']" v-model="item.role"></v-combobox>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>

<style>

</style>
