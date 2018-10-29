export interface Ad{
    type: String;
    coordinates : Point;
    creative : Creative;
}
export interface Point{
    x: number;
    y: number;
}
export interface Creative{
    name: string;
    url: string;
  }