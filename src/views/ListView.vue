<template>
  <div class="font-sans">
    <div
      class="flex justify-between items-center w-96 bg-white rounded-lg py-3 px-3 shadow-2xl"
    >
      <div class="flex items-center">
        <img :src="authUser.photoURL" class="rounded-full h-8 w-8" />
        <label class="ml-2">{{ authUser.displayName }} </label>
      </div>

      <div>
        <button
          class="text-white bg-violet-600 font-medium rounded-lg text-sm py-2 px-3 ml-2 hover:bg-violet-700"
        >
          Logout
        </button>
      </div>
    </div>

    <div
      v-if="todoList"
      class="w-96 bg-white h-auto mt-5 rounded-lg shadow-2xl"
    >
      <!-- Box Header -->
      <div class="bg-slate-100 px-4 py-2">
        <div class="flex my-4">
          <input
            type="text"
            v-model="newTaskBody"
            class="text-sm rounded-lg w-full p-2.5 shadow-2xl border border-gray-300 mx-3"
            placeholder="Add task"
          />

          <button
            @click="addtoTodo"
            class="flex text-white bg-violet-300 enabled:bg-violet-600 font-medium rounded-lg text-sm px-4 py-3 ml-2"
            :disabled="newTaskBody == ''"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              stroke-width="2.0"
              stroke="white"
              class="w-4 h-4 mr-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Box Lists -->
      <div
        v-if="this.todoList.isLoadingData == true"
        class="flex justify-center my-2"
      >
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-100"
            cx="12"
            cy="12"
            r="10"
            stroke="violet"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <div v-else>
        <div class="p-3">
          <div v-if="todoList.lists.length > 0" class="flex justify-between">
            <button
              @click="completeAllTasks"
              class="text-left text-gray-400 hover:text-black"
            >
              Complete all tasks
            </button>
            <button
              @click="clearComletedTasks"
              class="text-gray-400 text-right place-items-end hover:text-black"
            >
              Clear completed
            </button>
          </div>
        </div>

        <hr v-if="todoList.lists.length > 0" class="mb-2" />

        <div>
          <div
            class="flex items-center group px-3 py-3 border-b"
            v-for="(todo, index) in todoList.filteredTodos"
            :key="index"
          >
            <input
              :name="todo.id"
              v-model="todo.isCompleted"
              @change="(val) => todo.toggleStatus(val)"
              type="checkbox"
              class="w-4 h-4"
              :id="todo.id"
            />

            <div class="flex justify-between items-center w-full">
              <label
                class="ml-2 text-sm text-gray-900 dark:text-gray-300"
                :for="todo.id"
              >
                {{ todo.body }}
              </label>

              <div class="flex pl-1 items-center">
                <button
                  @click="edit(index, todo.id)"
                  class="text-gray-400 text-sm px-2 hover:text-black"
                >
                  Edit
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 23"
                  stroke-width="1.5"
                  stroke="gray"
                  class="w-6 h-6 pt-1 pb-1 hover:stroke-black hover:cursor-pointer"
                  @click="deleteDocument(index)"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            v-if="this.todoList.isLoadingTask"
            class="flex justify-center my-2"
          >
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-100"
                cx="12"
                cy="12"
                r="10"
                stroke="violet"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Box Footer -->
      <div class="px-3 py-2 bg-slate-100">
        <div v-if="todoList.lists.length > 0" class="flex justify-between">
          <div class="inline-flex">
            <a
              href="#"
              @click="todoList.filterByCompleted = undefined"
              :class="
                todoList.filterByCompleted == undefined
                  ? 'text-black'
                  : 'text-gray-400'
              "
              class="py-2 px-1 text-sm font-medium text-gray-400 hover:text-black"
            >
              All
            </a>
            <a
              href="#"
              @click="todoList.filterByCompleted = false"
              :class="
                todoList.filterByCompleted == false
                  ? 'text-black'
                  : 'text-gray-400'
              "
              class="py-2 px-1 text-sm font-medium text-gray-400 hover:text-black"
            >
              Pending
            </a>
            <a
              href="#"
              @click="todoList.filterByCompleted = true"
              :class="
                todoList.filterByCompleted == true
                  ? 'text-black'
                  : 'text-gray-400'
              "
              class="py-2 px-1 text-sm font-medium text-gray-400 hover:text-black"
            >
              Completed
            </a>
          </div>
          <button
            @click="clearTodo"
            class="text-gray-400 sm:pl-20 focus:text-black mr-0 hover:text-black"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TodoList } from "@/class/TodoList";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import { getAuth } from "firebase/auth";

export default Vue.extend({
  name: "ListView",

  data() {
    return {
      todoList: undefined,
      newTaskBody: "",
      index: -1,
      authUser: {},
    };
  },

  async mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      setTimeout(async () => {
        const auth = getAuth();
        if (!auth.currentUser) {
          this.$router.push({ name: "login" });
        } else {
          this.authUser = auth.currentUser;
          this.todoList = new TodoList(auth.currentUser.uid);
          this.todoList.loadDataFromDatabase();
        }
      }, 1000);
    },

    async addtoTodo() {
      if (this.index !== -1) {
        await this.todoList.lists[this.index].updateBody(this.newTaskBody);
        this.index = -1;
      } else {
        this.todoList.addTodo(this.newTaskBody);
      }

      this.newTaskBody = "";
    },

    async edit(index: number) {
      this.newTaskBody = this.todoList.lists[index].body;
      this.index = index;
    },

    async completeAllTasks() {
      for (let todo of this.todoList.lists) {
        todo.isCompleted = true;
        const listRef = doc(db, "todos", todo.id);
        await updateDoc(listRef, { isCompleted: true });
      }
    },

    async clearComletedTasks() {
      await this.todoList.clearCompletedTodo();
    },

    async deleteDocument(index: number) {
      await this.todoList.deleteTodo(index);
    },

    async clearTodo() {
      await this.todoList.deleteAllTodos();
    },

    logout() {
      //
    },
  },
});
</script>
