import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})

export class NoteListService {
  // items$: Observable<any[]>;
  firestore: Firestore = inject(Firestore);

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];


  unsubTrash;
  unsubNotes;


  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
  };

  async deleteNote(colId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => { console.error(err) }
    );
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJSON(note)).catch(
        (err) => { console.error(err) }
      );
    }
  }

  getCleanJSON(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  };

  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash'
    }
  }

  async addNote(item: Note, colId: "notes" | "trash") {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => {
        console.error(err);
      }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef?.id); }
    );
    return colId
  }


  // async addNote(item: Note, colId: "notes" | "trash") {
  //   try {
  //     const docRef = await addDoc(this.getNotesRef(), item);
  //     console.log("Document written with ID: ", docRef.id);
  //     return colId;
  //   } catch (err) {
  //     console.error(err);
  //     throw err;
  //   }
  // }


  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }




}