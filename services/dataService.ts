import { GraphData } from '../types'; // types.ts лежит в корне
import rawData from '../graph_data.json'; // json лежит в корне

export const getGraphData = (): Promise<GraphData> => {
  return Promise.resolve(rawData as GraphData);
};
