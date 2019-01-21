import { Component, OnInit } from '@angular/core';
import { MiraiService } from '../mirai.service';
import { EnvStatus, Iaas, TriggerEvent, RecentAction, QuickAccess, IaasResources } from '../api/api-types';
import { Network, DataSet, Node, Edge, IdType } from 'vis';

@Component({
  selector: 'mirai-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  env_status: EnvStatus;
  iaas_list: Iaas[];

  iaas_capacity: IaasResources;
  iaas_used: IaasResources;
  selected_iaas_id: number;
  d: number = 1000;
  r: boolean = true;

  iaas_pos = {};
  temp_arrow;
  temp_arrow_obj;
  current_iaas;
  iaas_selected: Boolean = false;

  /*==== VIS ====*/
  public nodes: Node;
  public edges: Edge;
  public network: Network;

  constructor(private miraiService: MiraiService) { }
  interval: any;

  add_container() {
    console.log("hhh")
  }
  ngOnInit() {
    this.miraiService.getEnvStatus().subscribe(env_status => this.env_status = env_status);
    this.miraiService.getIaasList().subscribe(iaas_list => this.iaas_list = iaas_list);

    const updateValues = (): void => {
      this.iaas_used.ram = Math.random() * 8;
    };
    const INTERVAL: number = 10000;

    // this.interval = setInterval(updateValues, INTERVAL);


    var nodes = new DataSet([
      { id: 0, label: 'Internet', color: 'rgba(51,68,95,0.5)', physics: false },


    ]);
    // create an array with edges
    var edges = new DataSet([
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
    ]);

    nodes.add([
      { id: 11, label: 'Container 1', group: 'container' },
      { id: 12, label: 'Container 2', group: 'container' },
      { id: 13, label: 'Container 3', group: 'container' },
      { id: 1, label: 'IAAS 1', group: 'iaas' },
      { id: 2, label: 'IAAS 2', group: 'iaas' },
      { id: 3, label: 'IAAS 3', group: 'iaas' },
      { id: 21, label: 'IAAS 1', group: 'iaas' },
      { id: 22, label: 'IAAS 2', group: 'iaas' },
      { id: 23, label: 'IAAS 3', group: 'iaas' },
      { id: 31, label: 'IAAS 1', group: 'iaas' },
      { id: 32, label: 'IAAS 2', group: 'iaas' },
      { id: 33, label: 'IAAS 3', group: 'iaas' },
      { id: 41, label: 'IAAS 1', group: 'iaas' },
      { id: 42, label: 'IAAS 2', group: 'iaas' },
      { id: 43, label: 'IAAS 3', group: 'iaas' },
    ]);

    edges.add([

      { from: 1, to: 11 },
      { from: 1, to: 12 },
      { from: 2, to: 13 },
      { from: 0, to: 21 },
      { from: 0, to: 22 },
      { from: 0, to: 23 },
      { from: 0, to: 31 },
      { from: 0, to: 32 },
      { from: 0, to: 33 },
      { from: 0, to: 41 },
      { from: 0, to: 42 },
      { from: 0, to: 43 },



    ])
    // create a network
    var container = document.getElementById('vis');

    var x = - container.clientWidth / 2 + 20;
    var y = - container.clientHeight / 2 + 20;
    var step = 70;
    // nodes.add({ id: 1000, x: x, y: y, label: 'IAAS', group: 'iaas', value: 1, fixed: true, physics: false });
    // nodes.add({ id: 2000, x: x, y: y + step, label: 'Container', group: 'container', value: 1, fixed: true, physics: false });
    var data = {
      nodes: nodes,
      edges: edges
    };
    this.edges = edges;
    this.nodes = nodes;

    var options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      // manipulation: {
      //   addNode: function (data, callback) {
      //     // filling in the popup DOM elements
      //     document.getElementById('operation').innerHTML = "Add Node";
      //     document.getElementById('node-id').value = data.id;
      //     document.getElementById('node-label').value = data.label;
      //     document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
      //     document.getElementById('cancelButton').onclick = clearPopUp.bind();
      //     document.getElementById('network-popUp').style.display = 'block';
      //   }
      // },
      interaction: { hover: true },
      groups: {
        container: {
          color: {
            border: '#2680eb', background: '#2680eb', highlight: '#e10b0b',
            hover: { border: 'rgba(51,68,95,0.5)', background: '#2680eb' }
          },
        },
        iaas: {
          shape: 'circle',
          color: {
            cursor: 'pointer',
            border: 'orange', background: 'orange', highlight: '#e10b0b',
            hover: { border: 'rgba(51,68,95,0.5)', background: 'orange' },

          },
        },


      },
      nodes: {

        shape: 'dot',
        size: 16,
        font: {
          size: 13,
          color: '#ffffff'
        },

      },
      edges: {

      }

    };
    this.network = new Network(container, data, options);


    this.network.on('selectNode', function (e) {
      var id: number = e.nodes[0];
      if (nodes.get(id).group === 'iaas') {
        this.iaas_selected = true;
        this.miraiService.getIaasCapacity(id).subscribe(iaas_capacity => this.iaas_capacity = iaas_capacity);
        this.miraiService.getIaasUsed(id).subscribe(iaas_used => this.iaas_used = iaas_used);
        this.selected_iaas_id = id;

      } else {
        this.iaas_selected = false;
      }

    }.bind(this));


    this.network.on('deselectNode', function () {
      this.iaas_selected = false;
    }.bind(this));

    this.network.on('hoverNode', function (e) {
      var id: number = e.node;
      if (this.nodes.get(id).group === 'iaas') {
        this.network.canvas.body.container.style.cursor = 'pointer';
      } else if (this.nodes.get(id).group === 'container') {
        this.network.canvas.body.container.style.cursor = 'grab';
      }


    }.bind(this));

    this.network.on('blurNode', function (e) {
      this.network.canvas.body.container.style.cursor = 'default';


    }.bind(this));


    /*==== Dargging to migate ====*/

    this.network.on('dragStart', function (e) {

      this.network.canvas.body.container.style.cursor = 'grabbing';

      if (this.nodes.get(e.nodes[0]).group === 'container')
        for (var i in this.nodes._data) {
          if (this.nodes._data[i].group === 'iaas') {
            var id = this.nodes._data[i].id;
            nodes.update({ id: id, fixed: { x: true, y: true } });
            console.log("start ----")
            this.iaas_pos[id] = this.network.getPositions([id])[id];
            console.log("end ----")
          }
        }
      // create obj for current iaas positions 

    }.bind(this));

    this.network.on('dragging', function (e) {
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
          edges.update(this.temp_arrow_obj);
        } else {
          this.temp_arrow_obj = { dashes: true, from: id_min, to: e.nodes[0], arrows: 'from' };
          this.temp_arrow = edges.add(this.temp_arrow_obj)[0];
        }

      } else if (this.temp_arrow) {

        edges.remove(this.temp_arrow);
        this.temp_arrow = null;
      }


      console.log("dragging")
    }.bind(this));


    this.network.on('dragEnd', function (e) {
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
          nodes.update({ id: id, fixed: { x: false, y: false } });
        }
      }


    }.bind(this));


    /* end Daragging to migrate */


  }

}
