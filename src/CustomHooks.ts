import { useEffect, useState } from "react"

type AsyncState<T> = 
  { status: "pending" }
  |
  {
    status: "rejected",
    error: unknown
  }
  |
  {
    status: "resolved",
    value: T
  }

export function useAsync<T> (
  load: () => Promise<T>,
  dependencies: unknown[],
): AsyncState<T> {

  const [state, setState] = useState<AsyncState<T>>({ status: "pending" });

  useEffect(() => {
    
    let canceled = false;

    const func = async () => {
      try {
        const value: T = await load();
        if (!canceled) {
          setState({ status: "resolved", value });
        }
      } catch(error) {
        if (!canceled) {
          setState({ status: "rejected", error});
        }
      }
    }

    func();

    return () => {
      canceled = true;
      setState({ status: "pending"});
    }
  }, dependencies)

  return state;
}