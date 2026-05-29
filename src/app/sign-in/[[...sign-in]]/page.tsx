import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0A09]">
      <SignIn
        appearance={{
          variables: {
            colorBackground: "#1C1917",
            colorInputBackground: "#292524",
            colorInputText: "#FAFAF9",
            colorText: "#FAFAF9",
            colorTextSecondary: "#A8A29E",
            colorPrimary: "#F97316",
            colorDanger: "#EF4444",
            borderRadius: "8px",
          },
          elements: {
            card: "shadow-none border border-[#2C2926]",
            headerTitle: "text-[#FAFAF9] font-semibold tracking-tight",
            headerSubtitle: "text-[#A8A29E]",
            socialButtonsBlockButton: "border-[#2C2926] bg-[#1C1917] text-[#FAFAF9] hover:bg-[#292524]",
            dividerLine: "bg-[#2C2926]",
            dividerText: "text-[#78716C]",
            formFieldLabel: "text-[#A8A29E] text-sm",
            formFieldInput: "bg-[#292524] border-[#2C2926] text-[#FAFAF9] focus:border-[#F97316]",
            footerActionLink: "text-[#F97316] hover:text-[#FB923C]",
          },
        }}
      />
    </div>
  );
}
