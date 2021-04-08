import { Clovek } from "./clovek";
import { Postava } from "./postava";

export class Film {
    constructor(
        public nazov: string,
        public rok: number,
        public id?: number,
        public imdbID?: string,
        public slovenskyNazov?: string,
        public poradieVRebricku?: {[title: string]: number},
        public reziser: Clovek[] = [],
        public postava: Postava[] = []

    ){}
}