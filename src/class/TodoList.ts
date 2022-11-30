/* eslint-disable */
import { db } from "@/main";
import dayjs from "dayjs";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ToDo } from "./Todo";

export class TodoList {
  lists: ToDo[] = [];
  isLoadingData = false;
  isLoadingTask = false;
  filterByCompleted: undefined;
  authUserId: string;

  constructor(authUserId: string) {
    this.authUserId = authUserId;
  }

  get filteredTodos() {
    return this.lists.filter(
      (x: any) =>
        this.filterByCompleted == undefined ||
        x.isCompleted == this.filterByCompleted
    );
  }

  get countOfPendingTasks() {
    return this.lists.filter((x) => x.isCompleted == false).length;
  }

  async deleteTodo(index: number) {
    await this.lists[index].deleteMe();
    this.lists.splice(index, 1);
  }

  async addTodo(body: string) {
    this.isLoadingTask = true;
    const docRef = await addDoc(collection(db, "todos"), {
      body,
      isCompleted: false,
      dueDate: dayjs().startOf("day").toDate(),
      userId: this.authUserId,
    });

    this.lists.push(
      new ToDo(
        body,
        false,
        dayjs().startOf("day").toDate(),
        docRef.id,
        this.authUserId
      )
    );
    this.isLoadingTask = false;
  }

  async loadDataFromDatabase() {
    this.isLoadingData = true;
    this.lists = [];

    const q = query(
      collection(db, "todos"),
      where("userId", "==", this.authUserId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      this.lists.push(
        new ToDo(
          data.body,
          data.isCompleted,
          data.dueDate.seconds
            ? dayjs(data.dueDate.toMillis()).startOf("day").toDate()
            : dayjs().startOf("day").toDate(),
          doc.id,
          this.authUserId
        )
      );
    });

    this.isLoadingData = false;
  }

  async deleteAllTodos() {
    for (let todo of this.lists) {
      await todo.deleteMe();
    }

    await this.loadDataFromDatabase();
  }

  async clearCompletedTodo() {
    for (let todo of this.lists) {
      if (todo.isCompleted == true) {
        await todo.deleteMe();
      }
    }

    await this.loadDataFromDatabase();
  }
}
