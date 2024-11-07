import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  PrefixComponent?: any;
}
// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, PrefixComponent, ...props }, ref) => {
    const [currentType, setcurrentType] = React.useState<string>(
      type ?? "text"
    );
    const handleToggleShowPassword = () => {
      const newC = currentType == "text" ? "password" : "text";
      setcurrentType(newC);
    };

    // border-input bg-background
    // focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2

    return (
      <div className="flex items-center pr-4 h-10 w-full rounded-md  inputDivContainer     ">
        {PrefixComponent}

        <input
          type={currentType}
          className={cn(
            `flex-1 bg-background    ${
              !PrefixComponent ? "px-3" : "px-1"
            } py-2 text-sm ring-offset-background file:border-0 
                      file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground 
                      disabled:cursor-not-allowed disabled:opacity-50 
                      outline-none
                      `,
            className
          )}
          value={value}
          ref={ref}
          {...props}
        />
        {type == "password" ? (
          currentType == "password" ? (
            <EyeIcon onClick={handleToggleShowPassword} className="w-5 h-5" />
          ) : (
            <EyeOffIcon
              onClick={handleToggleShowPassword}
              className="w-5 h-5"
            />
          )
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
