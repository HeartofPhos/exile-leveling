export namespace PassiveTree {
  export interface Data {
    classes: Class[];
    nodes: Node[];
    connections: Connection[];
    viewBox: ViewBox;
  }

  export interface ViewBox {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  export interface Node {
    id: string;
    x: number;
    y: number;
  }

  export interface Connection {
    a: string;
    b: string;
  }

  export interface Class {
    id: string;
    ascendancies: Ascendancy[];
  }

  export interface Ascendancy {
    id: string;
    startNodeId: string;
  }
}
