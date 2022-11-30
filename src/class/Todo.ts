import { db } from "@/main";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

/* eslint-disable */
export class ToDo {
  isCompleted: boolean;
  body: string;
  dueDate: Date;
  id: string;
  isSaving = false;
  userId: string;

  constructor(
    body: string,
    isCompleted: boolean,
    dueDate: Date,
    id: string,
    userId: string
  ) {
    this.body = body;
    this.isCompleted = isCompleted;
    this.dueDate = dueDate;
    this.id = id;
    this.userId = this.userId;
  }

  get dueDateFormated() {
    return this.dueDate ? dayjs(this.dueDate).format("DD/MM/YYYY") : " ";
  }

  async updateBody(body: string) {
    this.isSaving = true;
    this.body = body;
    const todoRef = doc(db, "todos", this.id);

    await updateDoc(todoRef, {
      body: this.body,
    });
    this.isSaving = false;
  }

  async deleteMe() {
    this.isSaving = true;
    const todoRef = doc(db, "todos", this.id);

    await deleteDoc(todoRef);
    this.isSaving = false;
  }

  async toggleStatus() {
    this.isSaving = true;
    const todoRef = doc(db, "todos", this.id);

    await updateDoc(todoRef, {
      isCompleted: this.isCompleted,
    });
    this.isSaving = false;
  }
}
