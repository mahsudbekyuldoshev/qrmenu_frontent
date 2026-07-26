"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { subscribeLocalEvents } from "@/lib/api";
import type { WsEvent, WsEventType } from "@/lib/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/orders/";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export interface UseWebSocketOptions {
  onEvent?: (event: WsEvent) => void;
  enabled?: boolean;
}

export function useWebSocket({
  onEvent,
  enabled = true,
}: UseWebSocketOptions = {}) {
  const [connected, setConnected] = useState(() => enabled && USE_MOCK);
  const [lastEvent, setLastEvent] = useState<WsEvent | null>(null);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const handleEvent = useCallback((type: string, payload: unknown) => {
    const event: WsEvent = {
      type: type as WsEventType,
      payload,
      timestamp: new Date().toISOString(),
    };
    setLastEvent(event);
    onEventRef.current?.(event);
  }, []);

  useEffect(() => {
    if (!enabled) {
      queueMicrotask(() => setConnected(false));
      return;
    }

    if (USE_MOCK) {
      queueMicrotask(() => setConnected(true));
      const unsub = subscribeLocalEvents(handleEvent);
      const onCustom = (e: Event) => {
        const detail = (e as CustomEvent).detail as {
          type: string;
          payload: unknown;
        };
        handleEvent(detail.type, detail.payload);
      };
      window.addEventListener("restoflow:ws", onCustom);
      return () => {
        unsub();
        window.removeEventListener("restoflow:ws", onCustom);
        setConnected(false);
      };
    }

    let ws: WebSocket | null = null;
    let closed = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      ws = new WebSocket(WS_URL);
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        if (!closed) {
          retryTimer = setTimeout(connect, 2500);
        }
      };
      ws.onerror = () => ws?.close();
      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data as string) as WsEvent;
          setLastEvent(data);
          onEventRef.current?.(data);
        } catch {
          // ignore malformed
        }
      };
    };

    connect();

    return () => {
      closed = true;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
      setConnected(false);
    };
  }, [enabled, handleEvent]);

  return { connected, lastEvent };
}
