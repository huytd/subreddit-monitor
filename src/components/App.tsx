import React from "https://dev.jspm.io/react";
import { HistoryEntry } from "../../shared/types.ts";

const useEffect = (React as any).useEffect;

interface AppProps {
  subreddit: string,
  data: HistoryEntry[]
}

export const App = ({ subreddit, data }: AppProps) => {
  useEffect(() => {
    console.log("This is called from client side for", subreddit);
  }, []);
  return (
    <div>Loading data for r/{subreddit}</div>
  );
};
