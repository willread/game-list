import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-platform-badge',
  templateUrl: './platform-badge.component.html',
  styleUrls: ['./platform-badge.component.scss']
})
export class PlatformBadgeComponent implements OnInit {
  @Input() platform: string;

  constructor() { }

  ngOnInit(): void {
  }

}
