import { forEach } from '@/src/core';

import { Graph, GraphEdge, GraphNode } from './graph';

export class GraphSerializer {
  serialize(graph: Graph): string {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    forEach(graph.getAllNodes(), (node) => {
      nodes.push(node);
    });

    forEach(graph.getAllEdges(), (edge) => {
      edges.push(edge);
    });

    return JSON.stringify({
      edges,
      nodes,
    });
  }

  deserialize<ND = unknown, ED = unknown>(str: string): Graph<ND, ED> {
    const { edges, nodes } = JSON.parse(str) as { edges: GraphEdge<ED>[]; nodes: GraphNode<ND>[] };
    return Graph.create(nodes, edges);
  }
}
