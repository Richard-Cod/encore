"use client";
import LoginForm from "@/components/screens/MakeProcessCmp";
import LogUserInForm from "@/components/screens/logUserIn";
import Footer from "@/components/self/footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className=" flex-grow">
      <div className="my-10"></div>

      <div className="max-w-lg mx-auto">
        <LogUserInForm />
      </div>
    </div>
  );
}
