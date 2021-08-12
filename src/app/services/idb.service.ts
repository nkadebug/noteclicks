import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Dexie from 'dexie';
import { Note } from '../model/note';

@Injectable({
  providedIn: 'root'
})
export class IdbService extends Dexie {

  public notes!: Dexie.Table<Note, string>;

  constructor(private fs: AngularFirestore) {
    super("noteclicks");

    this.version(3).stores({
      notes: "id,ts,uid,trashed"
    });

    this.notes.hook('creating').subscribe((id, note, tx) => {
      console.log(Date.now(), 'Creating...');
      tx.on("complete", function () {
        console.log(Date.now(), 'Created', id, note);
        fs.collection(localStorage.uid).doc(id).set(note).then(() => {
          console.log(id, "synced");
        }).catch((e) => {
          console.log(e);
        })
      });
    });

    if (!localStorage.idbInitialized) {
      this.fetchFromFS();
    }
  }

  fetchFromFS(startAfter?: string, limit = 2) {
    
    this.fs.collection(localStorage.uid, ref => {
    
      let newRef = ref.orderBy('id');
    
      if (startAfter) {
        newRef = newRef.startAfter(startAfter)
      }
    
      newRef = newRef.limit(limit)
    
      return newRef;
    
    }).get().subscribe((s) => {
      
      if (s.size) {
        
        let lastDocId = "";
        
        s.forEach(doc => {
          console.log(doc.id, doc.data());
          let note:any = doc.data();
          this.notes.put(note);
          lastDocId = doc.id;
        });

        if(s.size == limit){
          this.fetchFromFS(lastDocId);
        }else{
          console.log('All docs fetched');
          localStorage.idbInitialized = true;
        }

      } else {
        console.log('All docs fetched');
      }
    });
  }
}
