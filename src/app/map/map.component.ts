import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Ad, Point, Creative } from '../Ad';
import { adDispatcher, IAdEvent } from 'ubimo-fed-home-assigment';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('inOut', [
      state('void', style({opacity: 0, transform: 'translate(-50%, -50%) scale(0.1)'})), 
      transition('void <=> *',[
        animate(200)
      ])
    ])
  ]
})
export class MapComponent implements OnInit {

  private ads: AdDisplay[];
  //private width: number;
  readonly OriginalWidth: number = 1280;
  readonly OriginalHeight: number = 1877;
  //static mapImage: any; 


  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    adDispatcher.registerToAdEvents((event) => this.onNewAd(event) );
    this.ads = [];
    //var mapImage = document.getElementById("map-img");
    //MapComponent.mapImage = document.getElementById("map-img");
    //this.width = MapComponent.mapImage.offsetWidth;
    //this.height = mapImage.offsetHeight;
    // window.onresize = (() => this.onResize());
  }

  private onNewAd(event){
    var newAd={
      coordinates: this.normalize(event.coordinates),
      url: event.creative.url,
      type: event.type
    }

    this.ads.push(newAd);
    this.changeDetector.detectChanges();

    setTimeout(()=>this.remove(), 5000);
  }

  private normalize(coordinates: Point): Point{
    //returns the value in percentage!
    var wratio: number = 100 / this.OriginalWidth;
    var hratio: number = 100 / this.OriginalHeight;

    return {x: coordinates.x * wratio, y: coordinates.y * hratio};
  }

  // private onResize(){
  //   this.width = MapComponent.mapImage.offsetWidth; 
  // }

  private remove(){
    this.ads.shift();
    this.changeDetector.detectChanges();
  }
}

interface AdDisplay{
  url: string;
  coordinates: Point;
  type: string;
}


