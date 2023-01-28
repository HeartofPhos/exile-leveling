export namespace PassiveTree {
  export interface Data {
    classes: Class[];
  }

  export interface Class {
    id: string;
    ascendancies: Ascendancy[];
  }

  export interface Ascendancy {
    id: string;
  }
}
