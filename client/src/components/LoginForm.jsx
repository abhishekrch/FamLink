import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginUser } from '../lib/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { toast } from 'sonner'; 

function LoginForm({ onLogin }) {
  const navigate = useNavigate();
  const form = useForm();

  async function onSubmit(data) {
    try {
      const response = await loginUser(data);
      onLogin(response.data.user);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
      toast.success('Logged in successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    }
  }

  return (
     <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} type='email' required />
                      </FormControl>
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
                            <Input placeholder="Password" {...field} type="password" required/>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
               <Button type="submit">Sign In</Button>
            </form>
        </Form>

        <div className="mt-4 text-center">
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/register')} className="text-blue-500 hover:underline">
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;