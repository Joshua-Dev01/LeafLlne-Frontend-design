import { motion } from "framer-motion";
import { useTheme } from "./theme";
import { Moon, Sun, Monitor } from "lucide-react";
import { Switch } from "antd";
import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

const themes: {
  value: Theme;
  label: string;
  previewColors: string[];
  icon: JSX.Element;
}[] = [
  {
    value: "dark",
    label: "Dark",
    previewColors: ["#1f1f1f", "#333", "#555", "#777"],
    icon: <Moon className="w-5 h-5 text-black dark:text-gray-100" />,
  },
  {
    value: "light",
    label: "Light",
    previewColors: ["#fefefe", "#d9d9d9", "#bfbfbf", "#a6a6a6"],
    icon: <Sun className="w-5 h-5 text-yellow-600" />,
  },
  {
    value: "system",
    label: "System",
    previewColors: ["#1f1f1f", "#f2f2f2", "#999", "#ccc"],
    icon: <Monitor className="w-5 h-5 text-blue-400" />,
  },
];

const AppearanceTab = () => {
  const { theme, setTheme } = useTheme();
  const [useSystem, setUseSystem] = useState(theme === "system");

  useEffect(() => {
    if (useSystem) {
      setTheme("system");
    }
  }, [useSystem, setTheme]);

  return (
    <div>
      <p className="dark:text-white text-2xl font-semibold mb-10">
        Appearance
      </p>
      <div className=" mt-12 rounded-3xl p-6 md:p-8 shadow-lg border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-black">
        {/* Theme Cards */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 ">
          {themes
            .filter((item) => item.value !== "system")
            .map((item) => (
              <motion.div
                key={item.value}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => !useSystem && setTheme(item.value)}
                className={`relative flex flex-col items-center w-full p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${
                  theme === item.value && !useSystem
                    ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] bg-white dark:bg-[#0d0d0d]"
                    : "shadow-sm hover:border-gray-500 bg-white dark:bg-[#0d0d0d]"
                } ${useSystem ? "opacity-60 pointer-events-none" : ""}`}
              >
                {/* Preview Box */}
                <div className="w-20 h-28 rounded-lg overflow-hidden bg-g">
                  <div
                    className="h-2/3 flex"
                    style={{
                      background: `linear-gradient(90deg, ${item.previewColors[0]}, ${item.previewColors[1]})`,
                    }}
                  ></div>
                  <div className="h-1/3 flex">
                    {item.previewColors.slice(2).map((color, i) => (
                      <div
                        key={i}
                        className="flex-1"
                        style={{ background: color }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Label + Icon */}
                <div className="flex items-center text-[19px] font-semibold gap-2 dark:text-gray-300 mt-6">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>

                {/* Active Indicator */}
                {theme === item.value && !useSystem && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-3 w-3 h-3 bg-blue-500 rounded-full border border-white shadow-lg"
                  />
                )}
              </motion.div>
            ))}
        </div>

        {/* System Switch */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-between bg-white shadow-xl dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl px-4 py-3"
        >
          <div>
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
              Use device settings
            </p>
            <p className="text-gray-500 text-xs">
              Automatically match your system’s theme
            </p>
          </div>
          <Switch
            checked={useSystem}
            onChange={(checked) => setUseSystem(checked)}
            className=""
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AppearanceTab;
