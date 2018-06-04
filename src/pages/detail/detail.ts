import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { DatabaseProvider } from '../../providers/database/database';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  
  currentdate: String = new Date().toISOString();
  maxdate: String = new Date(new Date().getFullYear()+5,new Date().getMonth(),new Date().getDate()).toISOString();
  task:any={id : 0,title:"",description:"",priority:0,deadline:""};

  constructor(public navCtrl: NavController, public navParams: NavParams,private localNotifications: LocalNotifications,
    private toast: Toast,
    private dbService:DatabaseProvider) {

      this.task.id = this.navParams.get('taskId');
      if(this.task.id != 0){
        this.dbService.getDatabaseState().subscribe(rdy => {
          if (rdy) {
              this.dbService.getTaskById(this.task.id).then(data =>{
              this.task = data;
            });
          }
        });
      }

      
  }

  saveData() {
    this.dbService.saveTask(this.task).then(res => {
      console.log('The inserted id is : '+ this.task.id);
        this.toast.show('Data saved', '5000', 'center').subscribe(
        toast => {
          this.scheduleNotification();
          this.navCtrl.popToRoot();
        }
      );
    })
    .catch(e => {
        this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log('ERROR in save data : ' + e.message);
        }
      );
    });
   }

  scheduleNotification(){
    this.localNotifications.requestPermission();

    let deadline:Date = new Date(this.task.deadline+" 10:00");

    this.localNotifications.schedule({
      id:this.task.id,
      text: 'To Do : ' + this.task.title,
      trigger: {at: deadline},
      led: 'FF0000',
      sound: null,
      vibrate:true,
      launch:true,
      autoClear:true,
      lockscreen:true
    });
  }
  
}
