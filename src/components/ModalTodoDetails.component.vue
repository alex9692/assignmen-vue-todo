<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <!-- <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
          Click Me
        </v-btn> -->
        <v-btn
          class="mx-2 align-self-end mb-3"
          fab
          dark
          x-small
          color="red"
          v-bind="attrs"
          v-on="on"
          @click="$store.dispatch('todo/selectedTodo', id)"
        >
          <v-icon dark> mdi-eye </v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline">
          {{ selectedTodo && selectedTodo.title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-6">
          {{ selectedTodo && selectedTodo.description }}
        </v-card-text>
        <v-card-text class="text-caption d-flex justify-end">{{
          selectedTodo && selectedTodo.date | momentFormat
        }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      dialog: false,
      moment: moment,
    };
  },
  filters: {
    momentFormat(val) {
      return moment(val).format("MMMM Do YYYY, h:mm:ss a");
    },
  },
  props: {
    selectedTodo: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      required: true,
    },
  },
};
</script>