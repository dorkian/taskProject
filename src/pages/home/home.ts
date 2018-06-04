import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { DetailPage } from '../detail/detail';
import { DatabaseProvider } from '../../providers/database/database';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tasks:any = [];

  constructor(public navCtrl: NavController,
    private dbService:DatabaseProvider,
    private toast: Toast,
    public alertCtrl: AlertController,
    private localNotifications: LocalNotifications,
     private plt: Platform) {
      this.plt.ready().then((readySource) => {

        //this.localNotifications.fireQueuedEvents();

        this.localNotifications.on('click').subscribe((res)=>{
          this.navCtrl.push(DetailPage,{taskId:res.id});
        })

        
      });


  }

  ionViewDidLoad() {
    this.dbService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getData();
      }
    });

    
    
  }
  
  ionViewWillEnter() {
    this.dbService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getData();
      }
    });
    
    
  }

  getData(): any {
      this.dbService.getAllTasks().then(data=>{
        this.tasks = data;
      });
  }

  goToTask = function(taskId){
    this.navCtrl.push(DetailPage,{taskId:taskId});
  }




  deleteTask(taskId):any{
    
      this.dbService.deleteTask(taskId).then(res => {
        this.toast.show('Task deleted', '5000', 'center').subscribe(toast => {
          this.getData();
        });
      })
        .catch(e => {
          this.toast.show(e, '5000', 'center').subscribe(toast => {
            console.log('ERROR in delete data : ' + e.message);
          });
        });
  }

  showConfirmation(taskId) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Confirmation',
      message: 'Do you want to delete this task?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteTask(taskId);
          }
        }
      ]
    });
    confirm.present();
  }
}
