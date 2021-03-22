import { h, render } from "preact";
import { useState, useEffect, useCallback, useRef } from "preact/hooks";

let delay = 10;
function App() {
  const [data, setData] = useState<string[][]>([]);
  const [date, setDate] = useState(new Date());
  const timerRef = useRef(0);
  const dateRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const timerStart = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress(100 - (Date.now() - dateRef.current) / 10 / delay - 20);
    }, 2000);
    setProgress(100);
    return () => clearInterval(timerRef.current);
  }, []);
  const fetchData = useCallback(() => {
    fetch("./0322.csv")
    .then((res) => res.text())
    .then((res) => {
      setData(
        res
          .split("\n")
          .filter(Boolean)
          .map((it) => it.split("\t"))
      );
      setDate(new Date());
      dateRef.current = Date.now();
      timerStart();
    });
  }, [timerStart, date])
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      fetchData();
    }, 1000 * delay)
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="">
      <div className="text-gray-600 py-3 flex-inline">
        Last Update: 
        <div className="inline-block pl-2">
          {date.toTimeString()}
          <div className="border-t border-solid border-gray-600 h-1" style={{transition: 'all 1s', width: `${progress}%`}} />
        </div>
      </div>
    
      <table className="w100 table-auto">
        <thead>
          <tr className="bg-gray-800 text-gray-500">
            {[
              "ID",
              "Date",
              "Code",
              "Name",
              "Buy",
              "Buy%",
              "Sell",
              "Sell%",
              "Price%",
              "s2o",
              "order3",
            ].map((th) => (
              <th key={th} className="border border-gray-700 px-4 py-2">
                {th}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-right">
          {data.map((it, i) => (
            <tr
              key={i}
              className={
                it.join("").includes("*")
                  ? "bg-gray-800 text-blue-400"
                  : "bg-gray-800 text-gray-600"
              }
            >
              {it.map((td, j) => (
                <td className="border border-gray-700 px-4 py-2" key={j}>
                  {td}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

render(<App />, document.body);
