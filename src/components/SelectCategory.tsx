"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
// import { Category } from "@/logic/interfaces";
import { APP_ENVS } from "@/config/envs";
import { defaultCategories } from "@/constants";

export function SelectCategory({
  //   selectedValues,
  //   setSelectedValues,
  selectedCategory,
  setselectedCategory,
}: {
  //   selectedValues: string[];
  //   setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategory: any;
  setselectedCategory: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<typeof defaultCategories>(
    defaultCategories.toSorted((a, b) => (a.name > b.name ? 1 : -1))
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between inputsBgGradient"
        >
          <span className="capitalize">
            {selectedCategory?.name
              ? `${selectedCategory.name}`
              : "Select a category..."}
          </span>

          {/* {selectedValues.length > 0
            ? selectedValues
                .map((value) =>
                  categories.find((category) => category.value === value)
                )
                .filter(Boolean)
                .map((category) => category?.label)
                .join(", ")
            : "Sélectionner des catégories..."} */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-green-950 pointer-events-auto ">
        <Command>
          <CommandInput placeholder="Search a Category..." />
          <CommandList>
            <CommandEmpty>No category found</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  className="cursor-pointer"
                  key={category.id}
                  onSelect={() => {
                    // setSelectedValues((prev) =>
                    //   prev.includes(category.value)
                    //     ? prev.filter((value) => value !== category.value)
                    //     : [...prev, category.value]
                    // );
                    console.log("category");
                    console.log(category);
                    setselectedCategory(category);

                    // setSelectedCategoryIds((prev) => {
                    //   const val = prev.includes(category.value)
                    //     ? prev.filter((value) => value !== category.value)
                    //     : [...prev, category.value];
                    //   return val;
                    // });
                    setOpen(false); // Fermer le menu après la sélection
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategory == category.name
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
