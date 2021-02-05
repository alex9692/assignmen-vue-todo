<template>
  <div class="mx-6 my-6">
    <v-row justify="space-between">
      <v-col md="6" class="mt-16" v-if="isLogin">
        <v-slide-x-transition mode="out-in">
          <LoginForm :isLogin="isLogin" @login-event="setLogin" />
        </v-slide-x-transition>
      </v-col>
      <v-col md="6" class="mt-16" v-else>
        <v-slide-x-transition mode="out-in">
          <RegisterForm :isLogin="isLogin" @login-event="setLogin" />
        </v-slide-x-transition>
      </v-col>
      <v-col
        md="6"
        class="pa-4 mt-16 d-flex justify-end"
        v-if="$vuetify.breakpoint.width > 959"
      >
        <v-img
          lazy-src="@/assets/todo.svg"
          max-height="300"
          max-width="600"
          src="@/assets/todo.svg"
        ></v-img>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LoginForm from "@/components/Login.component.vue";
import RegisterForm from "@/components/Register.component.vue";

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const watcher = vm.$store.watch(
        (state) => {
          return state.user.currentUser;
        },
        (user) => {
          if (watcher) {
            watcher();
          }
          if (user) {
            vm.$router.push("/").catch((err) => console.log(err));
          }
        },
        { deep: true, immediate: true }
      );
    });
  },
  components: {
    LoginForm,
    RegisterForm,
  },
  data() {
    return {
      isLogin: true,
    };
  },
  methods: {
    setLogin(data) {
      this.isLogin = data;
    },
  },
};
</script>