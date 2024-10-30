
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import "./globals.css";


export const metadata ={
  title:"result",
  description: "A result page",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
         <div className="flex h-screen bg-gray-100">
            <Sidebar/>
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Navbar />
                <div className="p-4">
                {children}
                </div>
            </div>
        </div>
      
      </body>
    </html>
  );
}
