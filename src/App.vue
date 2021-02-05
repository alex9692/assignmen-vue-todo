<template>
  <v-app v-if="!isLoading">
    <header><Header /></header>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
  <v-app v-else>
    <div class="text-h2">PLEASE WAIT....</div>
    <Loading />
  </v-app>
</template>


<script>
import Header from "@/components/Header.component";
// import Footer from "@/components/Footer.component";
import Loading from "@/components/Loading.component";
import { auth, createUserProfileDoc } from "@/firebase";
import { mapGetters } from "vuex";

export default {
  components: {
    Loading,
    Header,
    // Footer,
  },
  computed: {
    ...mapGetters({
      isLoading: "user/isLoading",
    }),
  },
  data() {
    return {
      unsubscribe: null,
    };
  },
  created() {
    this.$store.dispatch("user/setLoading", true);
    this.unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = await createUserProfileDoc(user);

        userRef.onSnapshot((snapshot) => {
          this.$store.dispatch("user/setCurrentUser", {
            id: snapshot.id,
            ...snapshot.data(),
          });
          this.$store.dispatch("user/setLoading", false);
        });
      } else {
        this.$store.dispatch("user/setCurrentUser", null);
        this.$store.dispatch("user/setLoading", false);
      }
    });
  },
  destroyed() {
    this.unsubscribe();
  },
};
</script>

<style scoped>
footer {

}
</style>