import { Component, OnInit } from '@angular/core';
import { MiraiService } from '../mirai.service';
import { TriggerEvent, RecentAction } from '../api/api-types';
import {TimeAgoPipe} from 'time-ago-pipe';

@Component({
  selector: 'mirai-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  trigger_events: TriggerEvent[];
  recent_actions: RecentAction[];
  opened: number;

  constructor(private miraiService: MiraiService) { }

  ngOnInit() {
    this.triggerEvent();
    this.recentActions();
  }

  triggerEvent(): void {
    this.miraiService.getTriggerEvents().subscribe(trigger_events => this.trigger_events = trigger_events);
  }
  recentActions(): void {
    this.miraiService.getRecentActions().subscribe(recent_actions => this.recent_actions = recent_actions);
  }

  dropdownableListClick(opened: number): void {
    if (this.opened === opened)
      this.opened = null;
    else
      this.opened = opened;
  }
}

