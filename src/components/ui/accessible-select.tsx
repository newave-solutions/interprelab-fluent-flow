import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface AccessibleSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  allowClear?: boolean;
  searchable?: boolean;
}

/**
 * AccessibleSelect - A fully accessible select/combobox component
 * 
 * Features:
 * - Full keyboard navigation (Arrow keys, Home, End, Type-ahead)
 * - Search functionality with keyboard support
 * - Clear button for resetting selection
 * - Proper ARIA labels and roles
 * - Screen reader friendly announcements
 * - Focus management
 * - Error state handling
 * - Optional descriptions for options
 */
export const AccessibleSelect: React.FC<AccessibleSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  label,
  description,
  error,
  disabled = false,
  required = false,
  className,
  allowClear = true,
  searchable = true,
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const triggerId = React.useId();
  const descriptionId = React.useId();
  const errorId = React.useId();

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    
    const query = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === value) {
      // Allow deselection if not required
      if (!required) {
        onChange("");
      }
    } else {
      onChange(selectedValue);
    }
    setOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
    }
  };

  // Generate aria-labelledby
  const ariaLabelledBy = label ? triggerId : undefined;
  const ariaDescribedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Label */}
      {label && (
        <label
          id={triggerId}
          htmlFor={`${triggerId}-trigger`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* Select trigger */}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={`${triggerId}-trigger`}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-invalid={!!error}
            aria-required={required}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground",
              error && "border-destructive focus:ring-destructive"
            )}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="flex items-center gap-2">
              {value && allowClear && !disabled && (
                <X
                  className="h-4 w-4 opacity-50 hover:opacity-100"
                  onClick={handleClear}
                  aria-label="Clear selection"
                />
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            {/* Search input */}
            {searchable && (
              <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={searchPlaceholder}
                />
              </div>
            )}

            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    disabled={option.disabled}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Error message */}
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {open && `${filteredOptions.length} options available`}
      </div>
    </div>
  );
};

/**
 * Example usage:
 * 
 * ```tsx
 * const MyForm = () => {
 *   const [language, setLanguage] = useState("");
 * 
 *   const options = [
 *     { value: "en", label: "English", description: "English language" },
 *     { value: "es", label: "Spanish", description: "Español" },
 *     { value: "fr", label: "French", description: "Français" },
 *   ];
 * 
 *   return (
 *     <AccessibleSelect
 *       label="Select Language"
 *       description="Choose your preferred language"
 *       options={options}
 *       value={language}
 *       onChange={setLanguage}
 *       required
 *       searchable
 *       allowClear
 *     />
 *   );
 * };
 * ```
 */

export default AccessibleSelect;
