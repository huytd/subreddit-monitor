import React from "https://esm.sh/react@17.0.1"
import ReactDOM from "https://esm.sh/react-dom@17.0.1"
import { groupByDay } from "./utils.ts";
import { GroupedHistoryEntry } from "../shared/types.ts";

const App = () => {
  const subreddit = window.location.href.split('/').pop() || 'vim';
  const [data, setData] = React.useState<GroupedHistoryEntry>();
  React.useEffect(() => {
    (async () => {
      const res = await fetch(`/api/${subreddit}`);
      const json = await res.json();
      const groupped = groupByDay(json);
      setData(groupped);
      console.log(groupped);
    })();
  }, []);

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="flex-1">r/{subreddit}</div>
      <div className="flex-1">toolbar</div>
      <div className="h-3/4">
      </div>
      <div className="flex-1">footer</div>
    </div>
  );
};

// @ts-ignore: We can just skip this check for now
ReactDOM.render(<App/>, document.querySelector("#root"));

