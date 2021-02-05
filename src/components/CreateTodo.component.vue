<template>
  <v-container>
    <div :class="[bpValue ? 'text-h4 mb-10' : 'text-h2 mb-6']">
      {{ mode === "crt" ? "Create Todo" : "Update Todo" }}
    </div>
    <form>
      <v-text-field
        v-model="title"
        label="Title"
        outlined
        required
      ></v-text-field>
      <v-textarea
        name="input-7-1"
        label="Description"
        outlined
        v-model="description"
        hint="Enter your todo description"
        required
      ></v-textarea>
      <v-select
        outlined
        v-model="select"
        :items="items"
        label="Priority"
        required
      ></v-select>
      <p class="text-subtitle-1">Pick a Date</p>
      <div
        :class="[
          bpValue ? 'flex-column' : 'flex-row',
          'd-flex justify-space-around',
        ]"
      >
        <v-date-picker
          :min="startDate"
          v-model="date"
          elevation="2"
        ></v-date-picker>
        <v-time-picker
          v-model="time"
          format="24hr"
          elevation="2"
        ></v-time-picker>
      </div>
      <v-radio-group v-model="type" row>
        <v-radio label="Home" value="home"></v-radio>
        <v-radio label="Business" value="business"></v-radio>
      </v-radio-group>
      <div class="d-flex justify-space-between">
        <v-btn
          dark
          class="mr-4 mt-4 green"
          block
          @click="submit"
          :loading="loading"
        >
          {{ mode === "crt" ? "Add" : "Update" }}
        </v-btn>
        <!-- <v-btn
          dark
          class="mr-4 mt-4 warning"
          @click="$emit('close-dialog', false)"
        >
          Cancel
        </v-btn> -->
        <v-fab-transition>
          <v-btn
            fab
            fixed
            large
            dark
            top
            right
            :class="[bpValue ? 'mr-3' : ' mr-6', 'warning v-btn--example mb-6']"
            @click="$emit('close-dialog', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-fab-transition>
      </div>
    </form>
    <v-snackbar v-model="snackbar">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import moment from "moment";
import { createTodoDoc, updateTodoDoc } from "@/firebase";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      snackbar: false,
      text: "",
      mode: "crt",
      title: "",
      description: "",
      select: null,
      items: ["High Priority", "Low Priority"],
      type: "home",
      startDate: this.getStartDate(),
      date: this.getStartDate(),
      time: this.getStartTime(),
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    propTitle: String,
    propDescription: String,
    propFav: Boolean,
    propType: String,
    propTime: Number,
    propTodoId: String,
  },
  methods: {
    createTodoDoc: createTodoDoc,
    updateTodoDoc: updateTodoDoc,
    async submit() {
      let current = Date.now().toString().split("").slice(0, -5).join("");
      let formattedDate = new Date(this.formatDate)
        .getTime()
        .toString()
        .split("")
        .slice(0, -5)
        .join("");
      if (current > formattedDate) {
        this.snackbar = true;
        this.text = "Please provide a future date";
        return;
      }

      if (!this.title.trim()) {
        this.snackbar = true;
        this.text = "Please enter title";
        return;
      }

      if (!this.description.trim()) {
        this.snackbar = true;
        this.text = "Please enter description";
        return;
      }

      if (!this.select.trim()) {
        this.snackbar = true;
        this.text = "Please select priority";
        return;
      }
      try {
        this.loading = true;
        if (this.mode === "crt") {
          await this.createTodoDoc(this.userId, {
            title: this.title,
            description: this.description,
            fav: this.select === "High Priority" ? true : false,
            type: this.type,
            finished: false,
            date: new Date(this.formatDate),
          });
          // this.$store.dispatch("todo/addTodo", todo);
        } else {
          await this.updateTodoDoc(this.userId, this.propTodoId, {
            title: this.title,
            description: this.description,
            fav: this.select === "High Priority" ? true : false,
            type: this.type,
            finished: false,
            date: new Date(this.formatDate),
          });
          // this.$store.dispatch("todo/updateTodo", todo);
        }
        this.$emit("close-dialog", false);
      } catch (error) {
        this.loading = false;
        this.snackbar = true;
        this.text = error.message;
      }
    },
    getStartTime(startTime = Date.now()) {
      let time = new Date(startTime).toTimeString().split(" ")[0];
      time = time.split(":");
      let [hh, mm] = time;
      time = hh + ":" + mm;
      return time;
    },
    getStartDate(startTime = Date.now()) {
      return moment(startTime).format("YYYY-MM-DD");
    },
  },
  computed: {
    bpValue() {
      return this.$vuetify.breakpoint.width < 600;
    },
    formatDate() {
      let getTime = this.time.split(":");
      let dvdr = ":";
      let ss = "00";
      let [hh, mm] = getTime;
      if (Number(hh) >= 12 && Number(mm) > 0) {
        getTime = hh + dvdr + mm + dvdr + ss;
      } else {
        getTime = hh + dvdr + mm + dvdr + ss;
      }
      return new Date(this.date + ", " + getTime);
    },
    ...mapGetters({ userId: "user/getId" }),
  },
  created() {
    if (this.propTodoId) {
      this.mode = "upd";
      this.title = this.propTitle;
      this.description = this.propDescription;
      this.select = this.propFav ? "High Priority" : "Low Priority";
      this.type = this.propType;
      this.time = this.getStartTime(this.propTime);
      this.date = this.getStartDate(this.propTime);
      this.startDate = this.getStartDate();
    }
  },
};
</script>

