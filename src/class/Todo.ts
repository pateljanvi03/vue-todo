import { db } from "@/main";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

/* eslint-disable */
export class ToDo {
  isCompleted: boolean;
  body: string;
  id: string;
  isSaving = false;
  userId: string;

  constructor(body: string, isCompleted: boolean, id: string, userId: string) {
    this.body = body;
    this.isCompleted = isCompleted;
    this.id = id;
    this.userId = this.userId;
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
