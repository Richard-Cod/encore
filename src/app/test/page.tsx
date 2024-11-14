"use client";
import LoginForm from "@/components/screens/MakeProcessCmp";
import Footer from "@/components/self/footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className=" flex-grow">
      <div className="w-fit ml-auto mr-2 mt-2">
        <Button size={"lg"}>Login</Button>
      </div>
      <div className="my-10"></div>
      <LoginForm />
    </div>
  );
}
