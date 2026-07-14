export namespace SkillTree {
  export interface Data {
    bounds: Bounds;
    classes: Class[];
    graphs: Graph[];
    graphIndex: number;
    ascendancies: Record<string, Ascendancy>;
    masteryEffects: Record<string, MasteryEffect>;
  }

  export type NodeLookup = Record<string, Node>;

  export interface Graph {
    nodes: NodeLookup;
    connections: Connection[];
  }

  export interface MasteryEffect {
    stats: string[];
  }

  export interface Bounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }

  export interface Ascendancy {
    id: string;
    startNodeId: string;
    graphIndex: number;
  }

  export interface Node extends Coord {
    k:
      | "Normal"
      | "Notable"
      | "Keystone"
      | "Mastery"
      | "Jewel"
      | "Ascendancy_Start";
    text: string;
    stats?: string[];
  }

  export interface Coord {
    x: number;
    y: number;
  }

  export interface Connection {
    a: string;
    b: string;
    s?: Sweep;
  }

  export interface Sweep {
    w: "CW" | "CCW";
    r: number;
  }

  export interface Class {
    name: string;
    ascendancies: string[];
  }
}
