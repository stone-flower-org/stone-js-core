import { Graph, GraphEdge, GraphNode } from './graph';

export class BidirectionalGraph<ND = unknown, ED = unknown> extends Graph<ND, ED> {
  static create<ND, ED>(nodes: GraphNode<ND>[], edges: GraphEdge<ED>[]) {
    const graph = new BidirectionalGraph<ND, ED>();

    nodes.forEach((node) => {
      graph.addNode(node);
    });

    edges.forEach((edge) => {
      graph.addEdge(edge);
    });

    return graph;
  }

  addEdge(edge: GraphEdge<ED>) {
    super.addEdge(edge);
    super.addEdge([edge[1], edge[0], edge[2]]);
  }

  removeEdge(u: string, v: string) {
    super.removeEdge(u, v);
    super.removeEdge(v, u);
  }
}
