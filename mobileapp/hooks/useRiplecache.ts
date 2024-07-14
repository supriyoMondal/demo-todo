import { createReplicacheExpoSQLiteExperimentalCreateKVStore } from "@react-native-replicache/react-native-expo-sqlite";
import React from "react";
import EventSource from "react-native-sse";
import { Replicache } from "replicache";
import { mutators } from "shared-mutations";
import { BASE_URL, licenseKey } from "~/config/constants";
import useCurrentUserSpace from "./state/useCurrentUserSpace";
import { Platform } from "react-native";

export function useReplicache() {
  if (!licenseKey) {
    throw new Error("Missing LICENSE_KEY");
  }

  const listID = useCurrentUserSpace((store) => store.spaceId);

  const r = React.useMemo(
    () =>
      new Replicache({
        licenseKey,
        pushURL: `${BASE_URL}/todo/push?spaceID=${listID}`,
        pullURL: `${BASE_URL}/todo/pull?spaceID=${listID}`,
        experimentalCreateKVStore:
          Platform.OS !== "web"
            ? createReplicacheExpoSQLiteExperimentalCreateKVStore
            : undefined,
        name: listID,
        mutators,
      }),
    [listID]
  );

  React.useEffect(() => {
    const ev = new EventSource(`${BASE_URL}/todo/poke?spaceID=${listID}`, {
      headers: {
        withCredentials: true,
      },
    });

    ev.addEventListener("message", async (evt) => {
      if (evt.type !== "message") return;
      if (evt.data === "poke") {
        await r.pull();
      }
    });

    return () => {
      ev.removeAllEventListeners("message");
      ev.close();
      r.close();
    };
  }, [listID]);

  return r;
}
