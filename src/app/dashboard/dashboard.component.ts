import { Component, OnInit } from '@angular/core';
import { MiraiService } from '../mirai.service';
import { EnvStatus, Iaas, Container, TriggerEvent, RecentAction, QuickAccess, IaasResources } from '../api/api-types';
import { Network, DataSet, Node, Edge, IdType } from 'vis';
import { NetworkVis } from '../core/networkVis'

@Component({
  selector: 'mirai-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  env_status: EnvStatus;

  iaas_capacity: IaasResources;
  iaas_used: IaasResources;
  selected_iaas_id: number;


  iaas_pos = {};
  temp_arrow;
  temp_arrow_obj;
  current_iaas;
  iaas_selected: Boolean = false;
  node_selected: Boolean = true;

  /*==== VIS ====*/
  public nodes: Node;
  public edges: Edge;
  public network: Network;

  constructor(private miraiService: MiraiService) { }

  ngOnInit() {
    this.miraiService.getEnvStatus().subscribe(env_status => this.env_status = env_status);
    this.miraiService.getIaasList().subscribe(iaas_list => this.addIaasList(iaas_list))

    // create nodes and edge array
    var nodes = new DataSet([
      { id: 0, label: 'Internet', color: 'rgba(51,68,95,0.5)', physics: false },
    ]);
    var edges = new DataSet();

    // create a network
    var container = document.getElementById('vis');
    this.edges = edges;
    this.nodes = nodes;

    var data = {
      nodes: this.nodes,
      edges: this.edges
    };

    var options = NetworkVis.options
    this.network = new Network(container, data, options);

    // Events listener
    this.network.on('hoverNode', this.hoverNode.bind(this));
    this.network.on('selectNode', this.selectNode.bind(this));

    this.network.on('deselectNode', function () {
      this.iaas_selected = false;
    }.bind(this));

    this.network.on('blurNode', function (e) {
      this.network.canvas.body.container.style.cursor = 'default';
    }.bind(this));

    this.network.on('dragStart', this.dragStart.bind(this));
    this.network.on('dragging', this.dragging.bind(this));
    this.network.on('dragEnd', this.dragEnd.bind(this));

  }

  hoverNode(e: any): void {
    var id: number = e.node;
    if (this.nodes.get(id).group === 'iaas') {
      this.network.canvas.body.container.style.cursor = 'pointer';
    } else if (this.nodes.get(id).group === 'container') {
      this.network.canvas.body.container.style.cursor = 'grab';
    }

  }

  selectNode(e: any): void {
    var id: number = e.nodes[0];
    if (this.nodes.get(id).group === 'iaas') {
      this.iaas_selected = true;
      this.miraiService.getIaasCapacity(id).subscribe(iaas_capacity => this.iaas_capacity = iaas_capacity);
      this.miraiService.getIaasUsed(id).subscribe(iaas_used => this.iaas_used = iaas_used);
      this.selected_iaas_id = id;

    } else {
      this.iaas_selected = false;
    }

  }

  dragStart(e: any): void {
    this.network.canvas.body.container.style.cursor = 'grabbing';

    if (this.nodes.get(e.nodes[0]).group === 'container')
      for (var i in this.nodes._data) {
        if (this.nodes._data[i].group === 'iaas') {
          var id = this.nodes._data[i].id;
          this.nodes.update({ id: id, fixed: { x: true, y: true } });
          this.iaas_pos[id] = this.network.getPositions([id])[id];
        }
      }
  }

  dragging(e: any): void {

    if (this.nodes.get(e.nodes[0]).group !== 'container') return;
    // current iaas
    if (!this.current_iaas) {
      this.current_iaas = this.edges._data[e.edges[0]].from
    }

    // get closest iaas 
    var min, id_min;
    for (var i in this.iaas_pos) {
      var a = this.iaas_pos[i].x - e.pointer.canvas.x;
      var b = this.iaas_pos[i].y - e.pointer.canvas.y;
      var c = Math.sqrt(a * a + b * b);
      if (min === undefined || c < min) {
        min = c;
        id_min = i;
      }
    }

    // if not current create temp edge
    if (id_min != this.current_iaas) {
      if (this.temp_arrow) {
        this.temp_arrow_obj = { id: this.temp_arrow, from: id_min }
        this.edges.update(this.temp_arrow_obj);
      } else {
        this.temp_arrow_obj = { dashes: true, from: id_min, to: e.nodes[0], arrows: 'from' };
        this.temp_arrow = this.edges.add(this.temp_arrow_obj)[0];
      }

    } else if (this.temp_arrow) {

      this.edges.remove(this.temp_arrow);
      this.temp_arrow = null;
    }

  }

  dragEnd(e: any): void {
    if (this.nodes.get(e.nodes[0]).group !== 'iaas' && this.temp_arrow) {


      this.network.unselectAll();
      this.edges.update({
        id: e.edges[0],
        from: this.edges._data[this.temp_arrow].from
      });

      this.edges.remove([
        this.temp_arrow
      ]);

      this.temp_arrow = null;
    }
    //clear dragging vars
    this.network.canvas.body.container.style.cursor = 'default';
    this.iaas_pos = {};
    this.current_iaas = null;
    if (this.nodes.get(this.network.getSelectedNodes()[0]).group != 'iaas')
      this.iaas_selected = false;
    //set physic true
    for (var i in this.nodes._data) {
      if (this.nodes._data[i].group === 'iaas') {
        var id = this.nodes._data[i].id;
        this.nodes.update({ id: id, fixed: { x: false, y: false } });
      }
    }

  }

  /***
   * Add iaas list to the nework visualization as nodes
   */
  addIaasList(list: Iaas[]): void {
    console.log(list)
    let iaas_list: any[] = []
    let link_list: any[] = []
    list.forEach(e => {
      iaas_list.push({ id: e.id, label: e.iaas_name, group: 'iaas' })
      link_list.push({ from: 0, to: e.id })
      this.miraiService.getContainerList(e.id).subscribe(container_list => this.addContainerList(container_list, e.id))

    });
    this.nodes.add(iaas_list);
    this.edges.add(link_list);
  }

  addContainerList(list: Container[], iaas_id: number): void {
    let containers_list: any[] = []
    let link_list: any[] = []
    list.forEach(e => {
      containers_list.push({ id: -e.id, label: e.container_name, group: 'container' })
      link_list.push({ from: iaas_id, to: -e.id })
    });
    this.nodes.add(containers_list);
    this.edges.add(link_list);
  }

  add_container() {
    console.log("hhh")
  }

}
