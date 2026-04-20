"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  token: string;
  onTokenChange: (v: string) => void;
  onConnect: () => void;
  loading: boolean;
  connected: boolean;
};

export function ConnectPayboxSection({
  token,
  onTokenChange,
  onConnect,
  loading,
  connected,
}: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium tracking-tight">Касса</h2>
        {connected ? (
          <span className="text-xs text-muted-foreground">подключено</span>
        ) : (
          <span className="text-xs text-muted-foreground">нет связи</span>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="token" className="text-xs text-muted-foreground">
          Токен
        </Label>
        <div className="flex gap-2">
          <Input
            id="token"
            className="h-10 font-mono text-xs"
            placeholder="token…"
            autoComplete="off"
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
          />
          <Button
            type="button"
            className="h-10 shrink-0 px-4"
            disabled={loading || !token.trim()}
            onClick={onConnect}
          >
            {loading ? "…" : "Подключить"}
          </Button>
        </div>
      </div>
    </section>
  );
}
