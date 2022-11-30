<template>
  <div class="font-sans">
    <div
      class="flex justify-between items-center w-96 bg-white rounded-t-lg py-3 px-3 shadow-2xl"
    >
      <div class="flex items-center" v-if="isPageReady">
        <img :src="authUser.photoURL" class="rounded-full h-8 w-8" />
        <label class="ml-2">{{ authUser.displayName }} </label>
      </div>

      <div v-if="isPageReady">
        <button
          class="text-white bg-indigo-500 font-medium rounded-lg text-sm py-2 px-3 ml-2 hover:bg-indigo-600"
          @click="logOut"
        >
          Logout
        </button>
      </div>

      <div class="w-full flex justify-center" v-if="!isPageReady">
        <Loader />
      </div>
    </div>

    <div
      class="w-96 bg-white h-auto mt-5 shadow-2xl rounded-b-lg"
      v-if="todoList"
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
            class="flex text-white bg-indigo-400 enabled:bg-indigo-500 font-medium rounded-lg text-sm px-4 py-3 ml-2"
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
        v-if="todoList && todoList.isLoadingData == true"
        class="flex justify-center my-2"
      >
        <Loader />
      </div>

      <div
        v-else-if="todoList.filteredTodos.length == 0"
        class="flex justify-center item-center py-3"
      >
        <label> No tasks </label>
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
              class="w-4 h-4 accent-indigo-500"
              :id="todo.id"
            />

            <div class="flex justify-between items-center w-full">
              <div class="flex flex-col">
                <label class="ml-2 text-sm text-gray-900" :for="todo.id">
                  {{ todo.body }}
                </label>
                <label class="text-gray-300 text-xs pt-1 px-2"
                  >{{ todo.dueDateFormated }}
                </label>
              </div>

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

          <div v-if="todoList.isLoadingTask" class="flex justify-center my-2">
            <loader />
          </div>
        </div>
      </div>

      <!-- Box Footer -->
      <div class="px-3 py-2 bg-slate-100 rounded-b-lg">
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
import { db, auth } from "@/main";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import Loader from "@/components/Loader.vue";

export default Vue.extend({
  name: "ListView",

  components: {
    Loader,
  },

  data() {
    return {
      isPageReady: false,
      todoList: undefined,
      newTaskBody: "",
      index: -1,
      authUser: {},
    };
  },

  async mounted() {
    await this.loadData();
  },

  methods: {
    async loadData() {
      if (auth.currentUser) {
        this.initData();
      } else {
        const idToken = localStorage.getItem("idToken");
        const accessToken = localStorage.getItem("accessToken");

        if (idToken && accessToken) {
          try {
            const credential = GoogleAuthProvider.credential(
              idToken,
              accessToken
            );
            await signInWithCredential(auth, credential);
            this.initData();
          } catch (err) {
            this.$router.push({ name: "login" });
          }
        } else {
          this.$router.push({ name: "login" });
        }
      }
    },

    initData() {
      this.authUser = auth.currentUser;
      this.todoList = new TodoList(auth.currentUser.uid);
      this.isPageReady = true;
      this.todoList.loadDataFromDatabase();
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
      if (confirm("Are you sure you wants to delete all the comleted tasks?")) {
        await this.todoList.clearCompletedTodo();
      }
    },

    async deleteDocument(index: number) {
      if (confirm("Are you sure you wants to delete?")) {
        await this.todoList.deleteTodo(index);
      }
    },

    async clearTodo() {
      if (confirm("Are you sure you wants to delete the list?")) {
        await this.todoList.deleteAllTodos();
      }
    },

    async logOut() {
      await signOut(auth);
      localStorage.clear();

      this.$router.push({ name: "login" });
    },
  },
});
</script>
