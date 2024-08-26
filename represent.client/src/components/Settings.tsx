import { Radio, RadioGroup, Select, SelectItem } from "@nextui-org/react";

type TextColor = "white" | "black";
type RouteColor = "red" | "blue" | "green";

export interface SettingsOptions {
  textColor: TextColor;
  routeColor: RouteColor;
}

interface SettingsProps {
  options: SettingsOptions;
  onChange?(options: SettingsOptions): void;
}

// todo: implement
const templates = [
  { key: "default", label: "Default" },
  { key: "minimal", label: "Minimal" },
];

export default function Settings({ onChange, options }: SettingsProps) {
  return (
    <div className="my-4">
      <Select label="Template" defaultSelectedKeys={["default"]} className="my-2 max-w-xs">
        {templates.map((template) => (
          <SelectItem key={template.key}>{template.label}</SelectItem>
        ))}
      </Select>
      <RadioGroup
        label="Text color"
        orientation="horizontal"
        value={options.textColor}
        onValueChange={(value) => onChange?.({ ...options, textColor: value as TextColor })}
      >
        <Radio value="white">⬜ White</Radio>
        <Radio value="black">⬛ Black</Radio>
      </RadioGroup>
      <RadioGroup
        className="mt-2"
        label="Route color"
        orientation="horizontal"
        value={options.routeColor}
        onValueChange={(value) => onChange?.({ ...options, routeColor: value as RouteColor })}
      >
        <Radio value="red">🟥 Red</Radio>
        <Radio value="blue">🟦 Blue</Radio>
        <Radio value="green">🟩 Green</Radio>
      </RadioGroup>
    </div>
  );
}
