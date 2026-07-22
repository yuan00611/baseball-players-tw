"use client";

import * as React from "react";
import { Drawer } from "vaul";
import type { MapPin } from "@/components/map/map-types";
import { UsMapView } from "@/components/map/us-map-view";
import { PinList, type ExtraPlayer } from "@/components/map/pin-list";

/**
 * 地圖 + 右側清單（兩個 tab 共用同一版型）。
 * 地圖 pin 與清單列共享選取狀態 → 點人/點圈圈互相連動。
 * 桌機：右側 rail；手機：底部可拖曳抽屜（vaul）。
 */
export function MapExplorer({
  nationPath,
  bordersPath,
  pins,
  width,
  height,
  listTitle,
  extra,
}: {
  nationPath: string;
  bordersPath: string;
  pins: MapPin[];
  width: number;
  height: number;
  listTitle: string;
  extra?: ExtraPlayer[];
}) {
  const [selected, setSelected] = React.useState<number | null>(null);

  // 切 tab（pins 換）時清除選取
  React.useEffect(() => setSelected(null), [pins]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
      <div className="min-w-0 flex-1">
        <div className="relative rounded-lg border border-border-subtle bg-canvas p-2">
          <UsMapView
            nationPath={nationPath}
            bordersPath={bordersPath}
            pins={pins}
            width={width}
            height={height}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        {/* 手機：底部抽屜 */}
        <div className="mt-4 lg:hidden">
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <button
                type="button"
                className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-left text-sm font-medium text-text"
              >
                {listTitle}（{pins.length}）— 點開查看
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
              <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[32vh] flex-col rounded-t-2xl border-t border-border-subtle bg-canvas">
                <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-border-strong" />
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <Drawer.Title className="mb-3 font-sans text-lg font-bold text-text">
                    {listTitle}
                  </Drawer.Title>
                  <Drawer.Description className="sr-only">
                    {listTitle}清單，點選可在地圖上標示
                  </Drawer.Description>
                  <PinList
                    pins={pins}
                    selected={selected}
                    onSelect={setSelected}
                    extra={extra}
                  />
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </div>

      {/* 桌機：右側清單（用 absolute 內層 → 高度跟地圖同高、內部捲動） */}
      <aside
        aria-label={listTitle}
        className="relative hidden w-72 shrink-0 lg:block"
      >
        <div className="lg:absolute lg:inset-0 lg:flex lg:flex-col">
          <h2 className="mb-3 font-sans text-lg font-bold text-text">{listTitle}</h2>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <PinList
              pins={pins}
              selected={selected}
              onSelect={setSelected}
              extra={extra}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
