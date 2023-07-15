import React from "react";
import type { GroupBase, Props } from "react-select";
import ReactSelect from "react-select";
import { cn } from "../lib/utils";

export type DefaultOptions<TValue = string> = {
  label: string;
  value: TValue;
};

export type SelectProps<
  Option = DefaultOptions,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group>;

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ className, ...props }: Props<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      className={cn("react-select-container", className)}
      classNamePrefix={"react-select"}
      {...props}
    />
  );
}
