import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/modules/common/components/ui/button";
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const { toggle, theme } = useTheme();

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={() => {
        toggle();
      }}
    >
      {theme === "dark" ? (
        <Moon className="absolute h-[1.2rem] w-[1.2rem]  " />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]    " />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
