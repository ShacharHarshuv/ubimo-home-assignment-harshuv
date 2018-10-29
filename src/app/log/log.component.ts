import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { adDispatcher, IAdEvent } from 'ubimo-fed-home-assigment';
import { Ad, Point, Creative } from '../Ad';
import { trigger, state, style, animate, transition } from '@angular/animations'
//import { start } from 'repl';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  animations: [

    trigger('in', [
      state('void', style({opacity: 0, 'height': '0px', 'margin': '0', visibility: 'hidden'})),
      transition('void <=> *', [
        animate (200)
      ])
    ])
  ]
})
export class LogComponent implements OnInit {

  private adLog: AdLogElem[]; 
  private startTime: number;
  private endTime: number;
  private startIndex: number = 0;
  private endIndex: number = Infinity;
  private indexToRender: number[] = [];
  private nextIndex: number = 0;
  private error: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    //console.log(this);
    adDispatcher.registerToAdEvents((event) => this.onNewAd(event) );
    //init demo array
    this.adLog = [];

    var inputStart = document.getElementById("filter-start");
    var inputEnd =  document.getElementById("filter-end");
    inputStart.onkeypress = ((event) => {
      if (event.keyCode==13) {
        this.filterStart();
        inputStart.blur();
      }
    });
    inputEnd.onkeypress = ((event) => {
      if (event.keyCode==13) {
        this.filterEnd();
        inputEnd.blur();
      }
    });
  }

  private inputCheck(): boolean{ //returns true if input is OK
    if (this.startTime && this.endTime && this.startTime > this.endTime){
      this.error = true;
      this.changeDetector.detectChanges();
      return false;
    }
    else{
      this.error = false;
      this.changeDetector.detectChanges();
      return true;
    }
  }
  private filterStart(){
    //Check to see if input is right
    if (!this.inputCheck()) return;

    if (!this.startTime) this.startIndex = 0;
    else
      this.startIndex = this.findIndex(new Date(this.startTime));

    this.updateArrayIndexes();

  }
  private filterEnd(){
    //Check to see if input is right
    if (!this.inputCheck()) return;

    if (!this.endTime) this.endIndex = Infinity;
    else
      this.endIndex = this.findIndex(new Date(this.endTime));
    this.updateArrayIndexes();
  }
  private findIndex(time: Date): number{ //returns the first index of the ad that arived after "time"
    //implementing binaric search
    
    //special case - the array is empty
    if (!this.adLog[0]) { //aka this.adLog is not defined
      
      if ((new Date()) > time) return 0; //the input time is in the past
      else {
        return Infinity; //the input time is in the future
      }
    }

    //the recurssive function
    var self = this; //before calling the recurssive function, we need to save "This"
    function findIndexInRange(time: Date, starti: number, endi: number): number{
        //console.log("starti = " + starti + " endi = " + endi);
        
        var first: Date = self.adLog[starti].time;
        var last: Date = self.adLog[endi].time;
        
        //console.log("first="+first.getTime() + ", last="+last.getTime());
        //console.log("time="+time.getTime());
        
        //if the last is before time - return last
        //if the first is after time - return it
        if (first >= time){
          return starti;
        }
        else if (last <= time){
          return endi + 1;
        }

        else{
          var middlei = Math.floor( (endi + starti) / 2);
          var middle :Date = self.adLog[middlei].time;
          if (time <= middle){
            return findIndexInRange(time, starti, middlei);
          }
          else {//if (time > middle)
            return findIndexInRange(time, middlei + 1, endi);
          }
        }
    }
    //calling the recurssive function
    return findIndexInRange(time, 0, this.nextIndex - 1);
    //return 3;
  }
  private updateArrayIndexes(){
    var end;
    if (this.endIndex == Infinity){
      end = this.nextIndex; //the lase index
    }
    else
      end = this.endIndex;

    this.indexToRender = [];
    for (var i: number = this.startIndex; i < end; i++){
      this.indexToRender.push(i);
    }
    this.indexToRender.reverse();

    this.changeDetector.detectChanges();
  }
  private onNewAd(event){
    //console.log(this);
    //console.log(event);

    var d = new Date();

    var newAd = {
      name: event.creative.name, 
      url: event.creative.url,
      type: event.type,
      timeStr: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
      time: d,
      coordinates: event.coordinates
    }

    //if filter-start is in the future
    if (this.startIndex == Infinity){
      //I assume this.startTime is defined, otherwise this.startIndex would be 0
      //there is a future lower bound
      if (newAd.time.getTime() >= this.startTime){
        //it should get in
        this.startIndex = this.nextIndex; //the current one
        if (newAd.time.getTime() > this.endTime) { //if newAd.time.getTime() > this.endTime
          this.endIndex = this.nextIndex; 
          //so there is nothing in the render list
        }
        else{ //you should add the current one to render list
          this.indexToRender.unshift(this.nextIndex); //add to render list
        }
      }
      else{} //you shouldn't enter the current one to render list
      

    }
    else if (this.endIndex == Infinity && this.endTime){
      //there is a future upper bound, and no lower bound
      if (newAd.time.getTime() <= this.endTime){
        this.indexToRender.unshift(this.nextIndex);
        this.endIndex = this.nextIndex;
      }
      else{
        //don't render the current one
      }
    }
    else{
      //check if if there are some current bounds
      if (this.endIndex == Infinity) //if endIndex is not defined, we can put the new ads
        this.indexToRender.unshift(this.nextIndex); //add to render list
    }

    this.nextIndex++;
    
    this.adLog.push(newAd);
    this.changeDetector.detectChanges();


  }

}

interface AdLogElem{
  name : string;
  type : string;
  timeStr : string;
  time : Date;
  url  : string;
  coordinates: Point;
}
