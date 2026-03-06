import React from 'react';
import { Routes, Route } from "react-router-dom";
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
import { ArticleEditor } from "@/pages/Admin";
import Login from "@/pages/Login";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
