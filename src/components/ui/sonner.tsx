import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",

          // ✅ Success → Twitter nav blue
          "--success-bg": "#15202B", // nav blue
          "--success-text": "#ffffff",
          "--success-border": "#1DA1F2", // accent border

          // ✅ Error → Dark Red
          "--error-bg": "#7f1d1d", // dark red background
          "--error-text": "#ffffff",
          "--error-border": "#b91c1c", // slightly lighter red border
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
