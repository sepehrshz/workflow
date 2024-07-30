export interface Node {
  id: string;
  type?: string;
  data: { label: ReactElement };
  position: { x: number; y: number };
  targetPosition?: string;
  sourcePosition?: string;
  style?: { [key: string]: string | number };
  count?: number;
}
