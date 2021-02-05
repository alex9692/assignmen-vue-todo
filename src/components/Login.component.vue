<template>
  <v-card class="pa-4 d-flex flex-column mb-6">
    <v-card-title class="d-flex justify-center">
      <p>Login</p>
    </v-card-title>
    <v-form>
      <v-text-field
        outlined
        v-model="email"
        :error-messages="emailErrors"
        prepend-inner-icon="mdi-card-account-mail"
        label="E-mail"
        required
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      >
      </v-text-field>
      <v-text-field
        outlined
        v-model="password"
        :error-messages="passwordErrors"
        prepend-inner-icon="mdi-lock"
        type="password"
        label="Password"
        required
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
      ></v-text-field>
      <v-text-field
        outlined
        v-model="confirmPassword"
        :error-messages="confirmPasswordErrors"
        prepend-inner-icon="mdi-lock"
        type="password"
        label="Confirm Password"
        required
        @input="$v.confirmPassword.$touch()"
        @blur="$v.confirmPassword.$touch()"
      ></v-text-field>
      <v-btn
        class="mr-4 green"
        block
        @click="submit"
        :loading="loading"
        :disabled="$v.$invalid"
      >
        Login
      </v-btn>
      <div class="my-4 d-flex justify-center">
        <p>OR</p>
      </div>

      <v-row align="center" justify="space-between" class="pa-3">
        <v-btn
          color="primary"
          type="button"
          :loading="loadingGoogle"
          @click="googleSignin"
        >
          <v-icon left dark> mdi-google </v-icon>
          Sign with Google
        </v-btn>
        <v-btn color="indigo" dark @click="$emit('login-event', !isLogin)">
          Register Now!
        </v-btn>
      </v-row>
    </v-form>
    <v-snackbar v-model="snackbar">
      {{ error }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, sameAs, minLength, email } from "vuelidate/lib/validators";
import { auth, signInWithGoogle } from "@/firebase";

export default {
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) },
    confirmPassword: { sameAsPassword: sameAs("password") },
  },

  data: () => ({
    email: "",
    password: "",
    confirmPassword: "",
    error: null,
    snackbar: false,
    loading: false,
    loadingGoogle: false,
  }),

  props: {
    isLogin: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      !this.$v.password.minLength &&
        errors.push(
          `Password must be at least ${this.$v.password.$params.minLength.min} characters long.`
        );
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.sameAsPassword &&
        errors.push("Password is required");

      return errors;
    },
  },

  methods: {
    signInWithGoogle: signInWithGoogle,
    async submit() {
      try {
        this.loading = true;
        await auth.signInWithEmailAndPassword(this.email, this.password);
        this.loading = false;
      } catch (error) {
        console.error();
        this.loading = false;
        this.snackbar = true;
        this.error = error.message;
      }
    },
    async googleSignin() {
      try {
        this.loadingGoogle = true;
        await this.signInWithGoogle();
        this.loadingGoogle = false;
      } catch (error) {
        console.error();
        this.loadingGoogle = false;
        this.snackbar = true;
        this.error = error.message;
      }
    },
  },
};
</script>
