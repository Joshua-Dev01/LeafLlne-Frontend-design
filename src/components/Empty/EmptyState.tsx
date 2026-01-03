
import { Inbox } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  buttonText?: string
  onAction?: () => void
}

export const EmptyState = ({
  title = "No data available",
  description = "It looks like there’s nothing here yet. Start by adding something new!",
  buttonText = "Add New",
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center h-full py-10">
      <Card className="w-full max-w-md mx-auto border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#090909] shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center text-center p-10 space-y-5">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full"
          >
            <Inbox className="w-12 h-12 text-gray-600 dark:text-gray-400" />
          </motion.div>

          {/* Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {description}
            </p>
          </motion.div>

          {/* Optional Action Button */}
          {onAction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                onClick={onAction}
                className="mt-4 bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white hover:opacity-90 transition rounded-xl"
              >
                {buttonText}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
