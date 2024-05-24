"use client";

import { AppProps } from "next/app";
import { AuthProvider } from "../contexts/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, []);

  return <div></div>;
}
