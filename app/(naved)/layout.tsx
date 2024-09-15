import Nav from "@/components/nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Nav/>
        <div className="flex-grow flex-1 flex flex-col">{children}</div>
    </>
  );
}