"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { signInSchema } from "../AuthSchema"; // assuming this is where your schema is located
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { signin } from "@/api/api";
import Link from "next/link";

// Updated API endpoint
// const signIn = async (data: { username: string; password: string }) => {
//   const response = await fetch("http://192.168.0.148:8000/api/user/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to register user");
//   }

//   return response.json();
// };

const SignIn = () => {
  const { mutate } = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Error during login:", error);
    },
  });

  function onSubmit(values: z.infer<typeof signInSchema>) {
    mutate(values);
  }

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Make sure your password is at least 6 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/auth/sign-up">
          <Button variant="link" className="font-medium text-primary underline hover:text-primary-dark">
            Sign up here
          </Button >
        </Link>
      </p>
      </form>
    </Form>
  );
};

export default SignIn;
