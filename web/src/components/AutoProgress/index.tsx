import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { activeEdgeAtom } from "../../state/route";
import { type Id, toast } from "react-toastify";
import useWebSocket, { ReadyState } from "react-use-websocket-lite";

const AUTO_PROGRESS_URL = "ws://localhost:6754";

export function useAutoProgress() {
  const write = useSetAtom(activeEdgeAtom);
  const { readyState } = useWebSocket({
    url: AUTO_PROGRESS_URL,
    shouldReconnect: true,
    reconnectInterval: 1000,
    onMessage(event) {
      if (typeof event.data === "string") {
        write(event.data);
      }
    },
  });

  const autoProgressToastId = "auto-progress-toast-id";

  useEffect(() => {
    if (readyState == ReadyState.CONNECTING) {
      toast("", { toastId: autoProgressToastId });
      toast.update(autoProgressToastId, {
        render: "Setup Auto-Progress",
        type: "info",
        onClick: () => {
          window.open(
            "https://github.com/HeartofPhos/exile-log-api/releases",
            "_blank",
          );
        },
        autoClose: false,
        closeOnClick: false,
        closeButton: <></>,
      });
    } else {
      toast.update(autoProgressToastId, {
        render: "Auto-Progress Connected",
        type: "success",
        onClick: null,
        autoClose: null,
        closeOnClick: null,
        closeButton: null,
      });
    }
  }, [readyState]);
}
