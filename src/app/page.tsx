"use client";

import { SiteProvider } from "@/context/SiteContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/bondok/Navbar";
import Hero from "@/components/bondok/Hero";
import Occasions from "@/components/bondok/Occasions";
import Seasons from "@/components/bondok/Seasons";
import Categories from "@/components/bondok/Categories";
import Products from "@/components/bondok/Products";
import SampleBundle from "@/components/bondok/SampleBundle";
import Top10 from "@/components/bondok/Top10";
import Bundles from "@/components/bondok/Bundles";
import About from "@/components/bondok/About";
import Contact from "@/components/bondok/Contact";
import Footer from "@/components/bondok/Footer";
import FloatingButtons from "@/components/bondok/FloatingButtons";
import CartDrawer from "@/components/bondok/CartDrawer";
import ProductModal from "@/components/bondok/ProductModal";
import QuizModal from "@/components/bondok/QuizModal";
import SpinWheel from "@/components/bondok/SpinWheel";
import SurpriseModal from "@/components/bondok/SurpriseModal";
import CheckoutModal from "@/components/bondok/CheckoutModal";
import OrderTracker from "@/components/bondok/OrderTracker";
import WishlistDrawer from "@/components/bondok/WishlistDrawer";

export default function Home() {
  return (
    <SiteProvider>
      <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Occasions />
          <Seasons />
          <Categories />
          <Products />
          <SampleBundle />
          <Top10 />
          <Bundles />
          <About />
          <Contact />
        </main>
        <Footer />
        <FloatingButtons />
        <CartDrawer />
        <CheckoutModal />
        <ProductModal />
        <QuizModal />
        <SpinWheel />
        <SurpriseModal />
        <OrderTracker />
        <WishlistDrawer />
      </div>
      </ErrorBoundary>
    </SiteProvider>
  );
}
