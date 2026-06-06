"use client";

import Navbar from "@/components/bondok/Navbar";
import Hero from "@/components/bondok/Hero";
import Occasions from "@/components/bondok/Occasions";
import Seasons from "@/components/bondok/Seasons";
import Categories from "@/components/bondok/Categories";
import Products from "@/components/bondok/Products";
import SampleBundle from "@/components/bondok/SampleBundle";
import Top10 from "@/components/bondok/Top10";
import Bundles from "@/components/bondok/Bundles";
import Testimonials from "@/components/bondok/Testimonials";
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
import ScrollReveal from "@/components/bondok/ScrollReveal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ScrollReveal direction="up" delay={100}>
          <Categories />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100}>
          <Occasions />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0}>
          <Products />
        </ScrollReveal>
        <ScrollReveal direction="scale" delay={100}>
          <Top10 />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100}>
          <Bundles />
        </ScrollReveal>
        <ScrollReveal direction="scale" delay={100}>
          <SampleBundle />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100}>
          <Seasons />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100}>
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal direction="left" delay={100}>
          <About />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100}>
          <Contact />
        </ScrollReveal>
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
  );
}
