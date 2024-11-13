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
import { defaultCategories, defaultSubCategories } from "@/constants";

export function SelectSubCategory({
  //   selectedValues,
  //   setSelectedValues,
  selectedCategory,
  selectedSubCategory,
  setselectedSubCategory,
  allSubcategories,
}: {
  //   selectedValues: string[];
  //   setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategory: (typeof defaultCategories)[0];
  selectedSubCategory: (typeof defaultSubCategories)[0] | null;
  setselectedSubCategory: any;
  allSubcategories: typeof defaultSubCategories;
}) {
  const [open, setOpen] = React.useState(false);
  // const [categories, setCategories] = React.useState<
  //   typeof defaultSubCategories
  // >(
  //   defaultSubCategories
  //     .filter((v) => v.category_id == selectedCategory.id)
  //     .toSorted((a, b) => (a.name > b.name ? 1 : -1))
  // );

  console.log("the id ");
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
            {/* {selectedSubCategory || "Sélect a subCategory..."} */}
            {/* `${selectedCategory.category_name} - ${selectedCategory.category_id}` */}

            {selectedSubCategory?.name
              ? `${selectedSubCategory.name}`
              : "Select a sub-category..."}
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
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No sub-category found</CommandEmpty>
            {/* <p>The selected category is {JSON.stringify(selectedCategory)}</p> */}

            <CommandGroup>
              {allSubcategories.map((category) => (
                <CommandItem
                  className="cursor-pointer"
                  key={category.category_id}
                  onSelect={() => {
                    // setSelectedValues((prev) =>
                    //   prev.includes(category.value)
                    //     ? prev.filter((value) => value !== category.value)
                    //     : [...prev, category.value]
                    // );
                    console.log("category");
                    console.log(category);
                    setselectedSubCategory(category);

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
                      selectedSubCategory?.name == category.name
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
