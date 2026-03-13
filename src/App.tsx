import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/pages/About";
import Products from "@/pages/Products";
import TransformerOil from "@/pages/TransformerOil";
import RubberProcessOil from "@/pages/RubberProcessOil";
import FinishedLubricants from "@/pages/FinishedLubricants";
import Logistics from "@/pages/Logistics";
import Quality from "@/pages/Quality";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Admin from "@/pages/Admin";
import Partners from "@/pages/Partners";
import AIKnowledge from "@/pages/AIKnowledge";
import { ArticleEditor } from "@/pages/Admin";
import Login from "@/pages/Login";
import Unsubscribe from "@/pages/Unsubscribe";
import SubscribersAdmin from "@/pages/SubscribersAdmin";
import AdminChat from "@/pages/AdminChat";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import ChatWidget from "@/components/ChatWidget";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useLocation } from "react-router-dom";

// Layout wrapper component
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminChat = location.pathname === '/admin/chat';
  
  if (isAdminChat) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            border: '1px solid #e5e7eb',
            padding: '16px 24px',
            fontSize: '15px',
            fontWeight: '500',
          },
          className: 'shadow-lg',
        }}
      />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/ai-knowledge" element={<AIKnowledge />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/transformer-oil" element={<TransformerOil />} />
          <Route path="/products/rubber-process-oil" element={<RubberProcessOil />} />
          <Route path="/products/finished-lubricants" element={<FinishedLubricants />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/new" element={<ArticleEditor />} />
          <Route path="/admin/edit/:id" element={<ArticleEditor />} />
          <Route path="/admin/subscribers" element={<SubscribersAdmin />} />
          <Route path="/admin/chat" element={<AdminChat />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Routes>
      </AppLayout>
    </div>
  );
}
