export namespace PassiveTree {
  export interface Data {
    classes: Class[];
    nodes: Record<string, Node>;
    connections: Connection[];
    masteryEffects: Record<string, MasteryEffect>;
    viewBox: ViewBox;
  }

  export interface ViewBox {
    x: number;
    y: number;
    w: number;
    h: number;
    padding: number;
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

  export interface MasteryEffect {
    stats: string[];
  }
}
