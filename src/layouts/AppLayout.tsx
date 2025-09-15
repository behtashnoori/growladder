import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import BackButton from "@/components/nav/BackButton";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <div className="flex">
        <Navigation />
        <main className="flex-1 lg:mr-64">
          <div className="p-4 border-b border-border">
            <BackButton />
          </div>
          <div className="container mx-auto p-6 pt-0">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

