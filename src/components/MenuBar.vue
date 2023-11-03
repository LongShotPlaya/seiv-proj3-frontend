<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter } from "vue-router";
import UserServices from "../services/userServices"; 

const router = useRouter();
const user = ref(null);
const title = ref("Accommodations");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const userRole = ref("Student");



//NavBar Menu  
const allItems =[
    { title: 'Home', routeName: "home", authLevel: "any" },    
    { title: 'OC Schedule', routeName: "ocSchedule", authLevel: "admin" },        
    { title: 'Manage Users', routeName: "manageUsers", authLevel: "admin" },
    { title: 'Manage Accommodations Info', routeName: "accomInfo", authLevel: "admin" },
    { title: 'Login', routeName: "login", authLevel: "any" }, 
];

const items = ref([
  
]);


const resetMenu = () => {
  //reset the user and get their info
  user.value = null; 
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
  }

  //Reset the items in the menu
  items.value = [];
  allItems.forEach((item) => {
    if (authorize(item.authLevel)) items.value.push(item);
  });

};



const logout = () => {
  AuthServices.logoutUser(user.value)
    .then((response) => {
      console.log(response);
      Utils.removeItem("user");
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();  
});

const authorize = (authLevel) => {
    //Role can be Student, Faculty, or Administrator  
    if(authLevel == "any") return true; 
    if(!user.value) return false;
    if(authLevel == "admin" && user.value.role == "Administrator") return true;
    if(authLevel == "student" && user.value.role == "Student") return true;
    if(authLevel == "faculty" && user.value.role == "Faculty") return true;    
    return false;
};



const menu = () => {
    console.log("Menu");
};
</script>

<template>
  <div>
    <v-app-bar app>
      <!-- 
      <router-link :to="{ name: 'tutorials' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link>-->
 
      <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-menu" v-bind="props"></v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
              >
              <v-list-item-title @click="router.push({name: item.routeName})">{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <div v-if="user">
        <v-btn class="mx-2" :to="{ name: 'tutorials' }"> List </v-btn>
        <v-btn class="mx-2" :to="{ name: 'add' }"> Add Tutorial </v-btn>
      </div> -->
      <v-menu bottom min-width="200px" rounded offset-y v-if="user">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>
