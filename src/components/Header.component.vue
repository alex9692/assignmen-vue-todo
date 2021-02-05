<template>
  <div>
    <v-app-bar app color="indigo" dark clipped-left>
      <v-app-bar-nav-icon
        v-if="showBurgerIcon"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <router-link class="title-app" to="/">
        <div class="d-flex justify-center align-center">
          <v-toolbar-title class="mr-3" v-if="$vuetify.breakpoint.width > 600"
            >TodoApp</v-toolbar-title
          >
          <v-img
            max-height="40"
            max-width="40"
            src="@/assets/to-do-list.svg"
          ></v-img>
        </div>
      </router-link>

      <v-spacer></v-spacer>
      <v-slide-x-reverse-transition>
        <v-text-field
          v-show="expand"
          dense
          hide-details
          label="Search Todos"
          v-model.lazy="filterText"
        ></v-text-field>
      </v-slide-x-reverse-transition>

      <v-btn v-if="isAuth" icon @click="expand = !expand">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-badge
        v-if="isAuth"
        :content="favs"
        :value="favs"
        color="green"
        overlap
      >
        <v-icon>mdi-heart</v-icon>
      </v-badge>

      <v-toolbar-title class="ml-3" v-if="isAuth"
        >Welcome {{ name }}</v-toolbar-title
      >
      <v-btn to="/login" text v-if="!showSideBar && !isAuth">
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <v-btn text v-if="!showSideBar && isAuth" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      :temporary="showSideBar"
      app
      v-model="drawer"
      absolute
      clipped
      disable-resize-watcher
    >
      <v-list nav dense>
        <v-list-item>
          <v-img
            max-height="30"
            max-width="30"
            src="@/assets/to-do-list.svg"
          ></v-img>
          <v-list-item-subtitle class="ml-3">Todo App</v-list-item-subtitle>
        </v-list-item>
        <v-divider class="mb-3"></v-divider>
        <v-list-item link v-if="isAuth">
          <v-list-item-content>
            <v-list-item-title class="title" v-if="isAuth">
              {{ name }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="isAuth">{{
              email
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item v-if="isAuth">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Account</v-list-item-title>
        </v-list-item> -->
        <v-list-item v-if="!isAuth" link to="/login">
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
        <v-list-item v-else @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { auth } from "@/firebase";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      drawer: false,
      expand: false,
      auth: auth,
      filterText: "",
    };
  },
  methods: {
    async logout() {
      await this.auth.signOut();
      this.$router.push("/login");
    },
  },
  watch: {
    filterText(val) {
      this.$store.dispatch("todo/filterText", val);
    },
    filterTextVuex(val) {
      this.filterText = val;
    },
  },
  computed: {
    ...mapGetters({
      isAuth: "user/isAuth",
      name: "user/getName",
      email: "user/getEmail",
      filterTextVuex: "todo/getFilterText",
      favs: "todo/getFavCount",
    }),
    showSideBar: function () {
      return this.$vuetify.breakpoint.width < 600;
    },
    showBurgerIcon() {
      return this.$vuetify.breakpoint.width < 600;
    },
  },
};
</script>

<style scoped>
.title-app {
  text-decoration: none;
  color: #fff;
}
</style>