import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { TRPCProvider } from "@/components/providers/TRPCProvider";
import { Toaster } from "@/components/ui/toaster";
import { BatchNotificationListener } from "@/components/notifications/BatchNotificationListener";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <TRPCProvider>
      <div className="min-h-screen bg-black">
        <Sidebar />
        <div className="lg:pl-72">
          <Header />
          <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
      <Toaster />
      <BatchNotificationListener />
    </TRPCProvider>
  );
}
