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
  { label: "All", min: 0, max: 0 },
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
    return [0, 0];
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
  return [0, 0];
}

function serializeRange(
  min: number,
  max: number,
  maxLimit = DEFAULT_MAX,
): string {
  if ((min <= 0 && max <= 0) || (min <= 0 && max >= maxLimit)) {
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
  const [minInput, setMinInput] = useState(() =>
    String(parseRange(value, max)[0]),
  );
  const [maxInput, setMaxInput] = useState(() =>
    String(parseRange(value, max)[1]),
  );

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
    if (text.trim() === "") return;
    const parsed = Number(text);
    if (!Number.isNaN(parsed)) {
      const clampedMin = Math.max(min, Math.min(parsed, max));
      const nextMax = Math.max(clampedMin, localRange[1]);
      setLocalRange([clampedMin, nextMax]);
      if (nextMax !== localRange[1]) {
        setMaxInput(String(nextMax));
      }
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setMaxInput(text);
    if (text.trim() === "") return;
    const parsed = Number(text);
    if (!Number.isNaN(parsed)) {
      const clampedMax = Math.min(max, Math.max(parsed, min));
      const nextMin = Math.min(clampedMax, localRange[0]);
      setLocalRange([nextMin, clampedMax]);
      if (nextMin !== localRange[0]) {
        setMinInput(String(nextMin));
      }
    }
  };

  const handleMinInputBlur = () => {
    setMinInput(String(localRange[0]));
  };

  const handleMaxInputBlur = () => {
    setMaxInput(String(localRange[1]));
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
    const defaultRange: [number, number] = [0, 0];
    setLocalRange(defaultRange);
    setMinInput("0");
    setMaxInput("0");
    onChange("all");
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
            "h-9 text-xs xl:text-sm font-medium cursor-pointer justify-between gap-1.5 px-2.5 sm:px-3 rounded-lg border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 focus-visible:border-primary focus-visible:ring-primary/20",
            isFiltered &&
              "border-primary/50 bg-primary/5 text-primary dark:text-primary-foreground font-semibold shadow-2xs",
            className,
          )}
          aria-label="Filter products by price"
        >
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <SlidersHorizontal
              className={cn(
                "size-3.5 sm:size-4 shrink-0",
                isFiltered ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span className="hidden min-[340px]:inline mr-1 xl:text-sm">Price:</span>
            <span className="truncate text-xs xl:text-sm font-medium text-foreground">
              {displayLabel}
            </span>
          </div>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-70 sm:w-96 p-5 space-y-4.5 shadow-xl border-border/80"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4.5 text-primary" />
            <span className="text-xs lg:text-sm font-semibold text-foreground">
              Price Range
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-[13px] font-semibold px-2.5 py-1 rounded-md bg-muted text-foreground tracking-wide font-mono">
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
                title="Reset to all prices "
                className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
              > 
                <RotateCcw className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
        <div className="py-3 px-1.5">
          <Slider
            min={min}
            max={max}
            step={step}
            value={localRange}
            onValueChange={handleSliderChange}
            aria-label="Price range slider"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-2.5 font-mono font-medium">
            <span>${min}</span>
            <span>${Math.round((max - min) / 2)}</span>
            <span>${max}+</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="price-min-input"
              className="text-xs font-medium text-muted-foreground"
            >
              Min Price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                $
              </span>
              <Input
                id="price-min-input"
                type="number"
                min={min}
                max={max}
                value={minInput}
                onChange={handleMinInputChange}
                onBlur={handleMinInputBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApply();
                }}
                className="h-9 pl-7 pr-3 text-sm font-mono font-medium focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="price-max-input"
              className="text-xs font-medium text-muted-foreground"
            >
              Max Price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                $
              </span>
              <Input
                id="price-max-input"
                type="number"
                min={min}
                max={max}
                value={maxInput}
                onChange={handleMaxInputChange}
                onBlur={handleMaxInputBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApply();
                }}
                className="h-9 pl-7 pr-3 text-sm font-mono font-medium focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">
            Quick Ranges
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => {
              const active =
                localRange[0] === preset.min && localRange[1] === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset.min, preset.max)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer",
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
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/70">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-9 px-3.5 text-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            className="h-9 px-4 text-xs font-medium cursor-pointer"
          >
            Apply Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
