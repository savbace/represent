import { Button, Tooltip } from "@nextui-org/react";
import { useRef, useState } from "react";

interface CopyImageButtonProps {
  onPress(): Promise<void> | void;
}

export default function CopyImageButton({ onPress }: CopyImageButtonProps) {
  const [pressed, setPressed] = useState(false);
  const timeoutId = useRef<number>();

  const handlePress = async () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    await onPress();

    setPressed(true);
    const timeout = setTimeout(() => {
      setPressed(false);
      timeoutId.current = undefined;
    }, 2000);

    timeoutId.current = Number(timeout);
  };

  return (
    <Tooltip content="Copied!" color="success" isOpen={pressed} placement="right">
      <Button color="primary" onPress={handlePress} className="mt-2">
        Copy to clipboard
      </Button>
    </Tooltip>
  );
}
