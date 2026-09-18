import { AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import ChatHeader from "./components/ChatHeader";
import ChatWindow from "./components/ChatWindow";
import WelcomeScreen from "./components/WelcomeScreen";
import RobotMascot from "./components/RobotMascot";
import Toast from "./components/Toast";
import ProModal from "./components/ProModal";
import AuthScreen from "./components/AuthScreen";
import { PageRouter } from "./components/pages/Pages";

function Shell() {
  const { view } = useApp();

  return (
    <div className="app-shell-bg relative flex h-dvh w-full max-w-[100vw] items-center justify-center overflow-hidden p-0 sm:p-3 lg:p-5">
      <RobotMascot />
      <MobileSidebar />

      <div className="glass-card relative flex h-full w-full max-w-[1440px] overflow-hidden rounded-none shadow-[0_30px_80px_-24px_rgba(80,60,160,0.35)] ring-1 ring-white/50 sm:h-[calc(100dvh-24px)] sm:rounded-[28px] lg:h-[calc(100dvh-40px)] lg:rounded-[36px]">
        <div className="sidebar-panel hidden h-full border-r border-white/60 md:flex">
          <Sidebar />
        </div>

        <div className="main-canvas flex min-w-0 flex-1 flex-col">
          <ChatHeader />
          <div className="relative min-h-0 flex-1">
            <AnimatePresence mode="wait">
              {view === "home" && <WelcomeScreen key="home" />}
              {view === "chat" && <ChatWindow key="chat" />}
              {view !== "home" && view !== "chat" && <PageRouter key={view} />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Toast />
      <ProModal />
      <AuthScreen />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
