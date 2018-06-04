import { IonicPageModule } from 'ionic-angular';
import { DetailPage } from './detail';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    DetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailPage),
  ],
})
export class DetailPageModule {}