import { useAtom } from "jotai";
import { useEffect } from "react";
import { activeEdgeAtom } from "../../state/route";

export function useLogListener() {
  const [edgeIndex, write] = useAtom(activeEdgeAtom);

  useEffect(() => {
    const edgeId = `edge-${edgeIndex}`;
    const element = document.getElementById(edgeId);
    if (element)
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [edgeIndex]);

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
