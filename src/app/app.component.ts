import { Component, OnInit } from '@angular/core';
import { adDispatcher, IAdEvent } from 'ubimo-fed-home-assigment';
import { Ad, Point, Creative } from './Ad';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jonsnowad';
  private number: number = 0;

  ngOnInit(){
    console.log(adDispatcher);

    adDispatcher.registerToAdEvents((event) => this.onNewAd(event));
  }
  
  private onNewAd(event){
    //console.log("new Ad " + ++this.number)
  }
}
