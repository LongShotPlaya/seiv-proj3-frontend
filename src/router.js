import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
//import TutorialsList from "./views/TutorialsList.vue";
//import EditTutorial from "./views/EditTutorial.vue";
//import AddTutorial from "./views/AddTutorial.vue";
//import ViewTutorial from "./views/ViewTutorial.vue";
//import AddLesson from "./views/AddLesson.vue";
//import EditLesson from "./views/EditLesson.vue";
import Home from "./views/Home.vue";
import RequestDetails from "./views/RequestDetails.vue";
import StudentList from "./views/StudentList.vue";
import StudentAcc from "./views/StudentAcc.vue";
import ManageCourses from "./views/ManageCourses.vue";
import ManageSemester from "./views/ManageSemester.vue";
import ManageUsers from "./views/ManageUsers.vue";
import OCSchedule from "./views/OCSchedule.vue";
import AccomInfo from "./views/AccomInfo.vue";
import ManageAccomCat from "./views/ManageAccomCat.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { requireAuth: true },
    },
    {
      path: "/student-list/:studentId/request-details/:requestId",
      name: "requestDetails",
      component: RequestDetails,
      props: true,
      meta: { requireAuth: true },
    },
    {
      path: "/student-list",
      name: "studentList",
      component: StudentList,
      meta: { requireAuth: true },
    },
    {
      path: "/student-list/:studentId/student-accommodations",
      name: "studentAcc",
      component: StudentAcc,
      props: true,
      meta: { requireAuth: true },
    },
    {
      path: "/manage-courses/:id",
      name: "manageCourses",
      component: ManageCourses,
      props: true,
      meta: { requireAuth: true },
    },
    {
      path: "/manage-semester/:id",
      name: "manageSemester",
      component: ManageSemester,
      props: true,
      meta: { requireAuth: true },
    },
    {
      path: "/manage-users",
      name: "manageUsers",
      component: ManageUsers,
      meta: { requireAuth: true },
    },
    {
      path: "/oc-schedule",
      name: "ocSchedule",
      component: OCSchedule,
      meta: { requireAuth: true },
    },
    {
      path: "/accommodation-info",
      name: "accomInfo",
      component: AccomInfo,
      meta: { requireAuth: true },
    },
	{
      path: "/accommodation-category/:id",
      name: "accommodationCategory",
      component: ManageAccomCat,
      props: true,
      meta: { requireAuth: true },
    },
    //{
    //  path: "/tutorials",
    //  name: "tutorials",
    //  component: TutorialsList,
    //},
    //{
    //  path: "/edit/:id",
    //  name: "edit",
    //  component: EditTutorial,
    //  props: true,
    //},
    //{
    //  path: "/add",
    //  name: "add",
    //  component: AddTutorial,
    //},
    //{
    //  path: "/view/:id",
    //  name: "view",
    //  component: ViewTutorial,
    //  props: true,
    //},
    //{
    //  path: "/addLesson/:tutorialId",
    //  name: "addLesson",
    //  component: AddLesson,
    //  props: true,
    //},
    //{
    //  path: "/editLesson/:tutorialId/:lessonId",
    //  name: "editLesson",
    //  component: EditLesson,
    //  props: true,
    //},
  ],
});

router.beforeEach((to, from) => {
  //NProgress.start()

  const loggedIn = false;

  const notAuthorized = false //was true
  if (to.meta.requireAuth && notAuthorized) {
    //GStore.flashMessage = 'Sorry, you are not authorized to view this page'

    //setTimeout(() => {
    //  GStore.flashMessage = ''
    //}, 3000)

    if (from.href) { // <--- If this navigation came from a previous page.
      return false
    } 
    else if (loggedIn) {  // <--- Must be navigating directly
      return { name: 'home' }  // <--- Push navigation to the root route.
    }
    else {
      return { name: 'login' }
    }
  }
  return true;
})

export default router;
