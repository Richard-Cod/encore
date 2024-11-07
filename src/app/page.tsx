"use client";
import LoginForm from "@/components/screens/login";
import Footer from "@/components/self/footer";

export default function Home() {
  return (
    <div className=" flex-grow">
      <div className="my-10"></div>
      <LoginForm />
    </div>
  );
}
