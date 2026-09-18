import { useState, useCallback } from "react";
import { SlidersHorizontal, ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type PriceSliderFilterProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 1000;
const DEFAULT_STEP = 5;

const PRESETS = [
  { label: "All", min: 0, max: 1000 },
  { label: "< $50", min: 0, max: 50 },
  { label: "$50–$100", min: 50, max: 100 },
  { label: "$100–$250", min: 100, max: 250 },
  { label: "$250–$500", min: 250, max: 500 },
  { label: "$500+", min: 500, max: 1000 },
];

function parseRange(
  rangeStr: string,
  maxLimit = DEFAULT_MAX,
): [number, number] {
  if (!rangeStr || rangeStr === "all") {
    return [0, maxLimit];
  }
  if (rangeStr.endsWith("+")) {
    const minVal = Number(rangeStr.slice(0, -1));
    return [Number.isFinite(minVal) ? minVal : 0, maxLimit];
  }
  const parts = rangeStr.split("-");
  if (parts.length === 2) {
    const minVal = Number(parts[0]);
    const maxVal = Number(parts[1]);
    return [
      Number.isFinite(minVal) ? minVal : 0,
      Number.isFinite(maxVal) ? maxVal : maxLimit,
    ];
  }
  return [0, maxLimit];
}

function serializeRange(
  min: number,
  max: number,
  maxLimit = DEFAULT_MAX,
): string {
  if (min <= 0 && max >= maxLimit) {
    return "all";
  }
  if (max >= maxLimit) {
    return `${min}+`;
  }
  return `${min}-${max}`;
}

export function PriceSliderFilter({
  value,
  onChange,
  className,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
}: PriceSliderFilterProps) {
  const [open, setOpen] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [localRange, setLocalRange] = useState<[number, number]>(() =>
    parseRange(value, max),
  );
  const [minInput, setMinInput] = useState(() => String(parseRange(value, max)[0]));
  const [maxInput, setMaxInput] = useState(() => String(parseRange(value, max)[1]));

  if (value !== prevValue) {
    setPrevValue(value);
    const parsed = parseRange(value, max);
    setLocalRange(parsed);
    setMinInput(String(parsed[0]));
    setMaxInput(String(parsed[1]));
  }

  const handleSliderChange = (newValues: number[]) => {
    const nextMin = Math.min(newValues[0], newValues[1] ?? max);
    const nextMax = Math.max(newValues[0], newValues[1] ?? max);
    setLocalRange([nextMin, nextMax]);
    setMinInput(String(nextMin));
    setMaxInput(String(nextMax));
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setMinInput(text);
    const parsed = Number(text);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(parsed, localRange[1]));
      setLocalRange([clamped, localRange[1]]);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setMaxInput(text);
    const parsed = Number(text);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(parsed, localRange[0]));
      setLocalRange([localRange[0], clamped]);
    }
  };

  const applyRange = useCallback(
    (rangeToApply: [number, number]) => {
      const serialized = serializeRange(rangeToApply[0], rangeToApply[1], max);
      onChange(serialized);
      setOpen(false);
    },
    [max, onChange],
  );

  const handleApply = () => {
    applyRange(localRange);
  };

  const handleReset = () => {
    const defaultRange: [number, number] = [min, max];
    setLocalRange(defaultRange);
    setMinInput(String(min));
    setMaxInput(String(max));
    onChange("all");
    setOpen(false);
  };

  const handlePresetSelect = (presetMin: number, presetMax: number) => {
    const newRange: [number, number] = [presetMin, presetMax];
    setLocalRange(newRange);
    setMinInput(String(presetMin));
    setMaxInput(String(presetMax));
    applyRange(newRange);
  };

  const isFiltered = value !== "all";
  let displayLabel = "All";
  if (isFiltered) {
    const [curMin, curMax] = parseRange(value, max);
    if (curMax >= max) {
      displayLabel = `$${curMin}+`;
    } else if (curMin === 0) {
      displayLabel = `$0–$${curMax}`;
    } else {
      displayLabel = `$${curMin}–$${curMax}`;
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-9 text-xs font-medium cursor-pointer justify-between gap-1.5 px-3",
            isFiltered &&
              "border-primary/50 bg-primary/5 text-primary dark:text-primary-foreground font-semibold shadow-2xs",
            className,
          )}
          aria-label="Filter products by price"
        >
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <SlidersHorizontal
              className={cn(
                "size-3.5 shrink-0",
                isFiltered ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span className="text-muted-foreground font-normal">Price:</span>
            <span className="truncate">{displayLabel}</span>
          </div>
          <ChevronDown className="size-3 shrink-0 text-muted-foreground opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-80 p-4 space-y-4 shadow-xl border-border/80"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Price Range
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-foreground">
              {localRange[1] >= max
                ? `$${localRange[0]}+`
                : `$${localRange[0]} – $${localRange[1]}`}
            </span>
            {isFiltered && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleReset}
                title="Reset to all prices"
                className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="size-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="py-2 px-1">
          <Slider
            min={min}
            max={max}
            step={step}
            value={localRange}
            onValueChange={handleSliderChange}
            aria-label="Price range slider"
          />
          <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-2 font-mono">
            <span>${min}</span>
            <span>${Math.round((max - min) / 2)}</span>
            <span>${max}+</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label
              htmlFor="price-min-input"
              className="text-[11px] font-medium text-muted-foreground"
            >
              Min Price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
              <Input
                id="price-min-input"
                type="number"
                min={min}
                max={localRange[1]}
                value={minInput}
                onChange={handleMinInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApply();
                }}
                className="h-8 pl-6 pr-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="price-max-input"
              className="text-[11px] font-medium text-muted-foreground"
            >
              Max Price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
              <Input
                id="price-max-input"
                type="number"
                min={localRange[0]}
                max={max}
                value={maxInput}
                onChange={handleMaxInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApply();
                }}
                className="h-8 pl-6 pr-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">
            Quick Ranges
          </span>
          <div className="flex flex-wrap gap-1">
            {PRESETS.map((preset) => {
              const active =
                localRange[0] === preset.min && localRange[1] === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset.min, preset.max)}
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer",
                    active
                      ? "bg-primary text-primary-foreground border-primary font-medium"
                      : "bg-muted/50 border-border/70 text-foreground/80 hover:bg-muted hover:text-foreground",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/70">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 px-3 text-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            className="h-8 px-4 text-xs font-medium cursor-pointer"
          >
            Apply Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
