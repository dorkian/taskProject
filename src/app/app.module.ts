import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { DatabaseProvider } from '../providers/database/database';
import { HttpModule } from '@angular/http';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DetailPageModule } from '../pages/detail/detail.module'


@NgModule({
  declarations: [
    MyApp,
    HomePage
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DetailPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Toast,
    DatabaseProvider,
    LocalNotifications
  ]
})
export class AppModule {}
