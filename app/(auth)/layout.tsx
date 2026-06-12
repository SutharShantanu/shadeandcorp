import SilkBackground from "@/components/ui/SilkBackground";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-svh w-full flex flex-col">
      <SilkBackground />
      {/* Content wrapper */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
