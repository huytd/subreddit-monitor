import { HistoryEntry, GroupedHistoryEntry } from "../shared/types.ts";

export const isSameDay = (na: number, nb: number) => {
  const a = new Date(na);
  const b = new Date(nb);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const groupByDay = (data: HistoryEntry[]) => {
  return data.reduce((ret: GroupedHistoryEntry, d: HistoryEntry) => {
    const a = new Date(d.time);
    const date = a.toLocaleDateString();
    ret[date] = (ret[date] || []).concat(d);
    return ret;
  }, {});
};
