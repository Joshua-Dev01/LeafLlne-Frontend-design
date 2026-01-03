import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "../../../utils/logout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    toast.success("Logged out", {
      className:
        "bg-gradient-to-r from-[#1e1e2f] to-[#2a2a40] text-white border border-gray-700 shadow-xl shadow-black/40",
      description: "You have been successfully logged out.",
    });

    setTimeout(() => {
      navigate("/auth/login", { replace: true });
    }, 500);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-all cursor-pointer hover:bg-gray-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md rounded-2xl bg-gradient-to-b from-[#1a1a27] to-[#101018] text-white border border-gray-700 shadow-2xl shadow-black/60">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 shadow-inner shadow-red-900">
            <LogOut className="w-7 h-7" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-white drop-shadow-lg">
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 text-sm">
              Are you sure you want to log out? You will need to log in again to
              access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="flex flex-col  gap-3 mt-4">
          <AlertDialogCancel className="bg-[#2f2f40] text-gray-300 hover:bg-[#3b3b4f] rounded-xl px-4 py-2 shadow-md shadow-black/40 transition-all cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-red-800 hover:bg-red-600 text-white rounded-xl px-4 py-2 shadow-lg  transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
