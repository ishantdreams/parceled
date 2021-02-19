import {observable} from 'mobx';

export default class LayerModel {
  @observable id;
  @observable name;
  @observable description;
  @observable url;
  @observable type;

  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.url = obj.url;
    this.type = obj.type;
  }
}
