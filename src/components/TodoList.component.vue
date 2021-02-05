<template>
  <div>
    <v-list two-line class="mt-8">
      <v-list-item-group>
        <div class="d-flex justify-space-between">
          <div class="text-h2">TodoList</div>
          <div class="align-self-end mb-2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-3"
                  :color="mode === 'asc' ? 'green' : 'secondary'"
                  icon
                  @click="sortAscending"
                >
                  <v-icon dark v-bind="attrs" v-on="on">
                    mdi-sort-clock-ascending-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Sort Ascending</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-3"
                  :color="mode === 'dsc' ? 'green' : 'secondary'"
                  icon
                  @click="sortDescending"
                >
                  <v-icon dark v-bind="attrs" v-on="on">
                    mdi-sort-clock-descending-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Sort Descending</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="mr-3"
                  color="red"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="moveToArchive"
                >
                  mdi-trash-can-outline
                </v-icon>
              </template>
              <span>Delete All</span>
            </v-tooltip>
            <v-menu
              offset-y
              left
              bottom
              origin="center center"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="grey" dark v-bind="attrs" v-on="on">
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item-group>
                  <v-list-item
                    v-for="(item, i) in menuItems"
                    :key="i"
                    @click="showTodos(item.val)"
                  >
                    <v-list-item-action-text>{{
                      item.title
                    }}</v-list-item-action-text>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </div>
        </div>
        <v-divider></v-divider>
        <template v-if="todoCount">
          <div v-for="item in todos" :key="item.id">
            <v-slide-x-transition mode="out-in">
              <v-list-item :class="[item.finished ? 'bg-error' : '']">
                <div class="mr-3 d-flex flex-column">
                  <v-icon
                    color="green"
                    dark
                    @click="addToFav(item.id, !item.fav)"
                  >
                    {{ item.fav ? "mdi-star" : "mdi-star-outline" }}
                  </v-icon>
                  <v-icon
                    :color="item.type === 'business' ? 'orange' : 'brown'"
                    class="mt-4"
                    dark
                  >
                    {{
                      item.type === "business"
                        ? "mdi-office-building"
                        : "mdi-home"
                    }}
                  </v-icon>
                </div>
                <v-divider vertical></v-divider>
                <v-list-item-content class="ml-3">
                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.title"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    class="mt-6"
                    v-text="item.description"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text class="mb-6 mr-2">{{
                    item.date | momentFormat
                  }}</v-list-item-action-text>

                  <div class="d-flex justify-space-between">
                    <div
                      v-if="item.finished"
                      class="font-italic align-self-end mx-2"
                    >
                      Finished
                    </div>
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="warning"
                      @click="updateStatus(item.id, false)"
                      v-if="item.finished"
                    >
                      <v-icon dark> mdi-reload-alert </v-icon>
                    </v-btn>
                    <ModalDetails
                      v-if="!item.finished"
                      :selectedTodo="selectedTodo"
                      :id="item.id"
                    />
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="green"
                      @click="updateStatus(item.id, true)"
                      v-if="!item.finished"
                    >
                      <v-icon dark> mdi-check </v-icon>
                    </v-btn>
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="error"
                      @click="removeTodo(item.id)"
                      v-if="!item.finished"
                    >
                      <v-icon dark> mdi-minus </v-icon>
                    </v-btn>
                    <ModalUpdate v-if="!item.finished" v-bind="item" />
                  </div>
                </v-list-item-action>
              </v-list-item>
            </v-slide-x-transition>
            <v-divider></v-divider>
          </div>
        </template>
        <template v-else>
          <div class="red--text mt-16 text-h3 d-flex justify-center">
            Empty... Go create one!!
          </div>
        </template>
        <template v-if="todoCount && !todos.length">
          <div class="warning--text mt-16 text-h3 d-flex justify-center">
            Sorry Todo not found!!
          </div>
        </template>
      </v-list-item-group>
    </v-list>
    <ModalCreate />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import ModalCreate from "@/components/ModalCreate.component.vue";
import ModalUpdate from "@/components/ModalUpdate.component.vue";
import ModalDetails from "@/components/ModalTodoDetails.component.vue";
import { removeTodoDoc, removeAllTodoDoc, updateTodoDoc } from "../firebase";

export default {
  components: {
    ModalCreate,
    ModalUpdate,
    ModalDetails,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    todos: [],
    mode: "",
    moment: moment,
    menuItems: [
      { title: "Show fav", val: "fav" },
      { title: "Show only home", val: "home" },
      { title: "show only business", val: "business" },
      { title: "Show all", val: "all" },
    ],
  }),
  computed: {
    ...mapGetters({
      items: "todo/getAllTodos",
      todoCount: "todo/getTodoCount",
      selectedTodo: "todo/getSelectedTodo",
    }),
    sortAsc() {
      return [...this.todos].sort(function (a, b) {
        if (new Date(a.date).getTime() < new Date(b.date).getTime()) return -1;
        if (new Date(a.date).getTime() > new Date(b.date).getTime()) return 1;
        return 0;
      });
    },
    sortDesc() {
      return [...this.todos].sort(function (a, b) {
        if (new Date(a.date).getTime() > new Date(b.date).getTime()) return -1;
        if (new Date(a.date).getTime() < new Date(b.date).getTime()) return 1;
        return 0;
      });
    },
  },
  filters: {
    momentFormat(val) {
      // return moment(val).format("MMMM Do YYYY, h:mm:ss a");
      return moment(val).format("YYYY-MM-DD");
    },
  },
  watch: {
    items(val) {
      this.todos = val;
    },
  },
  mounted() {
    this.todos = this.items;
  },
  methods: {
    async addToFav(id, fav) {
      await updateTodoDoc(this.userId, id, { fav });
      // this.$store.dispatch("todo/updateTodoFav", id);
    },
    async removeTodo(id) {
      await removeTodoDoc(this.userId, id);
      // this.$store.dispatch("todo/removeTodo", id);
    },
    async updateStatus(id, finished) {
      await updateTodoDoc(this.userId, id, { finished });
      // this.$store.dispatch("todo/updateTodoPending", id);
    },
    async moveToArchive() {
      await removeAllTodoDoc(this.userId);
      // this.$store.dispatch("todo/clearTodos");
    },
    sortAscending() {
      this.mode = "asc";
      this.todos = this.sortAsc;
    },
    sortDescending() {
      this.mode = "dsc";
      this.todos = this.sortDesc;
    },
    showTodos(type) {
      switch (type) {
        case "fav":
          this.todos = [...this.items].filter((todo) => todo.fav);
          break;
        case "home":
          this.todos = [...this.items].filter((todo) => todo.type === "home");
          break;
        case "business":
          this.todos = [...this.items].filter(
            (todo) => todo.type === "business"
          );
          break;
        case "all":
          this.todos = [...this.items];
          break;
        default:
          this.todos = [...this.items];
      }
    },
  },
};
</script>

<style lang="css" scoped>
.bg-error {
  background-color: #ffccbc;
}
</style>

// move all finished down
// archive todos to finished page
// view single todo page
// update single todo
// delete single todo