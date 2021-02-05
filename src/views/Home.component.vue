<template>
  <v-container>
    <v-fade-transition v-if="!loading" mode="out-in">
      <TodoList :userId="userId" />
    </v-fade-transition>
    <v-fade-transition v-else>
      <Loading />
    </v-fade-transition>
  </v-container>
</template>

<script>
import TodoList from "@/components/TodoList.component.vue";
import Loading from "@/components/Loading.component.vue";
import { firestore, transformTodos } from "@/firebase";
import { mapGetters } from "vuex";

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$store.getters["user/isAuth"]) {
        vm.$router.push("/login");
      }
    });
  },
  name: "Home",
  components: {
    TodoList,
    Loading,
  },
  computed: {
    ...mapGetters({ userId: "user/getId", loading: "todo/isLoading" }),
  },
  created() {
    this.$store.dispatch("todo/setLoading", true);
    const todoRef = firestore.doc(`users/${this.userId}`).collection("todos");
    todoRef.onSnapshot(async (snapshot) => {
      await this.$store.dispatch("todo/fetchTodo", transformTodos(snapshot));
      this.$store.dispatch("todo/setLoading", false);
    });
  },
};
</script>

