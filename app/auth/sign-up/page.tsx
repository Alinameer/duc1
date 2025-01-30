"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { signUpSchema } from "../AuthSchema";
import { signUp } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

const SignUp = () => {

  const { mutate } = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Error during signup:", error);
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    mutate(values);
  }

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
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
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormDescription>
                Make sure your password is at least 6 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Re-enter your password for confirmation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Submit</Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?
        <Link href="/auth/sign-in">
          <Button variant="link" className="font-medium text-primary underline hover:text-primary-dark">
            Sign up here
          </Button >
        </Link>
      </p>
      </form>
    </Form>
  );
};

export default SignUp;
