<template>
  <v-card class="pa-4 d-flex flex-column mb-6">
    <v-card-title class="d-flex justify-center">
      <p>Register</p>
    </v-card-title>
    <v-form>
      <v-text-field
        outlined
        v-model="displayName"
        :error-messages="nameErrors"
        prepend-inner-icon="mdi-account"
        label="Name"
        required
        @input="$v.displayName.$touch()"
        @blur="$v.displayName.$touch()"
      ></v-text-field>
      <v-text-field
        outlined
        v-model="email"
        :error-messages="emailErrors"
        prepend-inner-icon="mdi-card-account-mail"
        label="E-mail"
        required
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      ></v-text-field>
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
      <div class="d-flex justify-space-between">
        <v-btn class="mr-4 green" @click="submit" :disabled="$v.$invalid">
          Register
        </v-btn>
        <v-btn class="mr-4 secondary" @click="$emit('login-event', !isLogin)">
          Back to Login
        </v-btn>
      </div>
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
import { required, email, minLength } from "vuelidate/lib/validators";
import { auth, createUserProfileDoc } from "@/firebase";

export default {
  mixins: [validationMixin],

  validations: {
    displayName: { required, minLength: minLength(2) },
    email: { required, email },
    password: { required, minLength: minLength(8) },
  },

  data: () => ({
    displayName: "",
    email: "",
    password: "",
    loading: false,
    error: null,
    snackbar: false,
  }),

  props: {
    isLogin: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.displayName.$dirty) return errors;
      !this.$v.displayName.minLength &&
        errors.push(
          `Name must be at least ${this.$v.displayName.$params.minLength.min} characters long`
        );
      !this.$v.displayName.required && errors.push("Name is required.");
      return errors;
    },
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
  },

  methods: {
    async submit() {
      try {
        this.loading = true;
        const { user } = await auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        await createUserProfileDoc(user, { name: this.displayName });
        this.loading = false;
        this.$emit("login-event", !this.isLogin);
      } catch (error) {
        console.error(error);
        this.loading = false;
        this.snackbar = true;
        this.error = error.message;
      }
    },
  },
};
</script>