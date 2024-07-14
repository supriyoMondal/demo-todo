import { createReplicacheExpoSQLiteExperimentalCreateKVStore } from "@react-native-replicache/react-native-expo-sqlite";
import React from "react";
import EventSource from "react-native-sse";
import { Replicache } from "replicache";
import { mutators } from "shared-mutations";
import { BASE_URL, licenseKey } from "~/config/constants";

export function useReplicache(listID: string) {
  if (!licenseKey) {
    throw new Error("Missing LICENSE_KEY");
  }

  const r = React.useMemo(
    () =>
      new Replicache({
        licenseKey,
        pushURL: `${BASE_URL}/todo/push?spaceID=${listID}`,
        pullURL: `${BASE_URL}/todo/pull?spaceID=${listID}`,
        experimentalCreateKVStore:
          createReplicacheExpoSQLiteExperimentalCreateKVStore,
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
      ev.close();
    };
  }, [listID]);

  return r;
}
