import { Component, OnInit, Input} from '@angular/core';
import { Ad, Point, Creative } from '../Ad';
import { adDispatcher, IAdEvent } from 'ubimo-fed-home-assigment';
import {DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit {

  @Input() x: number;
  @Input() y: number;
  @Input() url: string;
  @Input() type: string;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  public get Url(){
    return this.sanitizer.bypassSecurityTrustUrl(this.url); 
  }

}

