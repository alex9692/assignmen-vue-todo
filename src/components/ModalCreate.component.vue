<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            fab
            fixed
            large
            dark
            bottom
            left
            class="indigo v-btn--example"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <v-card>
        <CreateTodo
          :dialog="dialog"
          @close-dialog="dialog = $event"
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
  methods: {
    submit() {},
  },
  created() {},
};
</script>