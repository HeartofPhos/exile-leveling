import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { activeEdgeAtom } from "../../state/route";

export function useLogListener() {
  const write = useSetAtom(activeEdgeAtom);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6754");

    socket.addEventListener("open", () => {
      console.log("log connected");
    });

    socket.addEventListener("close", () => {
      console.log("log disconnected");
    });

    socket.addEventListener("message", (event) => {
      write(event.data);
    });

    return () => socket.close();
  }, [write]);
}
