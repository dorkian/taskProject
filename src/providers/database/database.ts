import { HttpModule } from '@angular/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class DatabaseProvider {

  private db: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  options: any = {
    name: 'taskdb.db',
    location: 'default'
}

  constructor(private sqlite: SQLite, private platform: Platform,public http: HttpModule) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.connectToDb();
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  private connectToDb() {
    this.sqlite.create(this.options
    ).then((db: SQLiteObject) => {
      this.db = db;
      this.db.executeSql('CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY,title TEXT,desc TEXT, deadline TEXT, priority NUMBER)', {})
        .then(res => {
          this.databaseReady.next(true);
        })
        .catch(e => console.log('ERROR in create/open db: ' + e.message));
    });
  }

  getAllTasks():any{
    return this.db.executeSql('SELECT * FROM tasks ORDER BY id  ASC',[])
      .then((res) => {
        let tasks = [];
        if(res.rows.length > 0){ 
          for(var i=0; i<res.rows.length; i++) {
            tasks.push({id:res.rows.item(i).id,title:res.rows.item(i).title,deadline:res.rows.item(i).deadline,priority:res.rows.item(i).priority});
          }
        }
        return tasks;
      })
      .catch(e => { 
        console.log('ERROR in load task list: ' + e.message);
        return [];
      });
  }

  getTaskById(id):any{
    return this.db.executeSql('SELECT * FROM tasks WHERE id = ? ',[id])
      .then((res) => {
        let task;
        if(res.rows.length > 0){ 
          task = {id : res.rows.item(0).id,
                  title:res.rows.item(0).title,
                  description:res.rows.item(0).desc,
                  priority:res.rows.item(0).priority,
                  deadline:res.rows.item(0).deadline};
        }
        return task;
      })
      .catch(e => { 
        console.log('ERROR in load task : ' + e.message);
        return null;
      });
  }

  saveTask(task){
    let cmd = '';
    let params = [];
    if(task.id == 0){
      cmd = 'INSERT INTO tasks VALUES(NULL,?,?,?,?)';
      params = [task.title,task.description,task.deadline,task.priority];
    }
    else{
      cmd = 'UPDATE tasks set title = ?, desc = ? , priority = ? , deadline = ? WHERE id = ?';
      params = [task.title,task.description,task.priority,task.deadline,task.id];
    }
    
    return this.db.transaction(transaction =>{
      transaction.executeSql(cmd,
        params,
        function (transaction, resultSet) {
          if(task.id == 0){
            task.id = resultSet.insertId;
          }
        });
    });
  }

  deleteTask(taskId){
    let cmd = '';
    let params = [];
    if(taskId != 0){
      cmd = 'DELETE FROM tasks WHERE id = ?';
      params = [taskId];
    }

    return this.db.transaction(transaction =>{
      transaction.executeSql(cmd, params,
        function (transaction, resultSet) {
          
        })});

  }

}
