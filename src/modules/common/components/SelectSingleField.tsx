import type {
  FieldValues,
  Path,
  PathValue,
  UseControllerProps,
} from "react-hook-form";
import { useController } from "react-hook-form";
import type { SingleValue } from "react-select";
import type { DefaultOptions, SelectProps } from "./Select";
import { Select } from "./Select";
import classNames from "classnames";

export type SelectSingleFieldProps<
  TFields extends FieldValues,
  TName extends Path<TFields>
> = Omit<SelectProps<DefaultOptions, false>, "options" | "name"> &
  Omit<UseControllerProps<TFields, TName>, "name"> & {
    options: NonNullable<
      SingleValue<DefaultOptions<PathValue<TFields, TName>>>
    >[];
    name: TName;
  };

export function SelectSingleField<
  TFields extends FieldValues,
  TName extends Path<TFields>
>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  options,
  ...props
}: SelectSingleFieldProps<TFields, TName>) {
  const {
    field: { value, onChange },
  } = useController<TFields, TName>({
    name,
    control,
    defaultValue,
    shouldUnregister,
    rules,
  });

  return (
    <Select
      {...props}
      className={classNames(["react-select-container", props.className])}
      options={options}
      value={value ? options.filter((c) => c.value === value) : null}
      onChange={(val) => onChange(val?.value || null)}
    />
  );
}
