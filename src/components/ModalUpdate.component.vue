<template>
  <v-row>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mx-4 align-self-end mb-6"
          fab
          dark
          x-small
          color="cyan"
          v-bind="attrs"
          v-on="on"
          @click="$store.dispatch('todo/selectedTodo', id)"
        >
          <v-icon dark> mdi-pencil </v-icon>
        </v-btn>
      </template>
      <v-card>
        <CreateTodo
          :dialog="dialog"
          @close-dialog="dialog = $event"
          :propTitle="title"
          :propDescription="description"
          :propFav="fav"
          :propType="type"
          :propTime="Number(date)"
          :propTodoId="id"
        ></CreateTodo>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import CreateTodo from "@/components/CreateTodo.component.vue";

export default {
  components: { CreateTodo },
  data() {
    return {
      dialog: false,
    };
  },
  props: ["date", "title", "description", "fav", "id", "type"],
  methods: {
    submit() {},
  },
  created() {},
};
</script>